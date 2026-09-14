import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { syncGuestChatToAccount } from "@/lib/chat-store";
import { ensureDbUser } from "@/lib/db/users";

export const runtime = "nodejs";

// POST /api/chat/sync (Sync guest chat messages from localStorage to Neon DB)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "NO_MESSAGES_TO_SYNC" }, { status: 400 });
    }

    const userId = (await ensureDbUser(session.user)) || session.user.id;
    const newSessionId = await syncGuestChatToAccount(userId, messages);
    if (!newSessionId) {
      return NextResponse.json({ error: "SYNC_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ success: true, sessionId: newSessionId });
  } catch (error) {
    console.error("Error syncing guest chat:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
