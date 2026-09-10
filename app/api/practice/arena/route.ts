import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { practiceRecords } from "@/lib/db/schema";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

export const runtime = "nodejs";

const ArenaEvaluationSchema = z.object({
  scammerMessage: z.string().describe("Tanggapan penipu berikutnya yang berusaha memanipulasi korban (atau pengakuan kalah jika ronde 3 selesai dan korban tangguh)"),
  coachWhisper: z.string().describe("Bisikan taktis dari tami sebagai corner coach yang memandu nalar kritis siswa"),
  defenseScore: z.number().min(0).max(100).describe("Skor ketahanan pertahanan siber siswa sejauh ini (0-100)"),
  leakDetected: z.boolean().describe("Apakah siswa membocorkan rahasia penting (kata sandi, OTP, nomor HP, uang)"),
  isConcluded: z.boolean().describe("Apakah simulasi selesai (setelah ronde 3 atau terjadi kebocoran fatal)"),
  verdict: z.enum(["VICTORY", "DEFEAT", "ONGOING"]).describe("Hasil pertarungan"),
  educationalSummary: z.string().describe("Pelajaran taktis yang dapat dipetik dari interaksi ini"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      scenarioId = "free_skin",
      round = 1,
      userResponse = "",
      conversationHistory = [],
      language = "id",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const isEnglish = language === "en";

    // Offline / Mock deterministic fallback
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const lower = userResponse.toLowerCase();
      const hasLeaked =
        lower.includes("123") ||
        lower.includes("password") ||
        lower.includes("sandi") ||
        lower.includes("otp") ||
        lower.includes("kirim") ||
        lower.includes("ini dia");

      if (round >= 3 || hasLeaked) {
        const isVictory = !hasLeaked;
        const mockResult = {
          scammerMessage: isVictory
            ? isEnglish
              ? "Darn it! You're not falling for anything. I'm moving on to someone easier..."
              : "Sial, kamu terlalu teliti dan tidak mau menyerahkan datamu. Aku cari mangsa lain saja..."
            : isEnglish
              ? "Hahaha thanks for the account info! Goodbye!"
              : "Terima kasih infonya! Akunmu sekarang sudah berpindah tangan, dadah!",
          coachWhisper: isVictory
            ? isEnglish
              ? "Superb defense! You refused to leak secrets and demanded official validation. You won the arena!"
              : "Luar biasa! Kamu teguh memegang prinsip keamanan, tidak panik, dan menolak membocorkan kredensial. Kamu memenangkan arena ini!"
            : isEnglish
              ? "Ouch! You leaked confidential data. Scammers always exploit trust or panic."
              : "Aduh! Kamu memberikan informasi sensitif. Penipu memanfaatkan rasa panik atau iming-iming hadiah untuk memancing rahasiamu.",
          defenseScore: isVictory ? 95 : 30,
          leakDetected: hasLeaked,
          isConcluded: true,
          verdict: isVictory ? "VICTORY" : "DEFEAT",
          educationalSummary: isVictory
            ? isEnglish
              ? "You successfully identified psychological pressure tactics and held your defensive perimeter."
              : "Kamu berhasil mengidentifikasi taktik manipulasi psikologis dan mempertahankan batas keamananmu."
            : isEnglish
              ? "Never share passwords, OTPs, or verify accounts on unofficial channels."
              : "Jangan pernah membagikan kata sandi, kode OTP, atau mengeklik tautan verifikasi dari pesan pribadi.",
        };

        return NextResponse.json(mockResult);
      }

      // Progression between round 1 and 2
      const mockResult = {
        scammerMessage:
          round === 1
            ? isEnglish
              ? "Look, this exclusive item disappears in exactly 3 minutes. Just send your verification code so I can activate the free tier for you!"
              : "Dengar, hadiah eksklusif ini cuma berlaku 3 menit lagi. Cepat kirim kode SMS yang baru masuk ke HP-mu supaya bisa kuaktifkan sekarang!"
            : isEnglish
              ? "Are you calling me a liar?! I'm an official moderator! If you don't comply right now, your game ID will be permanently banned!"
              : "Kamu meragukanku?! Aku ini staf admin resmi! Kalau kamu tidak patuh sekarang juga, ID game kamu akan ku-banned permanen!",
        coachWhisper:
          round === 1
            ? isEnglish
              ? "Notice the artificial time pressure ('3 minutes'). Scammers rush you so you don't think clearly. How will you respond?"
              : "Perhatikan desakan waktu buatan ('3 menit lagi'). Penipu selalu memburu-burumu agar kamu tidak sempat berpikir jernih. Apa langkahmu?"
            : isEnglish
              ? "Now they are shifting to intimidation and false authority. Legitimate admins never demand passwords or threaten instant bans via chat!"
              : "Sekarang dia beralih menakut-nakutimu dengan ancaman 'banned'. Ingat, admin resmi TIDAK PERNAH meminta kode OTP atau mengancam banned lewat chat pribadi!",
        defenseScore: 70,
        leakDetected: false,
        isConcluded: false,
        verdict: "ONGOING",
        educationalSummary: isEnglish
          ? "Stay calm and do not let urgency push you into impulsive decisions."
          : "Tetap tenang dan jangan biarkan rasa panik memaksamu mengambil keputusan gegabah.",
      };

      return NextResponse.json(mockResult);
    }

    // Live AI Evaluation with Gemini
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash-lite",
      temperature: 0.4,
    });

    const structuredModel = model.withStructuredOutput(ArenaEvaluationSchema);

    const systemPrompt = `You are the game master of the "Social Engineering Arena" in tami, a cybersecurity learning web app for youth aged 8-15.
Scenario: ${scenarioId}
Current Round: ${round} of 3.
You have two roles:
1. "scammerMessage": Act as the scammer using realistic psychological manipulation (greed for skins, fear of punishment, fake authority, urgent deadlines). If round is 3 and the student successfully defended without leaking credentials, admit defeat in frustration and retreat.
2. "coachWhisper": Act as "tami", the encouraging, wise cybersecurity corner coach. Whisper Socratic feedback to the student about why the scammer's move is tricky and what clues they should watch out for.
Target language: ${isEnglish ? "English" : "Bahasa Indonesia"}.
Return strictly structured response.`;

    const formattedHistory = conversationHistory
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `Conversation History:\n${formattedHistory}\nSTUDENT'S LATEST MOVE: "${userResponse}"\nEvaluate the student's defensive stance and generate the next turn.`;

    const result = await structuredModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(prompt),
    ]);

    // Persist to practiceRecords if concluded with victory
    const session = await auth();
    if (session?.user?.id && db && result.isConcluded && result.verdict === "VICTORY") {
      try {
        await db.insert(practiceRecords).values({
          id: `record_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: session.user.id,
          challengeId: `arena_${scenarioId}`,
          score: result.defenseScore,
          badgeEarned: "social_engineering_shield",
          completedAt: new Date(),
        });
      } catch (err) {
        console.error("Failed to persist arena record:", err);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Arena API error:", error);
    return NextResponse.json(
      { error: "ARENA_ERROR", message: "Failed to evaluate arena interaction." },
      { status: 500 }
    );
  }
}
