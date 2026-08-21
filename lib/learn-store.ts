export const LEARN_STORAGE_KEY = "tami_learn_completed_modules";

export const SERVER_LEARN_SNAPSHOT = "[]";

export function subscribeLearn(callback: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }
  return () => {};
}

export function getLearnSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem(LEARN_STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

export function toggleLearnModule(moduleId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEARN_STORAGE_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    let updated: string[];
    if (current.includes(moduleId)) {
      updated = current.filter((id) => id !== moduleId);
    } else {
      updated = [...current, moduleId];
    }
    localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    return updated;
  } catch {
    return [];
  }
}
