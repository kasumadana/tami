import { z } from "zod";

export const PhishingScenarioSchema = z.object({
  id: z.string().describe("Unique slug for the scenario"),
  title: z.string().describe("Judul skenario yang menarik untuk siswa (misal: Undian Skin Game Legendaris, Peringatan Akun Panik 2 Jam)"),
  senderName: z.string().describe("Nama samaran pengirim (misal: Steam Support Community, TikTok Security Desk)"),
  senderEmail: z.string().describe("Alamat email mencurigakan (misal: support@steamcommunity.co.xyz, verify@tiktok-security-alert.tk)"),
  subject: z.string().describe("Subjek email yang memancing rasa panik atau iming-iming hadiah"),
  greeting: z.string().describe("Salam pembuka email kepada siswa"),
  body: z.string().describe("Isi paragraf pesan email yang mengandung rekayasa sosial atau urgensi waktu"),
  linkText: z.string().describe("Teks tautan jebakan (misal: Klaim Skin Gratis: https://free-steam-rewards.top/login)"),
  linkUrl: z.string().describe("URL tipuan yang diarahkan (menggunakan TLD mencurigakan seperti .top, .xyz, .click)"),
  threatClues: z.array(
    z.object({
      id: z.enum(["sender", "urgency", "link"]),
      title: z.string().describe("Nama indikator bahaya singkat"),
      explanation: z.string().describe("Penjelasan mengapa hal ini berbahaya bagi siswa"),
    })
  ).describe("Daftar 3 indikator bahaya tersembunyi"),
  socraticQuestion: z.string().describe("1 pertanyaan pemantik nalar kritis dari tami mengenai pesan ini"),
});

export const FirewallScenarioSchema = z.object({
  id: z.string().describe("Unique slug for the firewall mission"),
  title: z.string().describe("Judul misi pengamanan kastil digital"),
  description: z.string().describe("Instruksi tugas pengamanan gerbang"),
  packets: z.array(
    z.object({
      id: z.number(),
      port: z.number().describe("Nomor port jaringan (443, 4444, 22, atau 80)"),
      label: z.string().describe("Nama paket data"),
      metaphorName: z.string().describe("Nama metafora ramah anak (misal: Surat Tamu Resmi, Kuda Kayu Penyusup)"),
      isMalicious: z.boolean().describe("Apakah paket ini ancaman berbahaya"),
      threatReason: z.string().describe("Penjelasan mengapa paket ini harus diblokir atau diloloskan"),
    })
  ).describe("Daftar paket data yang mencoba melintasi gerbang"),
  correctRules: z.record(z.string(), z.enum(["ALLOW", "BLOCK"])).describe("Aturan filter yang benar"),
  socraticQuestion: z.string().describe("Pertanyaan refleksi dari tami tentang cara kerja penyusup"),
});

export const PasswordChallengeSchema = z.object({
  id: z.string().describe("ID tantangan teka-teki sandi"),
  hint: z.string().describe("Petunjuk teka-teki untuk membuat atau menganalisis frasa sandi"),
  samplePassphrase: z.string().describe("Contoh frasa sandi kuat yang memenuhi kriteria tantangan"),
  explanation: z.string().describe("Mengapa frasa sandi ini membutuhkan jutaan tahun untuk diretasi"),
  socraticQuestion: z.string().describe("Pertanyaan tami tentang kebiasaan mengingat sandi tanpa mencatatnya"),
});

export type PhishingScenario = z.infer<typeof PhishingScenarioSchema>;
export type FirewallScenario = z.infer<typeof FirewallScenarioSchema>;
export type PasswordChallenge = z.infer<typeof PasswordChallengeSchema>;
