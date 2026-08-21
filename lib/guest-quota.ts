import crypto from "node:crypto";

export const MAX_GUEST_TURNS = 3;
export const GUEST_COOKIE_NAME = "tami_guest_session";

const SECRET =
  process.env.GUEST_COOKIE_SECRET ||
  "tami-default-insecure-cookie-secret-key-change-in-prod";

interface GuestSessionData {
  turnsUsed: number;
  createdAt: number;
}

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  return hmac.digest("hex");
}

export function encodeGuestCookie(data: GuestSessionData): string {
  const json = JSON.stringify(data);
  const base64 = Buffer.from(json).toString("base64url");
  const signature = sign(base64);
  return `${base64}.${signature}`;
}

export function decodeGuestCookie(cookieValue?: string): GuestSessionData {
  if (!cookieValue) {
    return { turnsUsed: 0, createdAt: Date.now() };
  }

  const parts = cookieValue.split(".");
  if (parts.length !== 2) {
    return { turnsUsed: 0, createdAt: Date.now() };
  }

  const [base64, signature] = parts;
  const expectedSignature = sign(base64);

  if (signature !== expectedSignature) {
    // Tampered cookie - reset
    return { turnsUsed: 0, createdAt: Date.now() };
  }

  try {
    const json = Buffer.from(base64, "base64url").toString("utf8");
    const data = JSON.parse(json) as GuestSessionData;
    return {
      turnsUsed: typeof data.turnsUsed === "number" ? Math.max(0, data.turnsUsed) : 0,
      createdAt: data.createdAt || Date.now(),
    };
  } catch {
    return { turnsUsed: 0, createdAt: Date.now() };
  }
}

export function getQuotaStatus(turnsUsed: number) {
  const remaining = Math.max(0, MAX_GUEST_TURNS - turnsUsed);
  return {
    turnsUsed,
    turnsRemaining: remaining,
    isExceeded: remaining <= 0,
    maxTurns: MAX_GUEST_TURNS,
  };
}
