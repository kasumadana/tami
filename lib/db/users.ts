import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export interface UserPayload {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// In-memory cache for fast lookups and to avoid hitting Neon on every session decode
const userCache = new Map<string, { canonicalId: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Ensures a user exists in Neon DB users table and returns their canonical ID.
 * If user already exists (e.g. by unique email), returns the existing canonical ID.
 * If user does not exist, creates the user row and returns the new ID.
 */
export async function ensureDbUser(user: UserPayload): Promise<string | null> {
  if (!db || !user) return user?.id || null;

  const email = user.email?.trim().toLowerCase();
  const rawId = user.id?.trim();

  // 1. Check cache by email or id
  if (email) {
    const cached = userCache.get(`email:${email}`);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.canonicalId;
    }
  } else if (rawId) {
    const cached = userCache.get(`id:${rawId}`);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.canonicalId;
    }
  }

  try {
    // 2. Query by email if available (email is UNIQUE in users schema)
    if (email) {
      const [existingByEmail] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingByEmail) {
        userCache.set(`email:${email}`, {
          canonicalId: existingByEmail.id,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
        userCache.set(`id:${existingByEmail.id}`, {
          canonicalId: existingByEmail.id,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
        return existingByEmail.id;
      }
    }

    // 3. Query by rawId if available
    if (rawId) {
      const [existingById] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, rawId))
        .limit(1);

      if (existingById) {
        if (email) {
          userCache.set(`email:${email}`, {
            canonicalId: existingById.id,
            expiresAt: Date.now() + CACHE_TTL_MS,
          });
        }
        userCache.set(`id:${rawId}`, {
          canonicalId: existingById.id,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
        return existingById.id;
      }
    }

    // 4. If not found, insert a new user row
    const finalId = rawId || `user-${crypto.randomUUID()}`;
    const userEmail = email || `${finalId}@tami.local`;
    const userName = user.name?.trim() || "Siswa tami";
    const userImage = user.image || "/mascot/tami-headshot.webp";
    const now = new Date();

    const [inserted] = await db
      .insert(users)
      .values({
        id: finalId,
        name: userName,
        email: userEmail,
        image: userImage,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: users.id });

    const canonicalId = inserted?.id || finalId;

    if (email) {
      userCache.set(`email:${email}`, {
        canonicalId,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    }
    userCache.set(`id:${canonicalId}`, {
      canonicalId,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return canonicalId;
  } catch (err) {
    console.error("Failed to ensure DB user in Neon:", err);

    // Fallback recovery check if race condition occurred on insert
    if (email) {
      try {
        const [fallback] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        if (fallback) {
          return fallback.id;
        }
      } catch {}
    }

    return rawId || null;
  }
}
