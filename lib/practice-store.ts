export interface PracticeProgress {
  completedChallenges: string[];
  totalScore: number;
  unlockedBadges: string[];
}

const STORAGE_KEY = "tami_practice_progress";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribePractice(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", callback);
    };
  }
  return () => {
    listeners.delete(callback);
  };
}

export function getPracticeSnapshot(): string {
  if (typeof window === "undefined") {
    return JSON.stringify({
      completedChallenges: [],
      totalScore: 0,
      unlockedBadges: [],
    });
  }
  try {
    return (
      localStorage.getItem(STORAGE_KEY) ||
      JSON.stringify({
        completedChallenges: [],
        totalScore: 0,
        unlockedBadges: [],
      })
    );
  } catch {
    return JSON.stringify({
      completedChallenges: [],
      totalScore: 0,
      unlockedBadges: [],
    });
  }
}

export const SERVER_PRACTICE_SNAPSHOT = JSON.stringify({
  completedChallenges: [],
  totalScore: 0,
  unlockedBadges: [],
});

export function recordChallengeSuccess(
  challengeId: "phishing" | "password" | "firewall" | "arena",
  badgeName: string,
  xp = 100
) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current: PracticeProgress = raw
      ? JSON.parse(raw)
      : { completedChallenges: [], totalScore: 0, unlockedBadges: [] };

    if (!current.completedChallenges.includes(challengeId)) {
      current.completedChallenges.push(challengeId);
      current.totalScore += xp;
    }

    if (!current.unlockedBadges.includes(badgeName)) {
      current.unlockedBadges.push(badgeName);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    notify();
  } catch {
    // Ignore storage write error
  }
}

export function resetPracticeProgress() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    notify();
  } catch {
    // Ignore storage error
  }
}
