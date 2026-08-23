import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { learningProgress, practiceRecords, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const guestModules: string[] = Array.isArray(body?.completedModules)
      ? body.completedModules
      : [];

    const guestChallenges: string[] = Array.isArray(body?.practiceProgress?.completedChallenges)
      ? body.practiceProgress.completedChallenges
      : [];

    const guestBadges: string[] = Array.isArray(body?.practiceProgress?.unlockedBadges)
      ? body.practiceProgress.unlockedBadges
      : [];

    // If unauthenticated or DB unavailable, acknowledge guest sync
    if (!session?.user?.id || !db) {
      return NextResponse.json({
        success: true,
        synced: false,
        guest: true,
        completedModules: guestModules,
        practiceProgress: {
          completedChallenges: guestChallenges,
          totalScore: guestChallenges.length * 100,
          unlockedBadges: guestBadges,
        },
      });
    }

    const userId = session.user.id;

    // Ensure user row exists in DB
    try {
      await db
        .insert(users)
        .values({
          id: userId,
          name: session.user.name || "Siswa tami",
          email: session.user.email || "guest@tami.local",
          image: session.user.image || "/icon.svg",
        })
        .onConflictDoNothing();
    } catch {
      // Ignore user insert conflict
    }

    // Sync Learning Modules
    for (const modId of guestModules) {
      try {
        const existing = await db
          .select()
          .from(learningProgress)
          .where(and(eq(learningProgress.userId, userId), eq(learningProgress.moduleId, modId)));

        if (existing.length === 0) {
          await db.insert(learningProgress).values({
            id: `${userId}_${modId}`,
            userId,
            moduleId: modId,
          });
        }
      } catch {
        // Skip individual conflict
      }
    }

    // Sync Practice Records
    for (const chId of guestChallenges) {
      try {
        const existing = await db
          .select()
          .from(practiceRecords)
          .where(and(eq(practiceRecords.userId, userId), eq(practiceRecords.challengeId, chId)));

        if (existing.length === 0) {
          const badgeName =
            chId === "phishing"
              ? "Phishing Sleuth"
              : chId === "password"
              ? "Entropy Master"
              : "Firewall Sentinel";

          await db.insert(practiceRecords).values({
            id: `${userId}_${chId}`,
            userId,
            challengeId: chId,
            score: 100,
            badgeEarned: badgeName,
          });
        }
      } catch {
        // Skip individual conflict
      }
    }

    // Fetch unified state from DB
    const allModules = await db
      .select()
      .from(learningProgress)
      .where(eq(learningProgress.userId, userId));

    const allPractice = await db
      .select()
      .from(practiceRecords)
      .where(eq(practiceRecords.userId, userId));

    const mergedModules = Array.from(new Set([...guestModules, ...allModules.map((m) => m.moduleId)]));
    const mergedChallenges = Array.from(
      new Set([...guestChallenges, ...allPractice.map((p) => p.challengeId)])
    );
    const mergedBadges = Array.from(
      new Set([...guestBadges, ...allPractice.map((p) => p.badgeEarned)])
    );

    return NextResponse.json({
      success: true,
      synced: true,
      userId,
      completedModules: mergedModules,
      practiceProgress: {
        completedChallenges: mergedChallenges,
        totalScore: mergedChallenges.length * 100,
        unlockedBadges: mergedBadges,
      },
    });
  } catch (error) {
    console.error("Progress sync error:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
