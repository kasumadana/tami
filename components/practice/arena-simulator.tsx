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
  Sparkle,
  ChatCircleDots,
  User,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { Badge } from "@cloudflare/kumo/components/badge";
import { recordChallengeSuccess } from "@/lib/practice-store";
import { SocraticDebriefDialog } from "./socratic-debrief-dialog";

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
  socraticQuestion: string;
  quickTactics: string[];
}

const SCENARIOS: Record<string, Scenario[]> = {
  id: [
    {
      id: "free_skin",
      title: "Hadiah Game Gratis",
      adversaryName: "Admin-Promo99",
      initialMessage:
        "Halo teman! Selamat, ID akunmu terpilih memenangkan 10.000 Diamond & Skin Eksklusif! Cepat kirim kode OTP 6 angka yang baru kami SMS-kan ke HP-mu sekarang juga ya!",
      coachInitial:
        "Lihat ini! Penipu mengiming-imingi hadiah fantastis dan meminta kode OTP SMS. Mengapa kode OTP tidak boleh diberikan ke siapa pun, bahkan yang mengaku admin?",
      socraticQuestion:
        "Mengapa penipu game sering meminta kode OTP SMS, dan apa akibatnya jika kode itu diserahkan?",
      quickTactics: [
        "Admin resmi tidak pernah meminta kode OTP atau SMS ke chat pribadi!",
        "Saya tidak pernah ikut undian ini, saya cek langsung ke aplikasi resmi.",
        "Tolak hadiah dan laporkan akun ini ke pengembang game.",
      ],
    },
    {
      id: "urgent_teacher",
      title: "Pencatutan Nama Guru",
      adversaryName: "Pak Guru (Nomor Baru)",
      initialMessage:
        "Nak, ini Pak Budi guru sekolahmu. Bapak ganti nomor darurat. Tolong cepat klik link ini dan isi password portal ujianmu sekarang, tugasmu belum masuk dan nilai rapotmu terancam 0!",
      coachInitial:
        "Waspada! Pelaku mencatut figur otoritas (Guru) dan menciptakan rasa panik ('nilai rapotmu terancam 0'). Apa cara paling aman untuk memastikan kebenarannya?",
      socraticQuestion:
        "Saat ada orang mencatut nama guru dan mendesak dengan ancaman nilai rapot, bagaimana langkah verifikasi teraman?",
      quickTactics: [
        "Saya akan konfirmasi langsung ke nomor Pak Budi yang tersimpan di grup kelas resmi.",
        "Maaf Pak, saya diajarkan untuk tidak memasukkan kata sandi di tautan luar sekolah.",
        "Saya akan tanyakan hal ini ke orang tua dan wali kelas saya besok di sekolah.",
      ],
    },
    {
      id: "fake_bank",
      title: "Pemblokiran Rekening Palsu",
      adversaryName: "Pusat Bantuan Kartu",
      initialMessage:
        "PERINGATAN RESMI: Rekening e-wallet Anda terindikasi transaksi ilegal. Dalam 5 menit saldo akan disita kecuali Anda membalas pesan ini dengan PIN & nomor kartu Anda!",
      coachInitial:
        "Desakan waktu panik ('5 menit saldo disita') adalah ciri khas manipulasi psikologis. Jangan panik. Apa hak dan kewajiban kita saat menerima ancaman seperti ini?",
      socraticQuestion:
        "Mengapa desakan waktu seperti '5 menit saldo disita' sangat manjur memancing korban, dan bagaimana cara mematahkannya?",
      quickTactics: [
        "Bank atau dompet digital resmi tidak pernah menyita saldo lewat chat darurat 5 menit.",
        "Saya akan langsung menelepon nomor call center resmi di belakang kartu saya.",
        "Saya tidak akan memberikan PIN kepada siapa pun dan segera blokir kontak ini.",
      ],
    },
  ],
  en: [
    {
      id: "free_skin",
      title: "Free Game Skin",
      adversaryName: "Admin-Promo99",
      initialMessage:
        "Hey friend! Congrats, your account ID was selected to win 10,000 Diamonds & Exclusive Skin! Quickly send the 6-digit OTP code we just texted to your phone right now!",
      coachInitial:
        "Look at this! The scammer is baiting you with a fantastic prize and asking for an SMS OTP code. Why should OTP codes never be shared with anyone, even someone claiming to be an admin?",
      socraticQuestion:
        "Why do game scammers constantly demand SMS OTP codes, and what happens if that code is revealed?",
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
      socraticQuestion:
        "When an attacker poses as a teacher and uses urgent grade threats, what is the safest verification protocol?",
      quickTactics: [
        "I will confirm directly with Mr. Budi's number saved in the official class group.",
        "Sorry Sir, I was taught never to enter my password on links outside official school portals.",
        "I will ask my parents and homeroom teacher about this tomorrow at school.",
      ],
    },
    {
      id: "fake_bank",
      title: "Fake Suspension Alert",
      adversaryName: "Card Support Center",
      initialMessage:
        "OFFICIAL NOTICE: Your e-wallet account has been flagged for illegal transactions. In 5 minutes your balance will be seized unless you reply to this message with your PIN & card number!",
      coachInitial:
        "Panic urgency ('5 minutes balance seized') is a classic psychological manipulation tactic. Stay calm. What are your rights and duties when facing this threat?",
      socraticQuestion:
        "Why is manufactured panic like '5 minutes to forfeiture' so effective, and how do we counter it?",
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
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [verdict, setVerdict] = useState<"VICTORY" | "DEFEAT" | "ONGOING">("ONGOING");
  const [educationalSummary, setEducationalSummary] = useState("");

  const handleSelectScenario = (idx: number) => {
    setSelectedScenarioIdx(idx);
    const newSc = scenarios[idx] || scenarios[0];
    setRound(1);
    setDefenseScore(100);
    setIsConcluded(false);
    setIsDebriefOpen(false);
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

  const handleReset = () => {
    handleSelectScenario(selectedScenarioIdx);
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
          recordChallengeSuccess("arena", "Social Engineering Shield", 100);
          try {
            confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
          } catch {}
          setIsDebriefOpen(true);
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
    <div className="space-y-6">
      <LayerCard className="rounded-2xl p-6 sm:p-7 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-6">
        {/* Canonical Header: Icon + Title + Description (Left) & Controls (Right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-tami-line)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sword size={22} className="text-[var(--color-tami-orange)]" weight="fill" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {t("arena.title")}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {t("arena.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Round Badge */}
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 text-xs font-mono font-bold text-[var(--color-tami-text)]">
              {t("arena.round", { current: round })}
            </span>

            {/* Defense Score Meter */}
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold ring-1 ${
                defenseScore >= 70
                  ? "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-[var(--color-tami-green)]/30"
                  : "bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-[var(--color-tami-red)]/30"
              }`}
            >
              <ShieldCheck size={15} weight="fill" />
              {t("arena.shield", { score: defenseScore })}
            </span>
          </div>
        </div>

        {/* Scenario Selector: Clean Preset Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[var(--color-tami-text-muted)] shrink-0 mr-1">
            {t("presetLabel")}
          </span>
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectScenario(idx)}
              className={`px-4 py-2 rounded-full text-xs font-semibold min-h-[40px] cursor-pointer transition-none ${
                idx === selectedScenarioIdx
                  ? "bg-[var(--color-tami-orange)] text-white shadow-xs"
                  : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] ring-1 ring-[var(--color-tami-line)]/50"
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Chat Stage Canvas */}
        <div className="rounded-2xl p-4 sm:p-5 bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-4 max-h-[440px] overflow-y-auto">
          {history.map((msg) => {
            if (msg.role === "scammer") {
              return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-1 ring-[var(--color-tami-red)]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Skull size={17} weight="bold" />
                  </div>
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/60 text-sm leading-relaxed space-y-1">
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
                  <div className="w-8 h-8 rounded-full bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={16} weight="bold" />
                  </div>
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 bg-[var(--color-tami-orange)] text-white font-medium text-sm leading-relaxed">
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            }

            // Coach Whisper (tami)
            return (
              <div
                key={msg.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-tami-orange)]/10 ring-1 ring-[var(--color-tami-orange)]/25 text-xs flex items-start gap-3 my-1"
              >
                <Image
                  src="/mascot/tami-shield.webp"
                  alt="tami"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 "
                />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[var(--color-tami-text)] leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input & Tactics Workbench */}
        {!isConcluded && (
          <div className="space-y-3 pt-1">
            {/* Quick Tactics Chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[var(--color-tami-text-muted)] block">
                {t("arena.tacticsPrompt")}
              </span>
              <div className="flex flex-wrap gap-2">
                {activeScenario.quickTactics.map((tactic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSendMove(tactic)}
                    className="text-left px-4 py-2.5 rounded-full ring-1 ring-[var(--color-tami-line)]/60 bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:ring-[var(--color-tami-orange)] text-xs text-[var(--color-tami-text)] transition-none cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center leading-snug"
                  >
                    &ldquo;{tactic}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Freeform Typing Input */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/60 focus-within:ring-2 focus-within:ring-[var(--color-tami-orange)]">
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
                aria-label={t("arena.inputPlaceholder")}
                placeholder={t("arena.inputPlaceholder")}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-[var(--color-tami-text)] placeholder:text-[var(--color-tami-text-muted)] focus:outline-none min-h-[40px]"
              />
              <Button
                variant="primary"
                size="base"
                onClick={() => handleSendMove()}
                disabled={isLoading || !input.trim()}
                aria-label={t("arena.sendAction")}
                className="rounded-full font-semibold w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                icon={<PaperPlaneRight size={17} weight="bold" />}
              />
            </div>
          </div>
        )}

        {/* Canonical Completion & Debrief Banner (When Concluded) */}
        {isConcluded && (
          <div
            className={`p-5 rounded-2xl ring-1 space-y-3 ${
              verdict === "VICTORY"
                ? "bg-[var(--color-tami-green)]/15 ring-[var(--color-tami-green)]/30"
                : "bg-[var(--color-tami-red)]/15 ring-[var(--color-tami-red)]/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                {verdict === "VICTORY" ? (
                  <>
                    <Sparkle size={18} weight="fill" className="text-[var(--color-tami-green)]" />
                    <span className="text-[var(--color-tami-green)]">{t("challengeSuccess")}</span>
                  </>
                ) : (
                  <>
                    <WarningCircle size={18} weight="fill" className="text-[var(--color-tami-red)]" />
                    <span className="text-[var(--color-tami-red)]">{t("arena.defeatTitle")}</span>
                  </>
                )}
              </div>
              {verdict === "VICTORY" && (
                <Badge variant="success" appearance="filled" className="text-xs font-bold">
                  {t("arena.badgeName")}
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[var(--color-tami-text)] leading-relaxed">
              {educationalSummary || (verdict === "VICTORY" ? t("arena.successMsg") : t("arena.defeatTitle"))}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono font-bold text-[var(--color-tami-text)]">
                {t("arena.finalScore", { score: defenseScore })}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="base"
                  onClick={handleReset}
                  className="rounded-full text-xs sm:text-sm font-semibold min-h-[44px] px-4 cursor-pointer"
                  icon={<ArrowClockwise size={15} weight="bold" />}
                >
                  {t("arena.replay")}
                </Button>
                {verdict === "VICTORY" && (
                  <Button
                    variant="primary"
                    size="base"
                    onClick={() => setIsDebriefOpen(true)}
                    className="rounded-full text-xs sm:text-sm font-semibold min-h-[44px] px-5 cursor-pointer"
                    icon={<ChatCircleDots size={16} weight="bold" />}
                  >
                    {t("socraticDebriefBtn")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </LayerCard>

      {/* Socratic Debrief Dialog */}
      <SocraticDebriefDialog
        isOpen={isDebriefOpen}
        onClose={() => setIsDebriefOpen(false)}
        topic="arena"
        scenarioTitle={activeScenario.title}
        socraticQuestion={activeScenario.socraticQuestion}
        onReplay={handleReset}
      />
    </div>
  );
}

