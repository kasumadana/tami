"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const LEARN_STORAGE_KEY = "tami_learn_completed_modules";
const PRACTICE_STORAGE_KEY = "tami_practice_progress";

export function ProgressSyncListener() {
  const { data: session, status } = useSession();
  const isSyncingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      return;
    }

    async function pushProgressToCloud() {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      try {
        let completedModules: string[] = [];
        let practiceProgress = {
          completedChallenges: [],
          totalScore: 0,
          unlockedBadges: [],
        };

        const rawLearn = localStorage.getItem(LEARN_STORAGE_KEY);
        if (rawLearn) {
          try {
            completedModules = JSON.parse(rawLearn);
          } catch {
            completedModules = [];
          }
        }

        const rawPractice = localStorage.getItem(PRACTICE_STORAGE_KEY);
        if (rawPractice) {
          try {
            practiceProgress = JSON.parse(rawPractice);
          } catch {
            practiceProgress = {
              completedChallenges: [],
              totalScore: 0,
              unlockedBadges: [],
            };
          }
        }

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
            let hasChanged = false;
            const currentLearn = localStorage.getItem(LEARN_STORAGE_KEY);
            const newLearn = JSON.stringify(data.completedModules || []);
            if (currentLearn !== newLearn) {
              localStorage.setItem(LEARN_STORAGE_KEY, newLearn);
              hasChanged = true;
            }

            const currentPractice = localStorage.getItem(PRACTICE_STORAGE_KEY);
            const newPractice = JSON.stringify(data.practiceProgress || {});
            if (currentPractice !== newPractice) {
              localStorage.setItem(PRACTICE_STORAGE_KEY, newPractice);
              hasChanged = true;
            }

            if (hasChanged) {
              window.dispatchEvent(new Event("storage"));
            }
          }
        }
      } catch (err) {
        console.error("Auto-sync to Neon DB failed:", err);
      } finally {
        isSyncingRef.current = false;
      }
    }

    // Initial sync on authentication
    pushProgressToCloud();

    // Listen for local progress updates (from /practice or /learn)
    const handleStorageChange = () => {
      if (isSyncingRef.current) return;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        pushProgressToCloud();
      }, 500);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [status, session]);

  return null;
}
