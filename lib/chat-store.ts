import { db } from "./db";
import { chatSessions, chatMessages } from "./db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { encryptChatPayload, decryptChatPayload } from "./crypto";
import crypto from "node:crypto";

export interface DecryptedChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  widgetType?: string | null;
  widgetData?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface ChatSessionMetadata {
  id: string;
  userId: string;
  title: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetch all chat sessions for a specific user, sorted latest first.
 */
export async function getUserChatSessions(
  userId: string
): Promise<ChatSessionMetadata[]> {
  if (!db) return [];
  try {
    const sessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));

    return sessions;
  } catch (err) {
    console.error("Failed to get chat sessions:", err);
    return [];
  }
}

/**
 * Create a new chat session for a user.
 */
export async function createChatSession(
  userId: string,
  title = "Obrolan Baru",
  topic = "general"
): Promise<ChatSessionMetadata | null> {
  if (!db) return null;
  try {
    const id = `session-${crypto.randomUUID()}`;
    const now = new Date();

    const [newSession] = await db
      .insert(chatSessions)
      .values({
        id,
        userId,
        title,
        topic,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newSession || null;
  } catch (err) {
    console.error("Failed to create chat session:", err);
    return null;
  }
}

/**
 * Fetch and decrypt all messages within a specific session.
 * Verifies that the session belongs to the requesting user.
 */
export async function getChatSessionMessages(
  sessionId: string,
  userId: string
): Promise<DecryptedChatMessage[]> {
  if (!db) return [];
  try {
    // 1. Verify session ownership
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
      .limit(1);

    if (!session) return [];

    // 2. Fetch all messages ordered by createdAt ascending
    const rows = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt));

    // 3. Decrypt in memory before returning to authenticated client
    return rows.map((row) => {
      let decryptedWidgetData: Record<string, unknown> | null = null;
      if (row.encryptedWidgetData) {
        try {
          const raw = decryptChatPayload(row.encryptedWidgetData);
          decryptedWidgetData = JSON.parse(raw);
        } catch {
          decryptedWidgetData = null;
        }
      }

      return {
        id: row.id,
        sessionId: row.sessionId,
        role: row.role as "user" | "assistant" | "system",
        content: decryptChatPayload(row.encryptedContent),
        widgetType: row.widgetType,
        widgetData: decryptedWidgetData,
        createdAt: row.createdAt,
      };
    });
  } catch (err) {
    console.error("Failed to get chat messages:", err);
    return [];
  }
}

/**
 * Append and encrypt a new chat message to a session.
 * Automatically updates session updatedAt timestamp and derives title if needed.
 */
export async function saveChatMessage(
  sessionId: string,
  role: "user" | "assistant" | "system",
  content: string,
  widgetType?: string,
  widgetData?: Record<string, unknown>
): Promise<string | null> {
  if (!db) return null;
  try {
    const id = `msg-${crypto.randomUUID()}`;
    const encryptedContent = encryptChatPayload(content);
    let encryptedWidgetData: string | null = null;

    if (widgetData) {
      encryptedWidgetData = encryptChatPayload(JSON.stringify(widgetData));
    }

    const now = new Date();

    await db.insert(chatMessages).values({
      id,
      sessionId,
      role,
      encryptedContent,
      widgetType: widgetType || null,
      encryptedWidgetData,
      createdAt: now,
    });

    // Update session timestamp and auto-generate title if this is the first user prompt
    if (role === "user") {
      const cleanTitle = content.slice(0, 40).trim();
      if (cleanTitle) {
        await db
          .update(chatSessions)
          .set({
            updatedAt: now,
            title: cleanTitle + (content.length > 40 ? "..." : ""),
          })
          .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.title, "Obrolan Baru")));
      } else {
        await db
          .update(chatSessions)
          .set({ updatedAt: now })
          .where(eq(chatSessions.id, sessionId));
      }
    } else {
      await db
        .update(chatSessions)
        .set({ updatedAt: now })
        .where(eq(chatSessions.id, sessionId));
    }

    return id;
  } catch (err) {
    console.error("Failed to save chat message:", err);
    return null;
  }
}

/**
 * Delete an entire chat session and its cascade messages.
 */
export async function deleteChatSession(
  sessionId: string,
  userId: string
): Promise<boolean> {
  if (!db) return false;
  try {
    await db
      .delete(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));
    return true;
  } catch (err) {
    console.error("Failed to delete chat session:", err);
    return false;
  }
}

/**
 * Rename a chat session title.
 */
export async function renameChatSession(
  sessionId: string,
  userId: string,
  newTitle: string
): Promise<boolean> {
  if (!db) return false;
  try {
    await db
      .update(chatSessions)
      .set({ title: newTitle.trim(), updatedAt: new Date() })
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));
    return true;
  } catch (err) {
    console.error("Failed to rename chat session:", err);
    return false;
  }
}

/**
 * Sync guest messages from browser localStorage into a permanent Neon DB session.
 */
export async function syncGuestChatToAccount(
  userId: string,
  guestMessages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    widgetType?: string;
    widgetData?: Record<string, unknown>;
  }>
): Promise<string | null> {
  if (!db || !Array.isArray(guestMessages) || guestMessages.length === 0) {
    return null;
  }

  try {
    const firstUserMsg = guestMessages.find((m) => m.role === "user");
    const sessionTitle = firstUserMsg
      ? firstUserMsg.content.slice(0, 40).trim() + (firstUserMsg.content.length > 40 ? "..." : "")
      : "Sesi Tamu Terintegrasi";

    const session = await createChatSession(userId, sessionTitle, "sync");
    if (!session) return null;

    for (const msg of guestMessages) {
      if (msg.content) {
        await saveChatMessage(
          session.id,
          msg.role,
          msg.content,
          msg.widgetType,
          msg.widgetData
        );
      }
    }

    return session.id;
  } catch (err) {
    console.error("Failed to sync guest chat:", err);
    return null;
  }
}
