import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { threatScans } from "@/lib/db/schema";
import { DetectorResultSchema, DetectorResult } from "@/lib/detector-schema";
import { SAMPLE_PRESET_RESULTS } from "@/lib/detector-presets";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

export const maxDuration = 45; // 45 seconds max duration for complex analysis
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/png", language = "id", sampleId } = body;

    const normalizedLang = language === "en" ? "en" : "id";

    // 1. Instant Pre-computed Preset Lookup (Zero Token & Zero Latency)
    if (sampleId && SAMPLE_PRESET_RESULTS[normalizedLang]?.[sampleId]) {
      const presetResult = SAMPLE_PRESET_RESULTS[normalizedLang][sampleId];

      const session = await auth();
      if (session?.user?.id && db) {
        try {
          await db.insert(threatScans).values({
            id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            userId: session.user.id,
            riskLevel: presetResult.riskLevel,
            confidenceScore: presetResult.confidenceScore,
            headline: presetResult.headline,
            scannedAt: new Date(),
          });
        } catch (dbErr) {
          console.error("Failed to persist preset threat scan to Neon DB:", dbErr);
        }
      }

      return NextResponse.json(presetResult);
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "Image data is required." },
        { status: 400 }
      );
    }

    // 2. Base64 Sanitization & SVG Normalization
    let cleanBase64 = "";
    let cleanMimeType = mimeType;

    if (imageBase64.startsWith("data:")) {
      const match = imageBase64.match(/^data:([^;,]+)(?:;charset=[^;,]+)?(?:;(utf8|base64))?,(.*)$/i);
      if (match) {
        cleanMimeType = match[1] || cleanMimeType;
        const encoding = match[2]?.toLowerCase();
        const rawContent = match[3];

        if (encoding === "utf8" || !encoding) {
          // URL-encoded or raw SVG string, convert to standard Base64
          const decoded = decodeURIComponent(rawContent);
          cleanBase64 = Buffer.from(decoded, "utf8").toString("base64");
        } else {
          cleanBase64 = rawContent;
        }
      } else {
        cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
      }
    } else {
      cleanBase64 = imageBase64;
    }

    // Google Gemini inlineData does not accept image/svg+xml. Map to image/png or image/jpeg.
    if (cleanMimeType.includes("svg")) {
      cleanMimeType = "image/png";
    }

    // Check payload size (max 5MB Base64 ~ 7MB raw string)
    if (cleanBase64.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PAYLOAD_TOO_LARGE", message: "Image size exceeds 5MB." },
        { status: 413 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Simulated fallback analysis when GEMINI_API_KEY is not configured
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const isEnglish = normalizedLang === "en";

      // Return high-quality deterministic educational mock result
      const mockResult: DetectorResult = {
        status: "ANALYZED",
        riskLevel: "DANGEROUS",
        confidenceScore: 96,
        headline: isEnglish
          ? "Phishing & Fake Domain Anomaly Detected"
          : "Anomali Phishing & Domain Palsu Terdeteksi",
        summary: isEnglish
          ? "This screenshot exhibits classic credential-harvesting phishing patterns. The domain URL deviates from the official service and creates false urgency regarding free in-game items."
          : "Tangkapan layar ini menunjukkan pola rekayasa sosial phishing untuk mencuri kata sandi. Alamat situs bukan domain resmi dan menggunakan iming-iming hadiah gratis dengan desakan waktu.",
        ocrText:
          "KLAIM 10.000 DIAMOND GRATIS SEKARANG! Masuk dengan akun kamu di: https://free-diamonds-claim-login.xyz/auth?id=99281 (Sisa waktu 05:00 menit!)",
        anomaliesFound: [
          {
            category: isEnglish ? "Domain Typosquatting" : "Manipulasi Domain (Typosquatting)",
            description: isEnglish
              ? "URL uses unofficial TLD (.xyz) instead of the verified game developer domain."
              : "URL menggunakan domain mencurigakan (.xyz) dan bukan domain resmi pengembang game.",
            severity: "high",
          },
          {
            category: isEnglish ? "False Emotional Urgency" : "Desakan Waktu Palsu",
            description: isEnglish
              ? "Countdown timer (5 minutes remaining) designed to rush the victim into bypassing critical thinking."
              : "Hitung mundur (5 menit) dirancang untuk memicu kepanikan agar korban tidak sempat berpikir kritis.",
            severity: "high",
          },
          {
            category: isEnglish ? "Credential Harvesting Trap" : "Permintaan Login Tidak Resmi",
            description: isEnglish
              ? "Direct login prompt outside of official app or trusted OAuth authentication screen."
              : "Form login langsung di situs pihak ketiga yang tidak aman.",
            severity: "high",
          },
        ],
        reflectionQuestions: [
          isEnglish
            ? "Why would an official game developer need you to log in on an external website to give away items?"
            : "Mengapa pengembang game resmi tidak pernah meminta login di situs web lain hanya untuk membagikan item?",
          isEnglish
            ? "What parts of the web address (URL) look different compared to the real official portal?"
            : "Bagian mana dari alamat tautan (URL) yang terlihat berbeda jika dibandingkan dengan situs resmi aslinya?",
        ],
        safetyTips: [
          isEnglish
            ? "Never type your username or password into unverified external web links."
            : "Jangan pernah memasukkan nama pengguna atau kata sandi pada tautan eksternal yang tidak diverifikasi.",
          isEnglish
            ? "Always navigate directly through the official game application or verified website bookmark."
            : "Selalu buka game atau layanan langsung dari aplikasi resmi, bukan melalui tautan di pesan.",
          isEnglish
            ? "Enable Two-Factor Authentication (2FA) on your account as an additional defense shield."
            : "Aktifkan Autentikasi Dua Faktor (2FA) pada akunmu untuk lapisan perlindungan ekstra.",
        ],
        exploitSimulation: {
          scenarioTitle: isEnglish
            ? "What happens if you click this diamond claim link?"
            : "Apa yang terjadi jika kamu mengeklik link klaim diamond ini?",
          steps: [
            {
              step: 1,
              title: isEnglish ? "Deceptive Page Load" : "Pemuatan Halaman Tiruan",
              victimView: isEnglish
                ? "A flashy web page appears with game artwork asking you to log in to receive 10,000 diamonds."
                : "Muncul halaman web berkilau dengan logo game favoritmu yang meminta memasukkan username dan kata sandi.",
              behindTheScenes: isEnglish
                ? "The fake site records keystrokes and IP address without contacting official game servers."
                : "Situs tiruan merekam setiap ketikan kata sandi dan langsung menyimpannya ke database milik penyerang.",
              lossRisk: isEnglish ? "Login credentials captured" : "Kredensial login tercuri",
            },
            {
              step: 2,
              title: isEnglish ? "Session Hijack & Password Reset" : "Pembajakan Sesi & Penggantian Kata Sandi",
              victimView: isEnglish
                ? "The screen says 'System Error: Please wait 24 hours' to stall your reaction."
                : "Layar menampilkan pesan palsu 'Error: Tunggu 24 jam untuk verifikasi item' agar kamu tidak segera curiga.",
              behindTheScenes: isEnglish
                ? "Automated bot logs in using your stolen password and immediately changes linked email and phone number."
                : "Bot peretas otomatis masuk ke akun aslimu dan mengganti email pemulihan serta nomor handphone.",
              lossRisk: isEnglish ? "Total loss of account access" : "Akses akun hilang sepenuhnya",
            },
            {
              step: 3,
              title: isEnglish ? "In-Game Inventory Liquidation" : "Penjualan Seluruh Item & Skin",
              victimView: isEnglish
                ? "Friends start asking why your character is messaging them asking for emergency money."
                : "Teman-temanmu mulai bertanya mengapa akunmu mengirim pesan pinjam uang atau jual skin murah.",
              behindTheScenes: isEnglish
                ? "All valuable items, diamonds, and inventory are gifted or traded away to the scammer's mules."
                : "Item langka dan diamond dipindahkan ke akun penampung untuk dijual dengan uang tunai.",
              lossRisk: isEnglish ? "Financial loss and social reputation damage" : "Kerugian materi dan rusaknya reputasi di antara teman",
            },
          ],
          mitigationAdvice: isEnglish
            ? "If you ever typed your password into a suspicious page: immediately open the REAL app/website, change your password, kick all active sessions, and notify parents/teachers."
            : "Jika kamu terlanjur memasukkan kata sandi ke link asing: segera buka aplikasi ASLI, ganti kata sandi secepatnya, keluar dari semua perangkat yang aktif, dan beri tahu orang tua atau guru.",
        },
        isRelevantDigitalMessage: true,
      };

      const session = await auth();
      if (session?.user?.id && db) {
        try {
          await db.insert(threatScans).values({
            id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            userId: session.user.id,
            riskLevel: mockResult.riskLevel,
            confidenceScore: mockResult.confidenceScore,
            headline: mockResult.headline,
            scannedAt: new Date(),
          });
        } catch (dbErr) {
          console.error("Failed to persist fallback threat scan to Neon DB:", dbErr);
        }
      }

      return NextResponse.json(mockResult);
    }

    // 3. Live Multimodal Inference with Gemini Models (with high-demand fallback)
    const modelsToTry = ["gemini-3.7-flash", "gemini-3.6-flash"];
    let lastError: unknown = null;
    let result: DetectorResult | null = null;

    const promptText = `You are "tami", an expert AI Cybersecurity Forensics Tutor for students aged 8-15 and educators.
Inspect this screenshot in-memory for digital cybersecurity risks:
1. Phishing & Typosquatting (look for misspelled URLs, suspicious TLDs like .xyz/.tk, imitation logins).
2. Social engineering & emotional traps (false lottery wins, urgency timers, fake bank alerts, threatening account bans).
3. Fake brand logos or manipulated UI elements.
4. If this is a digital threat (SUSPICIOUS or DANGEROUS), provide an "exploitSimulation" detailing step-by-step what would happen if a student actually fell for the scam and clicked or logged in (what appears on victim's screen vs what happens behind the scenes by the attacker).
5. If this image is completely non-digital (e.g. a pet photo, landscape, selfie, physical object), set status to "IRRELEVANT_IMAGE", riskLevel to "SAFE", and explain gently in the summary that this tool is designed for digital screenshots.
6. If the image is too blurry to read, set status to "UNCLEAR_IMAGE".
7. Target language for output: ${normalizedLang === "en" ? "English" : "Bahasa Indonesia"}.
8. Return strictly conforming structured data.`;

    for (const modelName of modelsToTry) {
      try {
        const model = new ChatGoogleGenerativeAI({
          apiKey,
          model: modelName,
          temperature: 0.2,
          maxRetries: 1,
        });

        const structuredModel = model.withStructuredOutput(DetectorResultSchema);

        result = (await structuredModel.invoke([
          new HumanMessage({
            content: [
              { type: "text", text: promptText },
              {
                type: "image_url",
                image_url: `data:${cleanMimeType};base64,${cleanBase64}`,
              },
            ],
          }),
        ])) as DetectorResult;

        if (result) break;
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Detector model ${modelName} failed, trying next fallback if available:`, err);
      }
    }

    if (!result) {
      throw lastError || new Error("All vision models failed to evaluate image.");
    }

    const session = await auth();
    if (session?.user?.id && db) {
      try {
        await db.insert(threatScans).values({
          id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: session.user.id,
          riskLevel: result.riskLevel,
          confidenceScore: result.confidenceScore,
          headline: result.headline,
          scannedAt: new Date(),
        });
      } catch (dbErr) {
        console.error("Failed to persist live threat scan to Neon DB:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Multimodal Detector API error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const isOverloaded =
      errorMessage.includes("503") ||
      errorMessage.includes("high demand") ||
      errorMessage.includes("Service Unavailable") ||
      errorMessage.includes("RESOURCE_EXHAUSTED");

    return NextResponse.json(
      {
        error: isOverloaded ? "SERVER_BUSY" : "ANALYSIS_FAILED",
        message: isOverloaded
          ? "AI model is currently experiencing high temporary demand. Please try again in a few moments."
          : "Failed to perform visual threat analysis.",
      },
      { status: isOverloaded ? 503 : 500 }
    );
  }
}
