import { z } from "zod";
import { tool } from "@langchain/core/tools";

// 1. Interactive Choice Widget Schema
export const InteractiveChoiceSchema = z.object({
  prompt: z.string().describe("Pertanyaan pilihan reflektif pemantik nalar kritis untuk siswa."),
  choices: z
    .array(
      z.object({
        id: z.string().describe("ID unik pilihan, misal: choice-1"),
        label: z.string().describe("Teks opsi tindakan yang dapat dipilih oleh siswa"),
        hint: z.string().optional().describe("Petunjuk singkat edukatif"),
        isSafeOption: z.boolean().optional().describe("Apakah pilihan ini merupakan tindakan keamanan yang benar"),
      })
    )
    .min(2)
    .max(4)
    .describe("Daftar 2 sampai 4 opsi pilihan tindakan yang relevan dengan situasi"),
});

export type InteractiveChoiceData = z.infer<typeof InteractiveChoiceSchema>;

// 2. Threat Analysis Radar Widget Schema
export const ThreatRadarSchema = z.object({
  headline: z.string().describe("Judul kesimpulan ancaman digital yang dievaluasi"),
  score: z.number().min(0).max(100).describe("Skor tingkat ancaman (0-100)"),
  riskLevel: z.enum(["SAFE", "SUSPICIOUS", "DANGEROUS"]).describe("Kategori risiko keamanan"),
  summary: z.string().describe("Ringkasan singkat mengapa situasi ini dinilai berbahaya atau aman"),
  indicators: z
    .array(
      z.object({
        label: z.string().describe("Nama indikator, misal: 'Desakan Waktu Panik' atau 'Domain Palsu'"),
        detected: z.boolean().describe("Apakah indikator ini terdeteksi pada kasus"),
        note: z.string().describe("Penjelasan bukti anomali secara singkat"),
      })
    )
    .min(1)
    .max(4)
    .describe("Daftar indikator anomali yang dievaluasi"),
});

export type ThreatRadarData = z.infer<typeof ThreatRadarSchema>;

// 3. Security Action Checklist Widget Schema
export const ActionChecklistSchema = z.object({
  title: z.string().describe("Judul daftar periksa proteksi diri (misal: '3 Langkah Mengamankan Akunmu')"),
  items: z
    .array(
      z.object({
        id: z.string().describe("ID tugas, misal: task-1"),
        task: z.string().describe("Instruksi aksi taktis yang harus dilakukan siswa"),
        description: z.string().describe("Alasan mengapa langkah ini penting dilakukan sekarang"),
      })
    )
    .min(2)
    .max(5)
    .describe("Daftar aksi proteksi keamanan yang dapat dicentang siswa"),
});

export type ActionChecklistData = z.infer<typeof ActionChecklistSchema>;

// 4. Inspect Domain Snippet Widget Schema
export const DomainInspectorSchema = z.object({
  url: z.string().describe("Alamat tautan lengkap yang sedang diinspeksi"),
  protocol: z.string().describe("Protokol web, misal: 'https://' atau 'http://'"),
  subdomain: z.string().describe("Subdomain jika ada, misal: 'free-steam' atau kosong"),
  rootDomain: z.string().describe("Nama domain utama, misal: 'steamcommunity' atau 'login-steam-promo'"),
  tld: z.string().describe("Top Level Domain, misal: '.com', '.co.xyz', atau '.top'"),
  isDeceptive: z.boolean().describe("Apakah struktur domain ini merupakan tiruan/palsu (phishing)"),
  explanation: z.string().describe("Penjelasan letak tipuan nama domain yang harus diwaspadai siswa"),
});

export type DomainInspectorData = z.infer<typeof DomainInspectorSchema>;

// Union type for all supported Generative UI Widgets
export type GenerativeUiPayload =
  | { type: "interactive_choice"; data: InteractiveChoiceData }
  | { type: "threat_radar"; data: ThreatRadarData }
  | { type: "action_checklist"; data: ActionChecklistData }
  | { type: "domain_inspector"; data: DomainInspectorData };

// LangChain Tools Definition
export const renderInteractiveChoiceTool = tool(
  async (input) => JSON.stringify(input),
  {
    name: "render_interactive_choice",
    description:
      "Gunakan alat ini saat kamu ingin memunculkan kartu pilihan tindakan reflektif interaktif (2-4 opsi) agar siswa dapat memilih langkah yang mereka anggap benar dengan sekali klik.",
    schema: InteractiveChoiceSchema,
  }
);

export const renderThreatRadarTool = tool(
  async (input) => JSON.stringify(input),
  {
    name: "render_threat_radar",
    description:
      "Gunakan alat ini saat siswa menceritakan atau menanyakan pesan/tawaran mencurigakan, dan kamu ingin menyajikan kartu visual ringkasan tingkat ancaman beserta indikator bahaya yang terdeteksi.",
    schema: ThreatRadarSchema,
  }
);

export const renderActionChecklistTool = tool(
  async (input) => JSON.stringify(input),
  {
    name: "render_action_checklist",
    description:
      "Gunakan alat ini saat kamu memberikan 2-4 instruksi langkah nyata pencegahan atau pemulihan akun yang dapat dicentang siswa secara mandiri.",
    schema: ActionChecklistSchema,
  }
);

export const renderDomainInspectorTool = tool(
  async (input) => JSON.stringify(input),
  {
    name: "render_domain_inspector",
    description:
      "Gunakan alat ini saat ada tautan/URL yang dibahas dalam percakapan dan kamu ingin membedah komponen domain (subdomain, domain utama, TLD) secara visual untuk menguji daya kritis siswa.",
    schema: DomainInspectorSchema,
  }
);

export const TAMI_CHAT_TOOLS = [
  renderInteractiveChoiceTool,
  renderThreatRadarTool,
  renderActionChecklistTool,
  renderDomainInspectorTool,
];
