"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  Sword,
  ShieldCheck,
  Skull,
  PaperPlaneRight,
  ArrowClockwise,
  WarningCircle,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";

let arenaMessageCounter = 0;
function createArenaMsgId(prefix: string): string {
  arenaMessageCounter += 1;
  return `${prefix}-${arenaMessageCounter}`;
}

interface ArenaMessage {
  id: string;
  role: "scammer" | "victim" | "coach";
  content: string;
}

interface Scenario {
  id: string;
  title: string;
  adversaryName: string;
  initialMessage: string;
  coachInitial: string;
  quickTactics: string[];
}

const SCENARIOS: Record<string, Scenario[]> = {
  id: [
    {
      id: "free_skin",
      title: "Jebakan Hadiah Game Gratis",
      adversaryName: "Admin-Promo99",
      initialMessage:
        "Halo teman! Selamat, ID akunmu terpilih memenangkan 10.000 Diamond & Skin Eksklusif! Cepat kirim kode OTP 6 angka yang baru kami SMS-kan ke HP-mu sekarang juga ya!",
      coachInitial:
        "Lihat ini! Penipu mengiming-imingi hadiah fantastis dan meminta kode OTP SMS. Mengapa kode OTP tidak boleh diberikan ke siapa pun, bahkan yang mengaku admin?",
      quickTactics: [
        "Admin resmi tidak pernah meminta kode OTP atau SMS ke chat pribadi!",
        "Saya tidak pernah mengikuti undian ini, saya akan cek langsung ke aplikasi resmi.",
        "Tolak hadiah dan laporkan akun ini ke pengembang game.",
      ],
    },
    {
      id: "urgent_teacher",
      title: "Pencatutan Nama Guru Sekolah",
      adversaryName: "Pak Guru (Nomor Baru)",
      initialMessage:
        "Nak, ini Pak Budi guru sekolahmu. Bapak ganti nomor darurat. Tolong cepat klik link ini dan isi password portal ujianmu sekarang, tugasmu belum masuk dan nilai rapotmu terancam 0!",
      coachInitial:
        "Waspada! Pelaku mencatut figur otoritas (Guru) dan menciptakan rasa panik ('nilai rapotmu terancam 0'). Apa cara paling aman untuk memastikan kebenarannya?",
      quickTactics: [
        "Saya akan konfirmasi langsung ke nomor Pak Budi yang tersimpan di grup kelas resmi.",
        "Maaf Pak, saya diajarkan untuk tidak pernah memasukkan kata sandi di tautan luar sekolah.",
        "Saya akan tanyakan hal ini ke orang tua dan wali kelas saya besok di sekolah.",
      ],
    },
    {
      id: "fake_bank",
      title: "Peringatan Pemblokiran Rekening Palsu",
      adversaryName: "Pusat Bantuan Kartu",
      initialMessage:
        "PERINGATAN RESMI: Rekening e-wallet Anda terindikasi transaksi ilegal. Dalam 5 menit saldo akan disita kecuali Anda membalas pesan ini dengan PIN & nomor kartu Anda!",
      coachInitial:
        "Desakan waktu panik ('5 menit saldo disita') adalah ciri khas manipulasi psikologis. Jangan panik. Apa hak dan kewajiban kita saat menerima ancaman seperti ini?",
      quickTactics: [
        "Bank atau dompet digital resmi tidak pernah menyita saldo lewat chat darurat 5 menit.",
        "Saya akan langsung menelepon nomor call center resmi yang tertera di belakang kartu saya.",
        "Saya tidak akan memberikan PIN kepada siapa pun dan segera blokir kontak ini.",
      ],
    },
  ],
  en: [
    {
      id: "free_skin",
      title: "Free Game Skin Trap",
      adversaryName: "Admin-Promo99",
      initialMessage:
        "Hey friend! Congrats, your account ID was selected to win 10,000 Diamonds & Exclusive Skin! Quickly send the 6-digit OTP code we just texted to your phone right now!",
      coachInitial:
        "Look at this! The scammer is baiting you with a fantastic prize and asking for an SMS OTP code. Why should OTP codes never be shared with anyone, even someone claiming to be an admin?",
      quickTactics: [
        "Official admins never ask for OTP or SMS codes in private chats!",
        "I never entered this giveaway, I'll check directly inside the official app.",
        "Decline the prize and report this account to the game developer.",
      ],
    },
    {
      id: "urgent_teacher",
      title: "Teacher Impersonation",
      adversaryName: "Teacher (New Number)",
      initialMessage:
        "Hey, this is Mr. Budi, your school teacher. I changed to an emergency number. Please quickly click this link and enter your exam portal password now—your assignment isn't in and your report card grade is at risk of being a 0!",
      coachInitial:
        "Alert! The attacker is impersonating an authority figure (teacher) and inducing panic ('grade at risk of being 0'). What is the safest way to verify their identity?",
      quickTactics: [
        "I will confirm directly with Mr. Budi's number saved in the official class group.",
        "Sorry Sir, I was taught never to enter my password on links outside official school portals.",
        "I will ask my parents and homeroom teacher about this tomorrow at school.",
      ],
    },
    {
      id: "fake_bank",
      title: "Fake Account Suspension Alert",
      adversaryName: "Card Support Center",
      initialMessage:
        "OFFICIAL NOTICE: Your e-wallet account has been flagged for illegal transactions. In 5 minutes your balance will be seized unless you reply to this message with your PIN & card number!",
      coachInitial:
        "Panic urgency ('5 minutes balance seized') is a classic psychological manipulation tactic. Stay calm. What are your rights and duties when facing this threat?",
      quickTactics: [
        "Official banks or digital wallets never seize funds via an urgent 5-minute chat.",
        "I will directly call the official customer service number printed on the back of my card.",
        "I will never share my PIN with anyone and will block this contact immediately.",
      ],
    },
  ],
};

