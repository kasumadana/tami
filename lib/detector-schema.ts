import { z } from "zod";

export const AnomalyItemSchema = z.object({
  category: z.string().describe("Kategori anomali (misal: Typosquatting Domain, Logo Palsu, Tombol Manipulatif, Desakan Emosi)"),
  description: z.string().describe("Penjelasan detail indikator kecurigaan yang terlihat pada gambar"),
  severity: z.enum(["low", "medium", "high"]).describe("Tingkat keparahan anomali"),
});

export const ExploitStepSchema = z.object({
  step: z.number().describe("Urutan langkah simulasi (1, 2, 3)"),
  title: z.string().describe("Nama fase eksploitasi, misal: 'Pengalihan Tautan Tersembunyi'"),
  victimView: z.string().describe("Apa yang tampak di layar korban (misal: 'Halaman formulir klaim hadiah meminta login nomor HP')"),
  behindTheScenes: z.string().describe("Apa yang sebenarnya dieksekusi penyerang di balik layar (misal: 'Kredensial dan cookie sesi dikirim ke server hacker')"),
  lossRisk: z.string().describe("Potensi kerugian nyata jika langkah ini terjadi"),
});

export const ExploitSimulationSchema = z.object({
  scenarioTitle: z.string().describe("Judul skenario dampak eksploitasi jika korban mengeklik tautan atau mengunduh berkas"),
  steps: z
    .array(ExploitStepSchema)
    .min(2)
    .max(4)
    .describe("2 sampai 4 tahapan kronologis bagaimana serangan siber ini bekerja di balik layar"),
  mitigationAdvice: z.string().describe("Langkah pemulihan darurat jika sudah terlanjur menjadi korban"),
});

export type ExploitSimulationData = z.infer<typeof ExploitSimulationSchema>;

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
  exploitSimulation: ExploitSimulationSchema.optional().describe(
    "Simulasi dampak nyata langkah demi langkah jika korban tertipu dan mengeklik tautan/file pada bukti"
  ),
  isRelevantDigitalMessage: z
    .boolean()
    .describe("Apakah gambar merupakan tangkapan layar pesan digital / UI / dokumen siber"),
});

export type DetectorResult = z.infer<typeof DetectorResultSchema>;

