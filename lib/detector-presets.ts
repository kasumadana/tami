import { DetectorResult } from "./detector-schema";

export const SAMPLE_PRESET_RESULTS: Record<string, Record<string, DetectorResult>> = {
  id: {
    "sample-phishing-sms": {
      status: "ANALYZED",
      riskLevel: "DANGEROUS",
      confidenceScore: 98,
      headline: "SMS Phishing Perbankan & Rekayasa Sosial Terdeteksi",
      summary:
        "Tangkapan layar ini memuat indikator kuat penipuan SMS (smishing). Pelaku memalsukan nama pengirim (BANK-INFO-ALERT), menciptakan desakan panik pemblokiran 15 menit, dan mengarahkan korban ke domain tiruan berbahaya (.xyz) untuk mencuri kredensial login perbankan.",
      ocrText:
        "SMS Dari: BANK-INFO-ALERT\n[PERINGATAN REKENING TERBLOKIR]\nAkun anda dinonaktifkan dalam 15 menit.\nVerifikasi sekarang: https://b-a-n-k-pusat.xyz/login\nJangan berikan SMS ini ke siapapun!",
      anomaliesFound: [
        {
          category: "Manipulasi Domain (Typosquatting)",
          description:
            "Domain tautan 'b-a-n-k-pusat.xyz' menggunakan TLD .xyz dan tanda hubung bertingkat, bukan domain resmi perbankan berlisensi.",
          severity: "high",
        },
        {
          category: "Desakan Waktu Panik (Urgency Trap)",
          description:
            "Ancaman 'Akun dinonaktifkan dalam 15 menit' dirancang untuk memanipulasi psikologis korban agar panik dan terburu-buru mengklik.",
          severity: "high",
        },
        {
          category: "Pencurian Kredensial Perbankan",
          description:
            "Mengarahkan ke halaman formulir login palsu untuk merekam username, password, serta kode OTP/PIN rekening.",
          severity: "high",
        },
      ],
      reflectionQuestions: [
        "Mengapa bank resmi tidak pernah menggunakan domain murah berakhiran .xyz untuk layanan nasabah?",
        "Jika kamu menerima pesan darurat seperti ini, langkah konfirmasi apa yang paling aman sebelum panik?",
      ],
      safetyTips: [
        "Jangan pernah mengklik tautan verifikasi rekening dari SMS atau nomor pribadi.",
        "Hubungi call center resmi bank yang tertera di balik fisik kartu ATM/debitmu.",
        "Segera laporkan dan blokir nomor pengirim pesan penipuan.",
      ],
      exploitSimulation: {
        scenarioTitle: "Apa yang terjadi jika kamu mengeklik link 'b-a-n-k-pusat.xyz'?",
        steps: [
          {
            step: 1,
            title: "Pemuatan Formulir Tiruan Bank",
            victimView:
              "Muncul halaman persis seperti portal mobile banking yang meminta nomor rekening, PIN, dan nomor HP.",
            behindTheScenes:
              "Server penyerang mencatat setiap ketikan data sensitif ke server database hacker tanpa menghubungi pihak bank asli.",
            lossRisk: "Nomor kartu dan PIN tercuri seketika",
          },
          {
            step: 2,
            title: "Permintaan Kode OTP SMS",
            victimView:
              "Situs menampilkan layar 'Masukkan 6 angka OTP SMS yang dikirimkan bank untuk membatalkan blokir'.",
            behindTheScenes:
              "Hacker secara simultan memicu transaksi transfer di bank asli dan memanfaatkan kode OTP yang kamu masukkan untuk memvalidasi transaksi tersebut.",
            lossRisk: "Pengambilalihan otorisasi transaksi finansial",
          },
          {
            step: 3,
            title: "Pengurasan Saldo Rekening",
            victimView:
              "Muncul pesan 'Server Error: Silakan coba 1 jam lagi', sementara SMS mutasi pengurangan saldo masuk ke HP-mu.",
            behindTheScenes:
              "Saldo rekening dikuras ke rekening penampung (money mule) secara instan sehingga sulit dilacak kembali.",
            lossRisk: "Kehilangan saldo finansial secara permanen",
          },
        ],
        mitigationAdvice:
          "Segera hubungi call center resmi bank untuk memblokir kartu dan rekening, serta buat laporan ke pihak kepolisian dan bank terkait.",
      },
      isRelevantDigitalMessage: true,
    },
    "sample-fake-game-login": {
      status: "ANALYZED",
      riskLevel: "DANGEROUS",
      confidenceScore: 95,
      headline: "Jebakan Hadiah Game Gratis & Pencurian Akun (Phishing)",
      summary:
        "Tangkapan layar ini menunjukkan situs phishing game klasik. Pelaku memancing dengan iming-iming 9.999 diamond gratis tanpa syarat, lalu meminta pemain memasukkan username dan kata sandi game pada formulir web tidak resmi.",
      ocrText:
        "CLAIM 9999 DIAMONDS FREE\nUsername / Email: [ user@example.com ]\nPassword: [ ********** ]\nAMBIL HADIAH SEKARANG",
      anomaliesFound: [
        {
          category: "Umpan Hadiah Palsu (Too Good To Be True)",
          description:
            "Penawaran ribuan mata uang game secara cuma-cuma adalah taktik penipuan paling umum untuk menyasar gamer muda.",
          severity: "high",
        },
        {
          category: "Permintaan Password Langsung",
          description:
            "Meminta kata sandi di formulir web pihak ketiga. Pengembang game resmi tidak pernah meminta kata sandi akunmu untuk klaim event.",
          severity: "high",
        },
        {
          category: "Absensi Protokol Autentikasi Resmi (OAuth)",
          description:
            "Tidak menggunakan Single Sign-On (SSO) resmi pengembang game (seperti Google Play, Apple ID, atau Steam Login).",
          severity: "medium",
        },
      ],
      reflectionQuestions: [
        "Menurutmu, mengapa pengembang game tidak pernah meminta kata sandi pemain hanya untuk membagikan hadiah event?",
        "Apa bahayanya jika kita menggunakan kata sandi yang sama antara akun game dan email pribadi?",
      ],
      safetyTips: [
        "Jangan pernah mengetikkan kata sandi game di luar aplikasi atau launcher resmi.",
        "Aktifkan Autentikasi Dua Faktor (2FA/Steam Guard/Google Authenticator) di semua akun gamemu.",
        "Klaim event atau kode promo hanya dari menu in-game resmi pengembang.",
      ],
      exploitSimulation: {
        scenarioTitle: "Apa yang terjadi jika kamu memasukkan password di formulir klaim diamond ini?",
        steps: [
          {
            step: 1,
            title: "Penyalinan Kredensial Akun",
            victimView:
              "Layar menampilkan animasi putar 'Memverifikasi ID Akun...' seolah-olah diamond sedang dikirimkan.",
            behindTheScenes:
              "Bot otomatis mencatat kombinasi email dan password, lalu langsung menguji login ke server game resmi.",
            lossRisk: "Kata sandi dan email akun game bocor",
          },
          {
            step: 2,
            title: "Penggantian Email & Nomor Pemulihan",
            victimView:
              "Tiba-tiba kamu terlempar keluar dari game (force logged out) di HP atau komputermu.",
            behindTheScenes:
              "Bot penyerang segera mengganti email keamanan, password, dan mencabut tautan akun media sosial korban.",
            lossRisk: "Kehilangan kepemilikan dan akses akun secara total",
          },
          {
            step: 3,
            title: "Pencurian Item & Penjualan Akun",
            victimView:
              "Teman-temanmu mengabarkan bahwa karakter gamemu sedang dijual murah di grup media sosial.",
            behindTheScenes:
              "Koleksi skin langka ditransfer ke akun lain dan akun dijual ke pasar gelap game ilegal.",
            lossRisk: "Kerugian seluruh riwayat progres game dan skin langka",
          },
        ],
        mitigationAdvice:
          "Segera lakukan pemulihan akun melalui formulir bantuan resmi pengembang game dengan menyertakan bukti kepemilikan/transaksi pertama.",
      },
      isRelevantDigitalMessage: true,
    },
    "sample-safe-message": {
      status: "ANALYZED",
      riskLevel: "SAFE",
      confidenceScore: 96,
      headline: "Pengumuman Resmi Sekolah yang Valid & Aman",
      summary:
        "Tangkapan layar ini merupakan pengumuman resmi sekolah yang sah. Menggunakan domain resmi pendidikan Indonesia berakhiran '.sch.id', tidak meminta kredensial atau biaya, serta memuat informasi akademik tanpa desakan manipulatif.",
      ocrText:
        "Pemberitahuan Resmi Sekolah\nJadwal Ujian Akhir Semester\nInformasi resmi dapat diakses melalui portal sekolah:\nhttps://smpn1-teladan.sch.id/pengumuman\nTidak memungut biaya apapun.",
      anomaliesFound: [],
      reflectionQuestions: [
        "Apa tanda yang membedakan domain resmi sekolah (.sch.id) dengan domain umum seperti .com atau .xyz?",
        "Mengapa transparansi 'Tidak memungut biaya apapun' menjadi salah satu indikator keamanan informasi publik?",
      ],
      safetyTips: [
        "Simpan alamat website resmi sekolahmu di daftar bookmark peramban agar tidak salah buka.",
        "Selalu periksa domain berakhiran '.sch.id' untuk memastikan keaslian institusi sekolah di Indonesia.",
        "Konfirmasikan pengumuman penting langsung ke wali kelas jika merasa ragu.",
      ],
      isRelevantDigitalMessage: true,
    },
  },
  en: {
    "sample-phishing-sms": {
      status: "ANALYZED",
      riskLevel: "DANGEROUS",
      confidenceScore: 98,
      headline: "Banking Phishing SMS & Social Engineering Trap Detected",
      summary:
        "This screenshot displays clear indicators of SMS phishing (smishing). The attacker spoofed a bank sender ID (BANK-INFO-ALERT), manufactured a 15-minute panic deadline, and lures the victim to an unofficial suspicious domain (.xyz) to siphon sensitive banking credentials.",
      ocrText:
        "SMS Dari: BANK-INFO-ALERT\n[PERINGATAN REKENING TERBLOKIR]\nAkun anda dinonaktifkan dalam 15 menit.\nVerifikasi sekarang: https://b-a-n-k-pusat.xyz/login\nJangan berikan SMS ini ke siapapun!",
      anomaliesFound: [
        {
          category: "Domain Typosquatting",
          description:
            "The link URL 'b-a-n-k-pusat.xyz' uses an unofficial .xyz TLD and hyphens, completely differing from verified licensed banking domains.",
          severity: "high",
        },
        {
          category: "Panic Urgency Manipulation",
          description:
            "Threatening account closure within 15 minutes is an emotional pressure tactic designed to bypass critical thinking.",
          severity: "high",
        },
        {
          category: "Credential Harvesting Trap",
          description:
            "Directs victims to a counterfeit login interface to harvest usernames, passwords, and SMS OTP/PIN codes.",
          severity: "high",
        },
      ],
      reflectionQuestions: [
        "Why would legitimate financial institutions never use cheap .xyz web addresses for customer portals?",
        "If you encounter an urgent alert like this, what is the safest verification protocol before taking any action?",
      ],
      safetyTips: [
        "Never click account verification links received via SMS or messaging apps.",
        "Contact your bank solely through the official telephone number printed on the back of your physical card.",
        "Block the suspicious sender number and report it to consumer fraud authorities.",
      ],
      exploitSimulation: {
        scenarioTitle: "What happens if you click the 'b-a-n-k-pusat.xyz' link?",
        steps: [
          {
            step: 1,
            title: "Fake Banking Portal Load",
            victimView:
              "A counterfeit webpage mimicking your mobile banking portal prompts you for your account number, PIN, and phone number.",
            behindTheScenes:
              "The attacker's server logs every keystroke directly into a hacker database without contacting the actual bank.",
            lossRisk: "Bank account number and PIN compromised",
          },
          {
            step: 2,
            title: "SMS OTP Interception",
            victimView:
              "The screen asks you to enter the 6-digit SMS verification code sent to your phone to 'cancel the suspension'.",
            behindTheScenes:
              "The attacker triggers an unauthorized wire transfer on the real banking server and feeds the OTP you just provided to authorize the transfer.",
            lossRisk: "Hijacking of transaction authorization",
          },
          {
            step: 3,
            title: "Account Drainage",
            victimView:
              "The screen shows a fake 'Network Timeout' message, followed by real debit alert notifications arriving on your phone.",
            behindTheScenes:
              "Funds are immediately transferred into anonymous mule accounts and liquidated.",
            lossRisk: "Permanent financial loss",
          },
        ],
        mitigationAdvice:
          "Immediately contact your bank's emergency hotline to freeze your cards and accounts, and file a fraud report with law enforcement.",
      },
      isRelevantDigitalMessage: true,
    },
    "sample-fake-game-login": {
      status: "ANALYZED",
      riskLevel: "DANGEROUS",
      confidenceScore: 95,
      headline: "Free In-Game Currency Bait & Account Theft (Phishing)",
      summary:
        "This screenshot illustrates a classic gaming phishing trap. Scammers bait players with 9,999 free diamonds, then ask for account usernames and passwords on an unverified third-party webpage.",
      ocrText:
        "CLAIM 9999 DIAMONDS FREE\nUsername / Email: [ user@example.com ]\nPassword: [ ********** ]\nAMBIL HADIAH SEKARANG",
      anomaliesFound: [
        {
          category: "Unrealistic Reward Incentive",
          description:
            "Offering thousands of premium currency for free is the most frequent bait used to target student gamers.",
          severity: "high",
        },
        {
          category: "Plaintext Password Harvesting",
          description:
            "Requesting login passwords on an external form. Legitimate game publishers never ask for passwords to distribute event gifts.",
          severity: "high",
        },
        {
          category: "Missing Verified OAuth Flow",
          description:
            "Lacks authentic Single Sign-On (SSO) integration (e.g., Google Play, Apple ID, or Steam Guard authentication).",
          severity: "medium",
        },
      ],
      reflectionQuestions: [
        "Why do game developers never require player passwords just to award event cosmetics or gifts?",
        "What are the risks of using the same password across both your gaming accounts and primary email?",
      ],
      safetyTips: [
        "Never enter your gaming passwords on external browser pages outside the official client.",
        "Enable Two-Factor Authentication (2FA/Steam Guard) on all your gaming accounts.",
        "Redeem gift codes solely through the verified in-game event center.",
      ],
      exploitSimulation: {
        scenarioTitle: "What happens if you enter your credentials on this diamond claim page?",
        steps: [
          {
            step: 1,
            title: "Credential Interception",
            victimView:
              "A spinner displays 'Verifying Player ID...' giving the illusion that diamonds are being processed.",
            behindTheScenes:
              "Automated scripts record your email and password, attempting an immediate login to official game servers.",
            lossRisk: "Gaming credentials leaked",
          },
          {
            step: 2,
            title: "Recovery Email & Phone Swap",
            victimView:
              "Your gaming session on your PC or phone is suddenly disconnected (forced logout).",
            behindTheScenes:
              "The attacker changes recovery contact methods and unlinks connected social profiles.",
            lossRisk: "Complete loss of account ownership and access",
          },
          {
            step: 3,
            title: "Inventory Liquidation & Account Sale",
            victimView:
              "Friends notify you that your avatar is being advertised for cheap on underground trading groups.",
            behindTheScenes:
              "Rare skins are traded away to intermediary accounts and the profile is sold on black markets.",
            lossRisk: "Irreversible loss of rare inventory and progress",
          },
        ],
        mitigationAdvice:
          "Immediately submit an account recovery ticket through the official game publisher portal with your first transaction receipt attached.",
      },
      isRelevantDigitalMessage: true,
    },
    "sample-safe-message": {
      status: "ANALYZED",
      riskLevel: "SAFE",
      confidenceScore: 96,
      headline: "Official School Announcement (Verified & Safe)",
      summary:
        "This screenshot contains a legitimate educational notice. It directs to an official Indonesian educational domain (.sch.id), asks for neither credentials nor payments, and communicates academic info without manipulative urgency.",
      ocrText:
        "Pemberitahuan Resmi Sekolah\nJadwal Ujian Akhir Semester\nInformasi resmi dapat diakses melalui portal sekolah:\nhttps://smpn1-teladan.sch.id/pengumuman\nTidak memungut biaya apapun.",
      anomaliesFound: [],
      reflectionQuestions: [
        "What distinguishes verified educational domains (.sch.id) from generic commercial domains (.com/.xyz)?",
        "Why is stating 'No fees charged' a recognized hallmark of legitimate public service communications?",
      ],
      safetyTips: [
        "Bookmark your official school website in your browser to avoid typosquatting traps.",
        "Check that institutional Indonesian school websites use the genuine '.sch.id' top-level domain.",
        "Directly verify critical academic notices with your homeroom teacher whenever in doubt.",
      ],
      isRelevantDigitalMessage: true,
    },
  },
};
