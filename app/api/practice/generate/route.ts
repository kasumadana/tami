import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  PhishingScenarioSchema,
  FirewallScenarioSchema,
  PasswordChallengeSchema,
} from "@/lib/practice-generator-schema";

export const runtime = "nodejs";

const FALLBACK_PHISHING_SCENARIOS = {
  id: [
    {
      id: "game-voucher-scam",
      title: "Hadiah Skin Game Langka Gratis",
      senderName: "Steam Community Rewards",
      senderEmail: "rewards@steancommunnity.co.xyz",
      subject: "[PROMO] Selamat! Akun Anda Terpilih Menerima Dragon Lore AWP Gratis!",
      greeting: "Halo Gamer Hebat,",
      body: "Sebagai apresiasi loyalitas bermain, sistem mendistribusikan voucher inventori eksklusif seharga Rp 2.500.000. Untuk mengklaim sebelum kuota hangus dalam 2 jam, login ke tautan resmi komunitas di bawah ini.",
      linkText: "Klaim Hadiah: https://free-steam-guard.top/claim-reward",
      linkUrl: "https://free-steam-guard.top/claim-reward",
      threatClues: [
        {
          id: "sender" as const,
          title: "Domain Tiruan (Typosquatting)",
          explanation: "Pengirim menggunakan 'steancommunnity' bukan 'steamcommunity' dan berakhiran '.co.xyz'.",
        },
        {
          id: "urgency" as const,
          title: "Desakan Waktu Palsu",
          explanation: "Batas waktu panik 2 jam dirancang agar kamu tergesa-gesa tanpa sempat berpikir logis.",
        },
        {
          id: "link" as const,
          title: "Tautan Domain Mencurigakan (.top)",
          explanation: "Tautan mengarah ke situs eksternal (.top) yang siap mencuri kredensial login akunmu.",
        },
      ],
      socraticQuestion: "Menurutmu, mengapa penipu sangat sering menjanjikan barang game yang sangat mahal secara gratis?",
    },
  ],
  en: [
    {
      id: "game-voucher-scam-en",
      title: "Free Legendary Game Skin Reward",
      senderName: "Steam Community Rewards",
      senderEmail: "rewards@steancommunnity.co.xyz",
      subject: "[PROMO] Congratulations! Your Account Was Selected for a Free Dragon Lore!",
      greeting: "Hello Gamer,",
      body: "As a token of appreciation for your activity, our system is granting you an exclusive item bundle worth $150. To claim before your voucher expires in 2 hours, verify your credentials below.",
      linkText: "Claim Bundle: https://free-steam-guard.top/claim-reward",
      linkUrl: "https://free-steam-guard.top/claim-reward",
      threatClues: [
        {
          id: "sender" as const,
          title: "Typosquatting Sender Domain",
          explanation: "Notice 'steancommunnity' with an 'n' and ending in '.co.xyz' instead of the official domain.",
        },
        {
          id: "urgency" as const,
          title: "Manufactured Panic Timer",
          explanation: "The 2-hour deadline aims to make you panic and click before inspecting the clues.",
        },
        {
          id: "link" as const,
          title: "Suspicious TLD Link (.top)",
          explanation: "The destination link points to a rogue phishing portal designed to hijack your account.",
        },
      ],
      socraticQuestion: "Why do you think scammers love using rare video game items as bait for young players?",
    },
  ],
};

