import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import {
  decodeGuestCookie,
  encodeGuestCookie,
  getQuotaStatus,
  GUEST_COOKIE_NAME,
} from "@/lib/guest-quota";
import { SOCRATIC_SYSTEM_PROMPT } from "@/lib/socratic-prompt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

interface ChatMessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessageInput[] = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Messages array is required." },
        { status: 400 }
      );
    }

    // 1. Verify authentication and guest quota
    const session = await auth();
    const isAuthenticated = !!session?.user?.id;

    let turnsRemaining = 999;
    let newCookieValue = "";
    let newTurnsUsed = 0;

    if (!isAuthenticated) {
      const cookieStore = await cookies();
      const rawGuestCookie = cookieStore.get(GUEST_COOKIE_NAME)?.value;
      const sessionData = decodeGuestCookie(rawGuestCookie);
      const quota = getQuotaStatus(sessionData.turnsUsed);

      if (quota.isExceeded) {
        return NextResponse.json(
          {
            error: "QUOTA_EXCEEDED",
            message: "Guest turns exhausted. Sign in to continue learning with tami.",
            turnsRemaining: 0,
            turnsUsed: quota.turnsUsed,
          },
          { status: 403 }
        );
      }

      newTurnsUsed = sessionData.turnsUsed + 1;
      newCookieValue = encodeGuestCookie({
        turnsUsed: newTurnsUsed,
        createdAt: sessionData.createdAt || Date.now(),
      });
      turnsRemaining = Math.max(0, quota.maxTurns - newTurnsUsed);
    }

    // 2. Prepare AI chat messages with Socratic System Prompt Grounding
    const langchainMessages = [
      new SystemMessage(SOCRATIC_SYSTEM_PROMPT),
      ...messages.map((m) => {
        if (m.role === "assistant") {
          return new AIMessage(m.content);
        }
        return new HumanMessage(m.content);
      }),
    ];

    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Streaming Response Generation
    const encoder = new TextEncoder();

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Mock Socratic fallback stream for local demo / offline mode
      const latestUserMsg = messages[messages.length - 1]?.content || "";
      const isEnglish = /^[A-Za-z0-9\s.,?!'"-]+$/.test(latestUserMsg) && !latestUserMsg.toLowerCase().includes("saya") && !latestUserMsg.toLowerCase().includes("aku");

      const fallbackReply = isEnglish
        ? `Hello! I'm **tami**, your cybersecurity companion! 🐾\n\nThat's a very curious scenario you brought up: *" ${latestUserMsg} "*. \n\nBefore we jump to conclusions, let's observe a few key clues together:\n1. **What domain or sender address** is this coming from? Does it match the official domain?\n2. **Is there emotional pressure** (e.g. asking you to act urgently within a few minutes)?\n\nWhat do you notice when you look at these two clues?`
        : `Halo! Aku **tami**, teman aman media internetmu! 🐾\n\nPertanyaan yang sangat menarik: *"${latestUserMsg}"*.\n\nSebelum kita menyimpulkan, yuk kita amati dua petunjuk penting ini bersama-sama:\n1. **Dari mana domain atau alamat pengirimnya?** Apakah alamat situsnya sesuai dengan domain resmi gamenya?\n2. **Apakah ada desakan emosi atau iming-iming gratis** yang terasa terlalu berlebihan?\n\nCoba perhatikan baik-baik, apa yang kamu temukan dari dua petunjuk tersebut?`;

      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackReply.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? "" : " ") + words[i];
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 35));
          }
          controller.close();
        },
      });

      const headers: Record<string, string> = {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Turns-Remaining": isAuthenticated ? "unlimited" : String(turnsRemaining),
        "X-Is-Authenticated": isAuthenticated ? "true" : "false",
      };

      if (!isAuthenticated && newCookieValue) {
        headers["X-Turns-Used"] = String(newTurnsUsed);
        headers["Set-Cookie"] = `${GUEST_COOKIE_NAME}=${newCookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
      }

      return new Response(stream, { headers });
    }

    // 4. Live LangChain + Google Gemini 3.7 Flash Stream
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-3.7-flash",
      temperature: 0.5,
      maxOutputTokens: 1024,
    });

    const aiStream = await model.stream(langchainMessages);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            const text = typeof chunk.content === "string" ? chunk.content : String(chunk.content || "");
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Gemini stream error:", err);
          controller.enqueue(
            encoder.encode("\n\n*Maaf, terjadi gangguan saat menghubungkan ke tami. Silakan coba kirim ulang.*")
          );
        } finally {
          controller.close();
        }
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Turns-Remaining": isAuthenticated ? "unlimited" : String(turnsRemaining),
      "X-Is-Authenticated": isAuthenticated ? "true" : "false",
    };

    if (!isAuthenticated && newCookieValue) {
      headers["X-Turns-Used"] = String(newTurnsUsed);
      headers["Set-Cookie"] = `${GUEST_COOKIE_NAME}=${newCookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
    }

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process chat session." },
      { status: 500 }
    );
  }
}

// GET endpoint to query current quota status
export async function GET() {
  const session = await auth();
  if (session?.user?.id) {
    return NextResponse.json({
      turnsUsed: 0,
      maxTurns: 999,
      turnsRemaining: 999,
      isExceeded: false,
      isGuest: false,
    });
  }

  const cookieStore = await cookies();
  const rawGuestCookie = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  const sessionData = decodeGuestCookie(rawGuestCookie);
  const quota = getQuotaStatus(sessionData.turnsUsed);

  return NextResponse.json({ ...quota, isGuest: true });
}
