"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const LEARN_STORAGE_KEY = "tami_learn_completed_modules";
const PRACTICE_STORAGE_KEY = "tami_practice_progress";

export function ProgressSyncListener() {
  const { data: session, status } = useSession();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id || hasSyncedRef.current) {
      return;
    }

    async function syncGuestProgress() {
      try {
        let completedModules: string[] = [];
        let practiceProgress = {
          completedChallenges: [],
          totalScore: 0,
          unlockedBadges: [],
        };

        const rawLearn = localStorage.getItem(LEARN_STORAGE_KEY);
        if (rawLearn) {
          completedModules = JSON.parse(rawLearn);
        }

        const rawPractice = localStorage.getItem(PRACTICE_STORAGE_KEY);
        if (rawPractice) {
          practiceProgress = JSON.parse(rawPractice);
        }

        // Post to sync API
        const res = await fetch("/api/sync-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completedModules,
            practiceProgress,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.synced) {
            hasSyncedRef.current = true;
            // Write unified merged progress back to localStorage
            if (data.completedModules) {
              localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(data.completedModules));
            }
            if (data.practiceProgress) {
              localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(data.practiceProgress));
            }
            // Trigger storage events for reactive subscribers
            window.dispatchEvent(new Event("storage"));
          }
        }
      } catch (err) {
        console.error("Auto-merge sync failed:", err);
      }
    }

    syncGuestProgress();
  }, [status, session]);

  return null;
}
