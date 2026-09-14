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
import { HumanMessage, AIMessage, SystemMessage, AIMessageChunk } from "@langchain/core/messages";
import { TAMI_CHAT_TOOLS } from "@/lib/generative-ui-schema";
import { createChatSession, saveChatMessage } from "@/lib/chat-store";
import { ensureDbUser } from "@/lib/db/users";

interface ChatMessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

export const runtime = "nodejs";

const TOOL_NAME_TO_WIDGET_TYPE: Record<string, string> = {
  render_interactive_choice: "interactive_choice",
  render_threat_radar: "threat_radar",
  render_action_checklist: "action_checklist",
  render_domain_inspector: "domain_inspector",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessageInput[] = body.messages || [];
    let sessionId: string | undefined = body.sessionId;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Messages array is required." },
        { status: 400 }
      );
    }

    // 1. Verify authentication and guest quota
    const session = await auth();
    const isAuthenticated = !!session?.user?.id;
    const userId = session?.user ? ((await ensureDbUser(session.user)) || session.user.id) : undefined;

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

    // 2. Initialize or verify session for authenticated user
    const latestUserMsg = messages[messages.length - 1]?.content || "";
    if (isAuthenticated && userId) {
      if (!sessionId) {
        const title = latestUserMsg.slice(0, 40).trim() || "Obrolan Baru";
        const newSession = await createChatSession(userId, title);
        if (newSession) {
          sessionId = newSession.id;
        }
      }

      // Persist the user's latest message to DB
      if (sessionId && latestUserMsg) {
        await saveChatMessage(sessionId, "user", latestUserMsg);
      }
    }

    // 3. Prepare AI chat messages with Socratic System Prompt Grounding
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
    const encoder = new TextEncoder();

    // 4. Offline / Mock Mode when GEMINI_API_KEY is not set
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const isEnglish =
        /^[A-Za-z0-9\s.,?!'"-]+$/.test(latestUserMsg) &&
        !latestUserMsg.toLowerCase().includes("saya") &&
        !latestUserMsg.toLowerCase().includes("aku");

      const fallbackReply = isEnglish
        ? `Hello! I'm **tami**, your cybersecurity companion!\n\nThat's a very curious scenario: *" ${latestUserMsg} "*. \n\nBefore we jump to conclusions, let's look at the clues together. Notice the sender and urgency cues!`
        : `Halo! Aku **tami**, teman aman media internetmu!\n\nPertanyaan yang sangat menarik: *"${latestUserMsg}"*.\n\nSebelum kita menyimpulkan, yuk kita amati petunjuk penting ini bersama-sama. Perhatikan alamat pengirim dan apakah ada desakan waktu!`;

      // Determine deterministic demo widget for offline testing
      const lower = latestUserMsg.toLowerCase();
      let demoWidget: { widgetType: string; data: Record<string, unknown> } | null = null;

      if (lower.includes("link") || lower.includes("url") || lower.includes("domain") || lower.includes("situs") || lower.includes(".com")) {
        demoWidget = {
          widgetType: "domain_inspector",
          data: {
            url: "https://login-steam-promo.top/free-skins",
            protocol: "https://",
            subdomain: "free-skins",
            rootDomain: "login-steam-promo",
            tld: ".top",
            isDeceptive: true,
            explanation: isEnglish
              ? "The root domain is 'login-steam-promo', not 'steampowered.com'. Scammers often use legitimate brand names as subdomains or fake root names."
              : "Nama domain utamanya adalah 'login-steam-promo', bukan 'steampowered.com'. Pelaku sering menaruh kata resmi di bagian depan untuk mengelabui mata kita.",
          },
        };
      } else if (lower.includes("bahaya") || lower.includes("ancaman") || lower.includes("skor") || lower.includes("radar") || lower.includes("aman")) {
        demoWidget = {
          widgetType: "threat_radar",
          data: {
            headline: isEnglish ? "High Phishing Threat Detected" : "Indikasi Ancaman Phishing Tinggi",
            score: 85,
            riskLevel: "DANGEROUS",
            summary: isEnglish
              ? "This message exhibits strong social engineering manipulation cues: urgent panic tone and unverified external link."
              : "Pesan ini memperlihatkan teknik manipulasi rekayasa sosial: desakan waktu panik dan tautan pihak ketiga yang belum diverifikasi.",
            indicators: [
              { label: isEnglish ? "Urgent Panic Pressure" : "Desakan Waktu Panik", detected: true, note: isEnglish ? "Demands action within 5 minutes" : "Menuntut tindakan dalam 5 menit" },
              { label: isEnglish ? "Deceptive Domain" : "Struktur Domain Palsu", detected: true, note: isEnglish ? "Uses .top TLD clone" : "Menggunakan ekstensi clone berisiko" },
              { label: isEnglish ? "Legitimate Official Channel" : "Kanal Resmi Terverifikasi", detected: false, note: isEnglish ? "Not from official support" : "Bukan dari pusat bantuan resmi" },
            ],
          },
        };
      } else if (lower.includes("langkah") || lower.includes("checklist") || lower.includes("amankan") || lower.includes("tips")) {
        demoWidget = {
          widgetType: "action_checklist",
          data: {
            title: isEnglish ? "3 Steps to Protect Your Account Now" : "3 Langkah Mengamankan Akunmu",
            items: [
              { id: "task-1", task: isEnglish ? "Do not click any link in the message" : "Jangan klik tautan apa pun di dalam pesan", description: isEnglish ? "Prevents token theft and malware payload" : "Mencegah pencurian kredensial atau cookie sesi" },
              { id: "task-2", task: isEnglish ? "Enable Two-Factor Authentication (2FA)" : "Aktifkan Verifikasi 2 Langkah (2FA)", description: isEnglish ? "Adds an extra shield even if password leaks" : "Memberi perlindungan ekstra jika kata sandi bocor" },
              { id: "task-3", task: isEnglish ? "Report sender to trusted adult or admin" : "Laporkan pengirim ke orang tua atau guru", description: isEnglish ? "Helps protect classmates and family members" : "Membantu melindungi teman dan keluarga lainnya" },
            ],
          },
        };
      } else {
        demoWidget = {
          widgetType: "interactive_choice",
          data: {
            prompt: isEnglish
              ? "What is the safest first step you would take in this situation?"
              : "Apa langkah pertama paling aman yang menurutmu harus diambil?",
            choices: [
              { id: "c1", label: isEnglish ? "Verify directly via official app/settings" : "Cek langsung lewat aplikasi/pengaturan resmi", isSafeOption: true, hint: isEnglish ? "Always bypass links in messages" : "Langkah paling aman tanpa membuka tautan asing" },
              { id: "c2", label: isEnglish ? "Click the link immediately to see if it's real" : "Langsung buka tautan untuk memastikan kebenarannya", isSafeOption: false, hint: isEnglish ? "Clicking may trigger credential capture" : "Tautan mencurigakan bisa mencuri sesi loginmu" },
            ],
          },
        };
      }

      const stream = new ReadableStream({
        async start(controller) {
          // Send session ID first if available
          if (sessionId) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "session-id", sessionId }) + "\n"));
          }

          // Stream text deltas word by word
          const words = fallbackReply.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? "" : " ") + words[i];
            controller.enqueue(encoder.encode(JSON.stringify({ type: "text-delta", content: chunk }) + "\n"));
            await new Promise((resolve) => setTimeout(resolve, 30));
          }

          // Stream widget if present
          if (demoWidget) {
            await new Promise((resolve) => setTimeout(resolve, 60));
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: "ui-widget",
                  widgetType: demoWidget.widgetType,
                  data: demoWidget.data,
                }) + "\n"
              )
            );
          }

          // Persist assistant message if authenticated
          if (sessionId && isAuthenticated) {
            await saveChatMessage(
              sessionId,
              "assistant",
              fallbackReply,
              demoWidget?.widgetType,
              demoWidget?.data
            );
          }

          controller.close();
        },
      });

      const headers: Record<string, string> = {
        "Content-Type": "application/x-ndjson; charset=utf-8",
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

    // 5. Live LangChain + Google Gemini 3.5 Flash Stream with Tool Calling
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash-lite",
      temperature: 0.5,
      maxOutputTokens: 1024,
    });

    const modelWithTools = model.bindTools(TAMI_CHAT_TOOLS);
    const aiStream = await modelWithTools.stream(langchainMessages);

    const stream = new ReadableStream({
      async start(controller) {
        let accumulatedText = "";
        let fullMessage: AIMessageChunk | null = null;

        try {
          if (sessionId) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "session-id", sessionId }) + "\n"));
          }

          for await (const chunk of aiStream) {
            fullMessage = fullMessage ? fullMessage.concat(chunk) : chunk;

            const text =
              typeof chunk.content === "string"
                ? chunk.content
                : Array.isArray(chunk.content)
                ? chunk.content
                    .map((c: unknown) =>
                      typeof c === "string"
                        ? c
                        : typeof c === "object" && c !== null && "text" in c
                        ? String((c as { text?: unknown }).text || "")
                        : ""
                    )
                    .join("")
                : "";

            if (text) {
              accumulatedText += text;
              controller.enqueue(
                encoder.encode(JSON.stringify({ type: "text-delta", content: text }) + "\n")
              );
            }
          }

          // Evaluate tool call emitted by model
          let finalWidgetType: string | undefined;
          let finalWidgetData: Record<string, unknown> | undefined;

          if (fullMessage && fullMessage.tool_calls && fullMessage.tool_calls.length > 0) {
            const tc = fullMessage.tool_calls[0];
            const mappedType = TOOL_NAME_TO_WIDGET_TYPE[tc.name];
            if (mappedType && tc.args) {
              finalWidgetType = mappedType;
              finalWidgetData = tc.args as Record<string, unknown>;
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "ui-widget",
                    widgetType: mappedType,
                    data: tc.args,
                  }) + "\n"
                )
              );
            }
          }

          // Resilient Fallback: If no tool call was made, but the text explicitly prompts the child to choose options
          if (!finalWidgetType && accumulatedText) {
            const lowerText = accumulatedText.toLowerCase();
            const hasChoicePrompt =
              lowerText.includes("pilih tindakan") ||
              lowerText.includes("pilih salah satu") ||
              lowerText.includes("coba pilih") ||
              lowerText.includes("di bawah ini") ||
              lowerText.includes("which one would you choose") ||
              lowerText.includes("choose one");

            // 1. Checklist fallback: When assistant suggests action protection steps
            const hasChecklistPrompt =
              lowerText.includes("langkah perlindungan") ||
              lowerText.includes("langkah-langkah perlindungan") ||
              lowerText.includes("langkah pengamanan") ||
              lowerText.includes("lakukan langkah") ||
              lowerText.includes("perlindungan penting") ||
              lowerText.includes("action steps") ||
              lowerText.includes("protection steps");

            // Look for bulleted or numbered items like "1. ... 2. ..." or "- ... - ..."
            const listMatches = Array.from(
              accumulatedText.matchAll(/(?:^|\n)(?:[1-4]\.|\*|-|[A-D]\.)\s+([^\n]+)/g)
            ).map((m) => m[1].trim()).filter((opt) => opt.length > 3 && opt.length < 160);

            if (hasChecklistPrompt && listMatches.length >= 2) {
              finalWidgetType = "action_checklist";
              finalWidgetData = {
                title: lowerText.includes("langkah")
                  ? "Langkah Perlindungan Akun"
                  : "Account Protection Steps",
                items: listMatches.slice(0, 4).map((task, idx) => ({
                  id: `action-${idx + 1}`,
                  task,
                  description: "Lakukan langkah ini untuk menjaga keamanan akun dan datamu.",
                })),
              };

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "ui-widget",
                    widgetType: finalWidgetType,
                    data: finalWidgetData,
                  }) + "\n"
                )
              );
            } else if (hasChoicePrompt && listMatches.length >= 2) {
              const slicedOptions = listMatches.slice(0, 4);
              finalWidgetType = "interactive_choice";
              finalWidgetData = {
                prompt:
                  lowerText.includes("pilih")
                    ? "Pilih tindakan yang menurutmu paling aman:"
                    : "Choose the action you think is safest:",
                choices: slicedOptions.map((label, idx) => ({
                  id: `fallback-choice-${idx + 1}`,
                  label,
                  isSafeOption: idx === 0, // Heuristic default
                })),
              };

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "ui-widget",
                    widgetType: finalWidgetType,
                    data: finalWidgetData,
                  }) + "\n"
                )
              );
            } else if (hasChecklistPrompt && listMatches.length === 0) {
              // Synthesize default high-impact gaming protection checklist
              finalWidgetType = "action_checklist";
              finalWidgetData = {
                title: "Langkah Perlindungan Akun & Skin",
                items: [
                  {
                    id: "action-1",
                    task: "Aktifkan Verifikasi 2 Langkah (2FA/OTP)",
                    description: "Supaya tidak ada yang bisa login meski mereka tahu passwordmu.",
                  },
                  {
                    id: "action-2",
                    task: "Ganti Password dengan Passphrase yang Kuat",
                    description: "Gunakan gabungan 3-4 kata acak yang mudah kamu ingat tapi susah ditebak.",
                  },
                  {
                    id: "action-3",
                    task: "Jangan Pernah Klik Link Hadiah/Diamond Gratis",
                    description: "Event resmi game tidak pernah meminta kamu memasukkan password di website lain.",
                  },
                ],
              };

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "ui-widget",
                    widgetType: finalWidgetType,
                    data: finalWidgetData,
                  }) + "\n"
                )
              );
            }
          }

          // Save assistant message to DB if authenticated
          if (sessionId && isAuthenticated) {
            await saveChatMessage(
              sessionId,
              "assistant",
              accumulatedText,
              finalWidgetType,
              finalWidgetData
            );
          }
        } catch (err) {
          console.error("Gemini stream error:", err);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "text-delta",
                content:
                  "\n\n*Maaf, terjadi gangguan saat menghubungkan ke tami. Silakan coba kirim ulang.*",
              }) + "\n"
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/x-ndjson; charset=utf-8",
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
