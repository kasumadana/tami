import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getUserChatSessions,
  createChatSession,
  getChatSessionMessages,
  deleteChatSession,
  renameChatSession,
} from "@/lib/chat-store";
import { ensureDbUser } from "@/lib/db/users";

export const runtime = "nodejs";

// GET /api/chat/sessions or /api/chat/sessions?sessionId=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = (await ensureDbUser(session.user)) || session.user.id;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const messages = await getChatSessionMessages(sessionId, userId);
      return NextResponse.json({ sessionId, messages });
    }

    const sessions = await getUserChatSessions(userId);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// POST /api/chat/sessions (Create new empty session)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = (await ensureDbUser(session.user)) || session.user.id;
    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Obrolan Baru";

    const newSession = await createChatSession(userId, title);
    if (!newSession) {
      return NextResponse.json({ error: "CREATION_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// DELETE /api/chat/sessions?sessionId=xxx
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = (await ensureDbUser(session.user)) || session.user.id;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "MISSING_SESSION_ID" }, { status: 400 });
    }

    const success = await deleteChatSession(sessionId, userId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// PATCH /api/chat/sessions
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = (await ensureDbUser(session.user)) || session.user.id;
    const body = await req.json();
    const { sessionId, title } = body;

    if (!sessionId || !title || typeof title !== "string") {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const success = await renameChatSession(sessionId, userId, title);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error renaming session:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
