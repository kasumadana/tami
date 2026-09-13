export type QuizOptionKey = "A" | "B" | "C" | "D";

export const PHONETIC_KEYWORDS: Record<QuizOptionKey, string[]> = {
  A: [
    "a", "alpha", "alfa", "option a", "opsi a", "pilihan a", "jawaban a",
    "satu", "one", "pertama", "first", "apel", "apple", "ayam", "air"
  ],
  B: [
    "b", "bravo", "beta", "option b", "opsi b", "pilihan b", "jawaban b",
    "dua", "two", "kedua", "second", "bebek", "buku", "bola", "banana", "batu", "bintang"
  ],
  C: [
    "c", "charlie", "ce", "option c", "opsi c", "pilihan c", "jawaban c",
    "tiga", "three", "ketiga", "third", "cacing", "ceri", "cherry", "cat", "cokelat"
  ],
  D: [
    "d", "delta", "de", "option d", "opsi d", "pilihan d", "jawaban d",
    "empat", "four", "keempat", "fourth", "domba", "dadu", "dice", "dog", "daun"
  ],
};

export function parseVoiceAnswer(transcript: string): {
  option: QuizOptionKey | null;
  matchedKeyword?: string;
} {
  if (!transcript || typeof transcript !== "string") {
    return { option: null };
  }

  const clean = transcript.trim().toLowerCase().replace(/[.,!?:;'"_]/g, "");
  if (!clean) return { option: null };

  const words = clean.split(/\s+/).filter(Boolean);

  // 1. Direct match on each option's registered keywords
  for (const option of ["A", "B", "C", "D"] as QuizOptionKey[]) {
    const list = PHONETIC_KEYWORDS[option];
    for (const kw of list) {
      if (clean === kw || words.includes(kw)) {
        return { option, matchedKeyword: kw };
      }
    }
  }

  // 2. Phrase contains check
  for (const option of ["A", "B", "C", "D"] as QuizOptionKey[]) {
    const list = PHONETIC_KEYWORDS[option];
    for (const kw of list) {
      if (clean.includes(kw)) {
        return { option, matchedKeyword: kw };
      }
    }
  }

  // 3. First significant word initial letter heuristic
  for (const w of words) {
    if (w.length >= 2) {
      const firstChar = w[0].toUpperCase();
      if (firstChar === "A" || firstChar === "B" || firstChar === "C" || firstChar === "D") {
        return { option: firstChar as QuizOptionKey, matchedKeyword: w };
      }
    }
  }

  return { option: null };
}

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
  detectedOption: QuizOptionKey | null;
  matchedKeyword?: string;
}

export interface SpeechRecognizerOptions {
  locale?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (payload: SpeechRecognitionResultPayload) => void;
  onError?: (error: string) => void;
  onStateChange?: (isListening: boolean) => void;
}

interface ISpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export class SpeechRecognizerService {
  private recognition: ISpeechRecognitionInstance | null = null;
  private isListening = false;
  private shouldRestart = true;
  private options: SpeechRecognizerOptions;

  constructor(options: SpeechRecognizerOptions = {}) {
    this.options = {
      locale: options.locale || "id-ID",
      continuous: options.continuous ?? true,
      interimResults: options.interimResults ?? true,
      ...options,
    };
  }

  static isSupported(): boolean {
    if (typeof window === "undefined") return false;
    const windowAny = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    return !!(windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition);
  }

  setLocale(locale: string) {
    this.options.locale = locale === "en" ? "en-US" : "id-ID";
    if (this.recognition && this.isListening) {
      this.stop();
      this.start();
    }
  }

  start() {
    if (typeof window === "undefined") return;
    if (!SpeechRecognizerService.isSupported()) {
      this.options.onError?.("Web Speech API tidak didukung di peramban ini.");
      return;
    }

    if (this.isListening) return;

    try {
      const windowAny = window as unknown as {
        SpeechRecognition?: new () => ISpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
      };
      const SpeechRecognitionConstructor =
        windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition;
      if (!SpeechRecognitionConstructor) return;

      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.lang = this.options.locale || "id-ID";
      this.recognition.continuous = this.options.continuous ?? true;
      this.recognition.interimResults = this.options.interimResults ?? true;

      this.shouldRestart = true;

      this.recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        if (!lastResult) return;

        const transcript = lastResult[0]?.transcript || "";
        const isFinal = lastResult.isFinal;
        const parsed = parseVoiceAnswer(transcript);

        this.options.onResult?.({
          transcript,
          isFinal,
          detectedOption: parsed.option,
          matchedKeyword: parsed.matchedKeyword,
        });
      };

      this.recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        if (event.error === "no-speech") return;
        this.options.onError?.(event.error);
      };

      this.recognition.onend = () => {
        if (this.shouldRestart && this.isListening) {
          try {
            this.recognition?.start();
          } catch {
            this.isListening = false;
            this.options.onStateChange?.(false);
          }
        } else {
          this.isListening = false;
          this.options.onStateChange?.(false);
        }
      };

      this.recognition.start();
      this.isListening = true;
      this.options.onStateChange?.(true);
    } catch (err) {
      this.options.onError?.(
        err instanceof Error ? err.message : "Gagal memulai mikrofon suara."
      );
      this.isListening = false;
      this.options.onStateChange?.(false);
    }
  }

  stop() {
    this.shouldRestart = false;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
    this.options.onStateChange?.(false);
  }
}
