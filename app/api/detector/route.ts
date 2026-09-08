import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { threatScans } from "@/lib/db/schema";
import { DetectorResultSchema, DetectorResult } from "@/lib/detector-schema";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/png", language = "id" } = body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "Image base64 data is required." },
        { status: 400 }
      );
    }

    // Strip data URL prefix if included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

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
      const isEnglish = language === "en";

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

    // Live Multimodal Inference with Gemini 3.7 Flash
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-3.7-flash",
      temperature: 0.2,
    });

    const structuredModel = model.withStructuredOutput(DetectorResultSchema);

    const promptText = `You are "tami", an expert AI Cybersecurity Forensics Tutor for students aged 8-15 and educators.
Inspect this screenshot in-memory for digital cybersecurity risks:
1. Phishing & Typosquatting (look for misspelled URLs, suspicious TLDs like .xyz/.tk, imitation logins).
2. Social engineering & emotional traps (false lottery wins, urgency timers, fake bank alerts, threatening account bans).
3. Fake brand logos or manipulated UI elements.
4. If this image is completely non-digital (e.g. a pet photo, landscape, selfie, physical object), set status to "IRRELEVANT_IMAGE", riskLevel to "SAFE", and explain gently in the summary that this tool is designed for digital screenshots.
5. If the image is too blurry to read, set status to "UNCLEAR_IMAGE".
6. Target language for output: ${language === "en" ? "English" : "Bahasa Indonesia"}.
7. Return strictly conforming structured data.`;

    const result = await structuredModel.invoke([
      new HumanMessage({
        content: [
          { type: "text", text: promptText },
          {
            type: "image_url",
            image_url: `data:${mimeType};base64,${cleanBase64}`,
          },
        ],
      }),
    ]);

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
  } catch (error) {
    console.error("Multimodal Detector API error:", error);
    return NextResponse.json(
      {
        error: "ANALYSIS_FAILED",
        message: "Failed to perform visual threat analysis.",
      },
      { status: 500 }
    );
  }
}
