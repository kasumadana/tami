import { normalizeModuleSlug, REVERSE_SLUG_MAP } from "./learn-content";

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

export function isLearnModuleDone(completedList: string[], moduleIdOrSlug: string): boolean {
  const norm = normalizeModuleSlug(moduleIdOrSlug);
  const legacy = REVERSE_SLUG_MAP[norm] || norm;
  return completedList.includes(norm) || completedList.includes(legacy);
}

export function toggleLearnModule(moduleIdOrSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEARN_STORAGE_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    const norm = normalizeModuleSlug(moduleIdOrSlug);
    const legacy = REVERSE_SLUG_MAP[norm] || norm;

    let updated: string[];
    if (current.includes(norm) || current.includes(legacy)) {
      updated = current.filter((id) => id !== norm && id !== legacy);
    } else {
      updated = [...current.filter((id) => id !== legacy), norm];
    }
    localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    return updated;
  } catch {
    return [];
  }
}

export function markLearnModuleCompleted(moduleIdOrSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEARN_STORAGE_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    const norm = normalizeModuleSlug(moduleIdOrSlug);
    const legacy = REVERSE_SLUG_MAP[norm] || norm;

    if (!current.includes(norm) && !current.includes(legacy)) {
      const updated = [...current, norm];
      localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return updated;
    }
    return current;
  } catch {
    return [];
  }
}