const FALLBACK_FIREWALL_SCENARIOS = {
  id: {
    id: "firewall-castle-gate",
    title: "Pengamanan Gerbang Kastil Sekolah",
    description: "Atur gerbang agar siswa dapat berselancar web dengan aman namun penyusup backdoor tertolak.",
    packets: [
      {
        id: 1,
        port: 443,
        label: "Pencarian Materi Ensiklopedia Web",
        metaphorName: "Pintu Tamu Resmi (HTTPS)",
        isMalicious: false,
        threatReason: "Lalu lintas web resmi untuk belajar siswa. Wajib DIIZINKAN.",
      },
      {
        id: 2,
        port: 4444,
        label: "Kuda Kayu Penyusup (Trojan Backdoor RAT)",
        metaphorName: "Pintu Rahasia Penyusup Gelap",
        isMalicious: true,
        threatReason: "Peretas mencoba mengendalikan webcam dan mikrofon dari jarak jauh. Wajib DIBLOKIR.",
      },
      {
        id: 3,
        port: 22,
        label: "Upaya Dobrak Paksa Brute Force (SSH Probe)",
        metaphorName: "Pintu Kunci Ruang Server",
        isMalicious: true,
        threatReason: "Bot asing menebak password administrator secara otomatis ribuan kali. Wajib DIBLOKIR.",
      },
      {
        id: 4,
        port: 443,
        label: "Sinkronisasi Modul Pembelajaran Online",
        metaphorName: "Pintu Tamu Resmi (HTTPS)",
        isMalicious: false,
        threatReason: "Akses materi pelajaran sah sekolah. Wajib DIIZINKAN.",
      },
    ],
    correctRules: {
      "443": "ALLOW" as const,
      "4444": "BLOCK" as const,
      "22": "BLOCK" as const,
    },
    socraticQuestion: "Jika pintu resmi (Port 443) kamu blokir, apa yang akan terjadi pada siswa yang ingin belajar?",
  },
  en: {
    id: "firewall-castle-gate-en",
    title: "School Digital Castle Gatehouse",
    description: "Configure gateway rules to allow safe web browsing while barring malicious backdoor intruders.",
    packets: [
      {
        id: 1,
        port: 443,
        label: "Online Encyclopedia Research",
        metaphorName: "Official Guest Gate (HTTPS)",
        isMalicious: false,
        threatReason: "Legitimate school web browsing. Must be ALLOWED.",
      },
      {
        id: 2,
        port: 4444,
        label: "Trojan Horse Spyware (Backdoor RAT)",
        metaphorName: "Dark Secret Tunnel",
        isMalicious: true,
        threatReason: "An attacker is trying to access webcams and microphones remotely. Must be BLOCKED.",
      },
      {
        id: 3,
        port: 22,
        label: "Brute-Force Door Slamming (SSH Probe)",
        metaphorName: "Server Vault Lock",
        isMalicious: true,
        threatReason: "An automated bot is hammering passwords to break into server storage. Must be BLOCKED.",
      },
      {
        id: 4,
        port: 443,
        label: "Online Learning Assignment Sync",
        metaphorName: "Official Guest Gate (HTTPS)",
        isMalicious: false,
        threatReason: "Legitimate educational platform traffic. Must be ALLOWED.",
      },
    ],
    correctRules: {
      "443": "ALLOW" as const,
      "4444": "BLOCK" as const,
      "22": "BLOCK" as const,
    },
    socraticQuestion: "What would happen to students trying to study if we accidentally locked the Official Guest Gate (Port 443)?",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = (body.type as "phishing" | "firewall" | "password") || "phishing";
    const language = (body.locale as "id" | "en") || "id";

    const apiKey = process.env.GEMINI_API_KEY;

    // Fast static fallback if no API key or offline demo mode
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      if (type === "phishing") {
        const scenarios = FALLBACK_PHISHING_SCENARIOS[language] || FALLBACK_PHISHING_SCENARIOS.id;
        const randomItem = scenarios[Math.floor(Math.random() * scenarios.length)];
        return NextResponse.json({ success: true, scenario: randomItem, source: "preset" });
      }
      if (type === "firewall") {
        const scenario = FALLBACK_FIREWALL_SCENARIOS[language] || FALLBACK_FIREWALL_SCENARIOS.id;
        return NextResponse.json({ success: true, scenario, source: "preset" });
      }
      return NextResponse.json({
        success: true,
        scenario: {
          id: `pwd-chal-${Date.now()}`,
          hint: language === "en" ? "Create a 4-word memorable passphrase with symbols!" : "Rangkai 4 kata acak tak terduga dengan angka pemisah!",
          samplePassphrase: language === "en" ? "orbit-pencil-guitar-winter-88" : "kucing-oren-lompat-tinggi-99",
          explanation: language === "en" ? "Long passphrases have massive entropy pools that take supercomputers millennia to crack." : "Frasa panjang menghasilkan kombinasi triliunan bit yang mustahil ditebak komputer.",
          socraticQuestion: language === "en" ? "Why is a 4-word story easier for humans to remember than 'X$9q#kL2'?" : "Menurutmu, mengapa cerita 4 kata lebih mudah diingat otak manusia dibanding 'X$9q#kL2'?",
        },
        source: "preset",
      });
    }

    // Dynamic AI Generation via Gemini 3.5 Flash-Lite
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash-lite",
      temperature: 0.7,
    });

    if (type === "phishing") {
      const structuredModel = model.withStructuredOutput(PhishingScenarioSchema);
      const systemPrompt = `You are "tami", an expert cybersecurity tutor for students aged 8-15.
Generate a realistic, child-friendly phishing simulation scenario in ${language === "en" ? "English" : "Bahasa Indonesia"}.
Topics to pick randomly:
- Online game giveaway / free voucher (Robux, Minecraft, Steam)
- Fake social media alert (account deletion warning in 2 hours)
- Fake courier package delivery notification asking to download a receipt
Always include exactly 3 clues:
1. 'sender': fake domain typosquatting
2. 'urgency': manufactured urgency/panic timer
3. 'link': dangerous third-party link with a suspicious extension
Keep it educational, exciting, and appropriate for kids.`;

      const result = await structuredModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage("Generate a brand new, novel phishing audit scenario."),
      ]);

      return NextResponse.json({ success: true, scenario: result, source: "ai" });
    }

    if (type === "firewall") {
      const structuredModel = model.withStructuredOutput(FirewallScenarioSchema);
      const systemPrompt = `You are "tami", an expert cybersecurity tutor for students aged 8-15.
Generate a digital castle gatehouse packet filtering mission in ${language === "en" ? "English" : "Bahasa Indonesia"}.
Include 4 incoming packets across ports 443 (safe web), 4444 (Trojan backdoor), and 22 (SSH brute force probe).
Assign relatable, kid-friendly physical metaphors to each packet (e.g. Official Guest Gate, Secret Tunnel, Vault Lock).
Set correctRules appropriately.`;

      const result = await structuredModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage("Generate a digital castle firewall challenge."),
      ]);

      return NextResponse.json({ success: true, scenario: result, source: "ai" });
    }

    // Password challenge
    const structuredModel = model.withStructuredOutput(PasswordChallengeSchema);
    const result = await structuredModel.invoke([
      new SystemMessage(`You are "tami". Generate a kid-friendly password entropy riddle in ${language === "en" ? "English" : "Bahasa Indonesia"}.`),
      new HumanMessage("Generate a fun passphrase challenge."),
    ]);

    return NextResponse.json({ success: true, scenario: result, source: "ai" });
  } catch (error) {
    console.error("Practice generator error:", error);
    // On error, gracefully return standard preset fallback
    return NextResponse.json({
      success: true,
      scenario: FALLBACK_PHISHING_SCENARIOS.id[0],
      source: "fallback",
    });
  }
}