export function ArenaSimulator() {
  const t = useTranslations("practice");
  const locale = useLocale();
  const scenarios = SCENARIOS[locale] || SCENARIOS.id;

  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const activeScenario = scenarios[selectedScenarioIdx] || scenarios[0];

  const [round, setRound] = useState(1);
  const [defenseScore, setDefenseScore] = useState(100);
  const [history, setHistory] = useState<ArenaMessage[]>([
    {
      id: "scammer-1",
      role: "scammer",
      content: activeScenario.initialMessage,
    },
    {
      id: "coach-1",
      role: "coach",
      content: activeScenario.coachInitial,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConcluded, setIsConcluded] = useState(false);
  const [verdict, setVerdict] = useState<"VICTORY" | "DEFEAT" | "ONGOING">("ONGOING");
  const [educationalSummary, setEducationalSummary] = useState("");

  const handleSelectScenario = (idx: number) => {
    setSelectedScenarioIdx(idx);
    const newSc = scenarios[idx] || scenarios[0];
    setRound(1);
    setDefenseScore(100);
    setIsConcluded(false);
    setVerdict("ONGOING");
    setEducationalSummary("");
    setInput("");
    setHistory([
      {
        id: createArenaMsgId("scammer"),
        role: "scammer",
        content: newSc.initialMessage,
      },
      {
        id: createArenaMsgId("coach"),
        role: "coach",
        content: newSc.coachInitial,
      },
    ]);
  };

  const handleSendMove = async (moveText?: string) => {
    const textToSend = (moveText || input).trim();
    if (!textToSend || isLoading || isConcluded) return;

    const userMsg: ArenaMessage = {
      id: createArenaMsgId("victim"),
      role: "victim",
      content: textToSend,
    };

    const nextHistory = [...history, userMsg];
    setHistory(nextHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/practice/arena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          round,
          userResponse: textToSend,
          conversationHistory: nextHistory.map((h) => ({
            role: h.role,
            content: h.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to evaluate arena move");
      }

      const data = await res.json();

      setDefenseScore(data.defenseScore);
      setIsConcluded(data.isConcluded);
      setVerdict(data.verdict);
      if (data.educationalSummary) {
        setEducationalSummary(data.educationalSummary);
      }

      // Add scammer message & coach whisper to history
      const updatedMessages: ArenaMessage[] = [
        ...nextHistory,
        {
          id: createArenaMsgId("scammer"),
          role: "scammer",
          content: data.scammerMessage,
        },
        {
          id: createArenaMsgId("coach"),
          role: "coach",
          content: data.coachWhisper,
        },
      ];
      setHistory(updatedMessages);

      if (data.isConcluded) {
        if (data.verdict === "VICTORY") {
          try {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
          } catch {}
        }
      } else {
        setRound((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Arena error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Arena Header & Scenario Selector */}
      <LayerCard className="rounded-2xl p-4 sm:p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center shrink-0">
              <Sword size={22} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-tami-text)] leading-snug">
                {t("arena.title")}
              </h3>
              <p className="text-xs text-[var(--color-tami-text-muted)]">
                {t("arena.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Round Badge */}
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 text-xs font-mono font-bold text-[var(--color-tami-text)]">
              {t("arena.round", { current: round })}
            </span>

            {/* Defense Score Meter */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold ring-1 ${
                defenseScore >= 70
                  ? "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-[var(--color-tami-green)]/30"
                  : "bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-[var(--color-tami-red)]/30"
              }`}
            >
              <ShieldCheck size={14} weight="fill" />
              {t("arena.shield", { score: defenseScore })}
            </span>
          </div>
        </div>

        {/* Scenario Selection Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectScenario(idx)}
              className={`px-4 py-2 rounded-full text-xs font-semibold min-h-[40px] cursor-pointer transition-none ${
                idx === selectedScenarioIdx
                  ? "bg-[var(--color-tami-orange)] text-white ring-1 ring-[var(--color-tami-orange)]"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)] ring-1 ring-[var(--color-tami-line)]/40"
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </LayerCard>

      {/* Battle Chat Timeline */}
      <div className="space-y-3.5 max-h-[460px] overflow-y-auto p-1 pr-2">
        {history.map((msg) => {
          if (msg.role === "scammer") {
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-1 ring-[var(--color-tami-red)]/30 flex items-center justify-center shrink-0">
                  <Skull size={18} weight="bold" />
                </div>
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)] text-sm leading-relaxed space-y-1">
                  <span className="text-xs font-bold text-[var(--color-tami-red)] block font-mono">
                    {t("arena.adversaryTag", { name: activeScenario.adversaryName })}
                  </span>
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          }

          if (msg.role === "victim") {
            return (
              <div key={msg.id} className="flex items-start gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center font-bold text-xs shrink-0">
                  U
                </div>
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 bg-[var(--color-tami-orange)] text-white font-medium text-sm leading-relaxed">
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          }

          // Corner Coach (tami)
          return (
            <div
              key={msg.id}
              className="p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 text-xs flex items-start gap-3 my-2"
            >
              <Image
                src="/shai-wave.png"
                alt="tami"
                width={28}
                height={28}
                className="w-7 h-7 object-contain shrink-0 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-[var(--color-tami-orange)] text-xs flex items-center gap-1">
                  <Sparkle size={12} weight="fill" />
                  {t("arena.coachWhisper")}
                </span>
                <p className="text-[var(--color-tami-text)] leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outcome Banner if Concluded */}
      {isConcluded && (
        <div
          className={`p-5 rounded-2xl ring-1 space-y-3 ${
            verdict === "VICTORY"
              ? "bg-[var(--color-tami-green)]/10 ring-[var(--color-tami-green)]/30"
              : "bg-[var(--color-tami-red)]/10 ring-[var(--color-tami-red)]/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {verdict === "VICTORY" ? (
              <CheckCircle size={24} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
            ) : (
              <WarningCircle size={24} weight="fill" className="text-[var(--color-tami-red)] shrink-0" />
            )}
            <h4 className="text-base font-bold text-[var(--color-tami-text)]">
              {verdict === "VICTORY" ? t("arena.victoryTitle") : t("arena.defeatTitle")}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
            {educationalSummary}
          </p>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[var(--color-tami-text)]">
              {t("arena.finalScore", { score: defenseScore })}
            </span>
            <Button
              variant="primary"
              size="base"
              onClick={() => handleSelectScenario(selectedScenarioIdx)}
              className="rounded-full text-xs font-semibold min-h-[44px] px-5 cursor-pointer"
              icon={<ArrowClockwise size={16} weight="bold" />}
            >
              {t("arena.replay")}
            </Button>
          </div>
        </div>
      )}

      {/* Input Controls (Tactical Quick Buttons + Freeform Bar) */}
      {!isConcluded && (
        <div className="space-y-2.5 pt-1">
          {/* Tactical Maneuver Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-tami-text-muted)]">
              {t("arena.tacticsPrompt")}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeScenario.quickTactics.map((tactic, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMove(tactic)}
                  className="text-left p-3.5 rounded-2xl ring-1 ring-[var(--color-tami-line)]/40 bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:ring-[var(--color-tami-orange)] text-xs text-[var(--color-tami-text)] transition-none cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center leading-snug"
                >
                  &ldquo;{tactic}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Custom Typing Bar */}
          <LayerCard className="rounded-2xl p-2 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/50 focus-within:ring-2 focus-within:ring-[var(--color-tami-orange)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMove();
                  }
                }}
                disabled={isLoading}
                placeholder={t("arena.inputPlaceholder")}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-tami-text)] placeholder:text-[var(--color-tami-text-muted)] focus:outline-none min-h-[44px]"
              />
              <Button
                variant="primary"
                size="base"
                onClick={() => handleSendMove()}
                disabled={isLoading || !input.trim()}
                aria-label={t("arena.sendAction")}
                className="rounded-full font-semibold w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                icon={<PaperPlaneRight size={18} weight="bold" />}
              />
            </div>
          </LayerCard>
        </div>
      )}
    </div>
  );
}
