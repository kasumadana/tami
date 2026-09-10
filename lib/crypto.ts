import crypto from "node:crypto";

// Derive a secure 32-byte key from NEXTAUTH_SECRET or dedicated CHAT_ENCRYPTION_KEY
const SECRET_SEED =
  process.env.CHAT_ENCRYPTION_KEY ||
  process.env.NEXTAUTH_SECRET ||
  "tami-secure-salt-for-dev-environment-min-32-chars-long";

const SALT = "tami_socratic_chat_salt_v1";
const ENCRYPTION_KEY = crypto.scryptSync(SECRET_SEED, SALT, 32);
const ALGORITHM = "aes-256-gcm";

/**
 * Encrypts sensitive chat content using AES-256-GCM.
 * Format: ivHex:authTagHex:encryptedHex
 */
export function encryptChatPayload(plaintext: string): string {
  if (!plaintext) return "";
  try {
    const iv = crypto.randomBytes(12); // Standard 96-bit IV for AES-GCM
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("FAILED_TO_ENCRYPT_PAYLOAD");
  }
}

/**
 * Decrypts AES-256-GCM ciphertext back into readable UTF-8 string.
 */
export function decryptChatPayload(ciphertextWithIv: string): string {
  if (!ciphertextWithIv) return "";
  try {
    const parts = ciphertextWithIv.split(":");
    if (parts.length !== 3) {
      // If legacy or unencrypted text is encountered, return safely
      return ciphertextWithIv;
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (err) {
    console.error("Decryption error:", err);
    // If decryption fails due to key mismatch or tampering, return safe redacted notice
    return "[Pesan terenkripsi tidak dapat didekripsi / Encrypted message unreadable]";
  }
}
