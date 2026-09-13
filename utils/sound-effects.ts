// utils/sound-effects.ts
// Zero-dependency native Web Audio API synthesized sound effects for child-friendly feedback

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cheerful pentatonic chime for correct answers
  public playCorrectChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, startTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.08);
      osc.stop(startTime + idx * 0.08 + 0.36);
    });
  }

  // Soft, warm, encouraging boop for incorrect answers (non-punishing)
  public playIncorrectBoop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, startTime); // A3
    osc.frequency.exponentialRampToValueAtTime(164.81, startTime + 0.22); // E3

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  }

  // Joyful victory fanfare when passing the quiz
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const melody = [
      { freq: 392.0, time: 0.0, dur: 0.12 }, // G4
      { freq: 523.25, time: 0.12, dur: 0.12 }, // C5
      { freq: 659.25, time: 0.24, dur: 0.14 }, // E5
      { freq: 783.99, time: 0.38, dur: 0.35 }, // G5
      { freq: 1046.5, time: 0.65, dur: 0.6 }, // C6
    ];

    const startTime = ctx.currentTime;

    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.freq, startTime + note.time);

      gain.gain.setValueAtTime(0.001, startTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + note.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + note.time + note.dur
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + note.time);
      osc.stop(startTime + note.time + note.dur + 0.02);
    });
  }
}

export const soundEffects = new SoundEffectsManager();
