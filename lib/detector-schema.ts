import { z } from "zod";

export const AnomalyItemSchema = z.object({
  category: z.string().describe("Kategori anomali (misal: Typosquatting Domain, Logo Palsu, Tombol Manipulatif, Desakan Emosi)"),
  description: z.string().describe("Penjelasan detail indikator kecurigaan yang terlihat pada gambar"),
  severity: z.enum(["low", "medium", "high"]).describe("Tingkat keparahan anomali"),
});

export const DetectorResultSchema = z.object({
  status: z
    .enum(["ANALYZED", "IRRELEVANT_IMAGE", "UNCLEAR_IMAGE"])
    .describe("Status kelayakan gambar (ANALYZED jika bukti pesan digital, IRRELEVANT_IMAGE jika foto non-digital seperti hewan/pemandangan, UNCLEAR_IMAGE jika gambar terlalu buram/tidak terbaca)"),
  riskLevel: z
    .enum(["SAFE", "SUSPICIOUS", "DANGEROUS", "UNKNOWN"])
    .describe("Klasifikasi level risiko keamanan siber"),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Tingkat keyakinan analisis (0-100%)"),
  headline: z
    .string()
    .describe("Judul kesimpulan singkat yang ramah dan jelas"),
  summary: z
    .string()
    .describe("Ringkasan analisis komprehensif dalam nada bersahabat dan mendidik"),
  ocrText: z
    .string()
    .optional()
    .describe("Transkripsi teks digital yang berhasil diekstraksi dari gambar"),
  anomaliesFound: z
    .array(AnomalyItemSchema)
    .describe("Daftar anomali atau tanda bahaya visual/tekstual yang ditemukan"),
  reflectionQuestions: z
    .array(z.string())
    .describe("1-2 pertanyaan reflektif Sokratik untuk memantik daya nalar kritis siswa"),
  safetyTips: z
    .array(z.string())
    .describe("Langkah-langkah tindakan perlindungan yang disarankan"),
  isRelevantDigitalMessage: z
    .boolean()
    .describe("Apakah gambar merupakan tangkapan layar pesan digital / UI / dokumen siber"),
});

export type DetectorResult = z.infer<typeof DetectorResultSchema>;
