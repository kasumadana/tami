export interface SubmoduleItem {
  id: string;
  title: string;
  badge: string;
  storyHook: string;
  content: string[];
  actionSteps: string[];
  tamiWhisper: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  justifications: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface LearnModuleContent {
  id: string;
  slug: string;
  legacyId: string;
  title: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  iconName: "Key" | "ShieldWarning" | "EyeSlash" | "ChatCircleDots";
  colorClass: string;
  bgClass: string;
  submodules: SubmoduleItem[];
  quizzes: QuizQuestionItem[];
}

export const MODULE_SLUG_MAP: Record<string, string> = {
  module1: "password-security",
  module2: "phishing-detection",
  module3: "data-privacy",
  module4: "cyber-ethics",
  "password-security": "password-security",
  "phishing-detection": "phishing-detection",
  "data-privacy": "data-privacy",
  "cyber-ethics": "cyber-ethics",
};

export const REVERSE_SLUG_MAP: Record<string, string> = {
  "password-security": "module1",
  "phishing-detection": "module2",
  "data-privacy": "module3",
  "cyber-ethics": "module4",
};

export function normalizeModuleSlug(slugOrId: string): string {
  return MODULE_SLUG_MAP[slugOrId] || slugOrId;
}

export const LEARN_MODULES_DATA: Record<string, LearnModuleContent[]> = {
  id: [
    {
      id: "password-security",
      slug: "password-security",
      legacyId: "module1",
      title: "Sandi Kuat & Brankas Kunci",
      category: "Kriptografi & Pertahanan",
      description: "Kuasai seni membuat kata sandi yang mudah kamu ingat, namun mustahil ditebak oleh robot peretas!",
      estimatedMinutes: 7,
      iconName: "Key",
      colorClass: "text-[var(--color-tami-yellow)]",
      bgClass: "bg-[var(--color-tami-yellow)]/15",
      submodules: [
        {
          id: "submod-1-1",
          title: "Mengapa Hacker Mudah Menebak Sandi?",
          badge: "Misteri Sandi",
          storyHook:
            "Bayangkan kamu punya brankas rahasia, tapi kuncinya kamu taruh di bawah keset pintu bertuliskan '123456'. Pencuri komputer tidak menebak satu per satu dengan jari, mereka menggunakan robot pembobol otomatis yang bisa mencoba miliaran tebakan dalam satu detik!",
          content: [
            "Banyak orang memakai nama hewan peliharaan, tanggal lahir, atau kata 'password'. Pola-pola ini adalah hal pertama yang dicoba oleh program peretas.",
            "Semakin pendek kata sandimu, semakin sedikit kombinasi yang harus dicoba robot. Sandi 6 huruf bisa dibobol dalam sekejap mata!",
            "Kunci kekuatan sandi ada pada panjang karakter dan ketidakpastian pola.",
          ],
          actionSteps: [
            "Hindari memakai tanggal lahir, nama sekolah, atau nama akun game.",
            "Jangan pernah gunakan urutan keyboard seperti 'qwerty' atau '12345678'.",
            "Buat sandi minimal 12 karakter untuk akun penting.",
          ],
          tamiWhisper:
            "Ingat teman: Hacker suka yang mudah! Buat mereka pusing dengan sandi yang unik dan tidak tertebak!",
        },
        {
          id: "submod-1-2",
          title: "Trik Frasa Rahasia 3 Kata tami",
          badge: "Formula Ampuh",
          storyHook:
            "Siapa bilang sandi kuat harus serumit 'x$K9#mQ2' yang bikin kamu sendiri lupa? Tami punya trik ajaib: Metode Kalimat Rahasia (Passphrase)!",
          content: [
            "Pilih 3 atau 4 kata benda acak yang tidak berhubungan sama sekali, lalu hubungkan jadi satu kalimat lucu yang hanya kamu yang tahu ceritanya.",
            "Contoh: 'KucingLompatBintang99!' atau 'SepatuTerbangMakanBakso#'.",
            "Robot peretas akan butuh waktu ratusan tahun untuk membobol kombinasi kata acak sepanjang ini, tapi otakmu sangat mudah membayangkannya!",
          ],
          actionSteps: [
            "Pilih 3 kata acak yang lucu atau aneh agar membekas di ingatan.",
            "Sisipkan angka favorit dan simbol unik di antara kata.",
            "Gunakan sandi berbeda untuk setiap akun game atau media sosial.",
          ],
          tamiWhisper:
            "Sandi yang panjang dan berbentuk cerita jauh lebih sakti daripada sandi pendek penuh simbol rumit!",
        },
        {
          id: "submod-1-3",
          title: "Kunci Ganda: Verifikasi 2 Langkah (2FA)",
          badge: "Perisai Pamungkas",
          storyHook:
            "Bagaimana jika ada teman nakal yang mengintip saat kamu mengetik sandi? Tenang, ada jurus penyelamat bernama Verifikasi 2 Langkah (2FA)!",
          content: [
            "2FA seperti rumah yang punya dua pintu kunci: kunci pertama adalah kata sandimu, dan kunci kedua adalah kode rahasia unik yang dikirim ke HP orang tuamu.",
            "Sekalipun pencuri tahu kata sandimu, mereka tetap tidak bisa masuk tanpa kunci kedua tersebut.",
            "Hampir semua platform game (Roblox, Steam, Google) memiliki fitur ini secara gratis.",
          ],
          actionSteps: [
            "Minta bantuan orang tua untuk mengaktifkan 2FA di akun game dan email.",
            "Jangan pernah beritahu kode SMS/OTP 2FA kepada siapa pun, bahkan yang mengaku admin.",
            "Simpan kode cadangan (backup codes) di tempat aman.",
          ],
          tamiWhisper:
            "2FA adalah sahabat terbaik akunmu. Sekali aktif, peretas langsung angkat tangan!",
        },
      ],
      quizzes: [
        {
          id: "q1-1",
          question: "Manakah di antara pilihan berikut yang merupakan kata sandi paling kuat dan aman?",
          options: {
            A: "Budi2012!",
            B: "GajahTerbangMakanDonat#99",
            C: "qwertyuiop123",
            D: "passwordrahasia",
          },
          correct_option: "B",
          explanation: "Metode frasa kata sandi 4 kata acak dengan simbol dan angka sangat panjang dan sulit ditebak robot!",
          justifications: {
            A: "Kurang aman karena memuat nama orang dan tahun lahir yang mudah ditebak.",
            B: "Sempurna! Frasa panjang kombinasi kata acak dengan angka dan simbol sangat tahan banting.",
            C: "Sangat lemah karena merupakan urutan tombol keyboard yang ditebak peretas dalam hitungan detik.",
            D: "Sangat berbahaya karena kata 'password' adalah tebakan nomor 1 peretas.",
          },
        },
        {
          id: "q1-2",
          question: "Mengapa menggunakan tanggal lahir sebagai kata sandi sangat berbahaya?",
          options: {
            A: "Karena tanggal lahir mudah ditemukan orang lain di media sosial atau kartu identitas",
            B: "Karena komputer tidak menyukai angka tahun",
            C: "Karena tanggal lahir membuat komputer lambat",
            D: "Karena robot peretas tidak bisa menghitung angka",
          },
          correct_option: "A",
          explanation: "Data pribadi seperti tanggal lahir sering kali bisa dilihat publik, sehingga menjadi sasaran utama tebakan hacker.",
          justifications: {
            A: "Tepat sekali! Informasi pribadi publik adalah sasaran empuk rekayasa sosial.",
            B: "Keliru, komputer memproses angka dengan sangat cepat.",
            C: "Keliru, angka tanggal tidak mempengaruhi kecepatan komputer.",
            D: "Keliru, robot peretas justru ahli dalam menguji kombinasi angka.",
          },
        },
        {
          id: "q1-3",
          question: "Apa fungsi utama dari Verifikasi 2 Langkah (2FA)?",
          options: {
            A: "Mempercepat koneksi internet saat bermain game",
            B: "Memberi lapisan perlindungan kedua jika kata sandi utama bocor",
            C: "Menghapus akun yang sudah lama tidak dipakai",
            D: "Membuat kita tidak perlu mengingat kata sandi lagi",
          },
          correct_option: "B",
          explanation: "2FA memastikan hanya pemilik sah yang bisa masuk berbekal kode keamanan kedua yang dikirim ke perangkat pribadi.",
          justifications: {
            A: "Keliru, 2FA adalah fitur keamanan akun, bukan akselerator internet.",
            B: "Benar! Sekalipun sandi dicuri, pencuri tetap tertahan di gerbang kedua.",
            C: "Keliru, 2FA tidak menghapus akun.",
            D: "Keliru, sandi utama tetap wajib diingat dan dijaga kerahasiaannya.",
          },
        },
        {
          id: "q1-4",
          question: "Jika seseorang mengaku admin game meminta kode OTP yang baru dikirim ke HP-mu, apa tindakanmu?",
          options: {
            A: "Segera kirim kodenya agar tidak diblokir admin",
            B: "Tolak tegas dan rahasiakan, admin resmi tidak pernah meminta kode OTP!",
            C: "Minta hadiah diamond dulu baru kirim kodenya",
            D: "Kirim separuh angkanya saja",
          },
          correct_option: "B",
          explanation: "Kode OTP adalah kunci gerbang pribadimu. Admin resmi perusahaan game tidak pernah meminta kode OTP melalui pesan obrolan!",
          justifications: {
            A: "Sangat berbahaya! Ini trik penipuan untuk mengambil alih akunmu saat itu juga.",
            B: "Hebat! Kamu paham aturan emas keamanan digital: OTP 100% rahasia pribadimu.",
            C: "Keliru, mereka penipu dan akunmu akan langsung hilang.",
            D: "Keliru, kode OTP tidak boleh dibagikan sama sekali.",
          },
        },
        {
          id: "q1-5",
          question: "Apakah aman memakai satu kata sandi yang sama untuk akun sekolah, game, dan media sosial?",
          options: {
            A: "Sangat aman dan praktis agar tidak repot",
            B: "Boleh saja asalkan sandinya panjang",
            C: "Tidak aman, karena jika satu akun bocor, semua akun lainnya ikut terancam!",
            D: "Aman jika kita hanya bermain game di akhir pekan",
          },
          correct_option: "C",
          explanation: "Prinsip kunci digital: satu gembok satu kunci. Jangan taruh seluruh telurmu dalam satu keranjang yang sama.",
          justifications: {
            A: "Berisiko tinggi! Praktis bukan berarti aman.",
            B: "Meskipun panjang, jika salah satu web penyimpan sandi dibobol, akun lainmu langsung ikut jebol.",
            C: "Tepat sekali! Peretas akan mencoba sandi yang bocor ke seluruh layanan online lainnya.",
            D: "Waktu bermain tidak ada hubungannya dengan keamanan kredensial akun.",
          },
        },
      ],
    },
    {
      id: "phishing-detection",
      slug: "phishing-detection",
      legacyId: "module2",
      title: "Deteksi Phishing & Jebakan Tautan",
      category: "Forensik Tautan & Rekayasa Sosial",
      description: "Jadilah detektif digital handal yang mampu mengendus tautan palsu dan jebakan hadiah tipuan!",
      estimatedMinutes: 7,
      iconName: "ShieldWarning",
      colorClass: "text-[var(--color-tami-red)]",
      bgClass: "bg-[var(--color-tami-red)]/15",
      submodules: [
        {
          id: "submod-2-1",
          title: "Umpan Hadiah Game & Pesan Panik",
          badge: "Taktik Jebakan",
          storyHook:
            "'Selamat! Kamu menang Skin Naga Emas gratis senilai Rp 5 juta! Klik link ini dalam 5 menit sebelum kuota hangus!' Pernah dapat pesan seperti ini? Itu adalah umpan pancingan (phishing)!",
          content: [
            "Kata 'Phishing' berasal dari kata 'Fishing' (memancing). Pelaku memasang umpan menarik atau menakutkan agar kamu panik dan menggigit kailnya.",
            "Ciri utama umpan: Iming-iming hadiah gratis yang tidak masuk akal, atau ancaman panik seperti 'Akunmu akan ditutup 10 menit lagi!'.",
            "Saat emosi kita dipancing, akal sehat sering kali lupa memeriksa keaslian pengirim.",
          ],
          actionSteps: [
            "Jika terdengar terlalu muluk untuk menjadi nyata, 99% itu adalah jebakan penipuan.",
            "Tarik napas dalam-dalam saat membaca pesan ancaman terburu-buru.",
            "Tanyakan pada diri sendiri: 'Apakah aku pernah mendaftar undian ini sebelumnya?'",
          ],
          tamiWhisper:
            "Penipu paling suka membidik rasa serakah dan rasa takut. Tetap tenang dan amati dengan mata detektif!",
        },
        {
          id: "submod-2-2",
          title: "Detektif Huruf: Membaca Domain URL Asli vs Tiruan",
          badge: "Mata Elang",
          storyHook:
            "Penipu bisa membuat halaman web tiruan yang 100% mirip dengan Roblox atau Google. Namun ada satu hal yang tidak bisa mereka curi: nama domain resmi!",
          content: [
            "Perhatikan teknik 'Typosquatting' (meniru nama domain dengan mengganti atau menambah satu huruf janggal).",
            "Contoh jebakan: 'robllox-free.top' alih-alih 'roblox.com', atau 'steancommunnity.co.xyz' alih-alih 'steamcommunity.com'.",
            "Periksa selalu bagian alamat web paling kanan sebelum garis miring pertama.",
          ],
          actionSteps: [
            "Cek ejaan huruf satu per satu di kolom alamat web peramban.",
            "Waspadai akhiran domain asing yang tidak lazim (.xyz, .top, .tk, .cc).",
            "Jangan pernah mengetikkan kata sandi di web yang alamatnya mencurigakan.",
          ],
          tamiWhisper:
            "Satu huruf yang melenceng adalah tanda bahaya besar. Selalu teliti membaca alamat web!",
        },
        {
          id: "submod-2-3",
          title: "Tombol Tiruan & Langkah Verifikasi Mandiri",
          badge: "Aksi Tanggap",
          storyHook:
            "Banyak jebakan bersembunyi di balik tombol besar berwarna hijau terang bertuliskan 'DOWNLOAD SEKARANG' atau formulir login palsu di aplikasi chat.",
          content: [
            "Jangan pernah mengklik tautan verifikasi dari pesan chat pribadi yang tidak jelas sumbernya.",
            "Lakukan 'Verifikasi Independen': Buka aplikasi resmi atau web resmi secara manual lewat browser, bukan lewat link di chat.",
            "Jika ada yang mengaku teman atau guru meminjam uang atau minta password lewat nomor baru, telepon nomor lamanya untuk konfirmasi.",
          ],
          actionSteps: [
            "Arahkan kursor tanpa mengklik (hover) untuk mengintip alamat tautan sebenarnya.",
            "Konfirmasi ke orang tua atau guru jika menerima pesan aneh dari kontak sekolah.",
            "Laporkan dan blokir nomor penipu agar tidak menjerat orang lain.",
          ],
          tamiWhisper:
            "Verifikasi mandiri adalah tameng paling ampuh. Jangan biarkan orang asing mengarahkan klikmu!",
        },
      ],
      quizzes: [
        {
          id: "q2-1",
          question: "Manakah di antara alamat web berikut yang merupakan situs resmi Roblox?",
          options: {
            A: "https://roblox-rewards.free-skin.top/login",
            B: "https://www.roblox.com",
            C: "https://robllox-secure.xyz",
            D: "http://free-robux-promo.net",
          },
          correct_option: "B",
          explanation: "Domain resmi Roblox adalah roblox.com tanpa tambahan embel-embel kata lain atau domain asing.",
          justifications: {
            A: "Jebakan phishing! Domain utamanya adalah free-skin.top, bukan roblox.com.",
            B: "Tepat sekali! Ini adalah domain resmi resmi Roblox dengan protokol aman HTTPS.",
            C: "Typosquatting! Huruf 'l' ada dua (robllox) dan memakai domain .xyz.",
            D: "Jebakan palsu! Menggunakan HTTP tidak aman dan memancing dengan embel-embel robux gratis.",
          },
        },
        {
          id: "q2-2",
          question: "Apa tujuan utama penipu menyertakan desakan waktu seperti 'Klaim dalam 5 menit sebelum hangus'?",
          options: {
            A: "Agar kuota internet pengguna lebih hemat",
            B: "Supaya korban panik dan buru-buru mengklik tanpa berpikir kritis",
            C: "Karena server game memang punya batas waktu 5 menit",
            D: "Agar baterai ponsel tidak cepat habis",
          },
          correct_option: "B",
          explanation: "Menciptakan rasa panik adalah trik manipulasi psikologis agar korban mengabaikan tanda-tanda bahaya.",
          justifications: {
            A: "Keliru, tidak ada kaitannya dengan kuota.",
            B: "Benar! Penipu takut jika kamu punya waktu berpikir, kamu akan menyadari kebohongan mereka.",
            C: "Keliru, platform resmi tidak membagikan hadiah gratis secara terburu-buru lewat chat.",
            D: "Keliru, sama sekali tidak berhubungan dengan baterai.",
          },
        },
        {
          id: "q2-3",
          question: "Kamu mendapat pesan dari nomor tak dikenal yang mengaku wali kelasmu meminta password ujian. Apa langkah teraman?",
          options: {
            A: "Langsung kirim password karena takut nilai rapor jadi 0",
            B: "Marahi nomor tersebut dan kirim kata kasar",
            C: "Konfirmasi langsung ke nomor guru yang tersimpan di grup kelas resmi atau temui besok di sekolah",
            D: "Kirim password akun temanmu saja",
          },
          correct_option: "C",
          explanation: "Verifikasi independen ke kontak resmi yang sudah terbukti valid adalah langkah paling bijak.",
          justifications: {
            A: "Sangat berbahaya! Penipu mencatut nama guru untuk memanfaatkan kepatuhan siswa.",
            B: "Kurang bijak, cukup blokir dan laporkan.",
            C: "Luar biasa! Selalu verifikasi ke sumber resmi yang kamu percaya.",
            D: "Sangat keliru dan merugikan teman.",
          },
        },
        {
          id: "q2-4",
          question: "Apa yang dimaksud dengan teknik 'Hover' sebelum mengklik tautan di komputer?",
          options: {
            A: "Mengeklik tombol berulang kali dengan cepat",
            B: "Mengarahkan kursor ke tautan tanpa mengkliknya untuk melihat alamat web tujuan di sudut layar",
            C: "Mematikan layar monitor sejenak",
            D: "Menghapus riwayat pencarian peramban",
          },
          correct_option: "B",
          explanation: "Mengambangkan kursor di atas tautan akan menampilkan pratinjau URL asli di pojok bawah peramban.",
          justifications: {
            A: "Keliru, itu klik ganda.",
            B: "Tepat sekali! Ini trik detektif paling mudah untuk mengecek apakah tautan asli atau jebakan.",
            C: "Keliru, tidak ada fungsinya.",
            D: "Keliru, itu riwayat browser.",
          },
        },
        {
          id: "q2-5",
          question: "Jika kamu tidak sengaja mengklik link mencurigakan dan mengisi kata sandi, apa tindakan darurat pertamamu?",
          options: {
            A: "Diam saja dan berharap tidak terjadi apa-apa",
            B: "Segera ganti kata sandi akunmu dari situs resmi dan beritahu orang tua/guru!",
            C: "Hapus aplikasi peramban dari laptop",
            D: "Matikan lampu kamar",
          },
          correct_option: "B",
          explanation: "Bertindak cepat mengganti kata sandi dapat memutus akses peretas sebelum mereka sempat mengambil alih akunmu.",
          justifications: {
            A: "Sangat berisiko, akunmu bisa hilang selamanya.",
            B: "Cerdas dan tanggap! Gerak cepat mengganti sandi resmi menyelamatkan akunmu.",
            C: "Menghapus peramban tidak mengubah fakta bahwa sandimu sudah bocor di server peretas.",
            D: "Tidak ada pengaruhnya dengan keamanan digital.",
          },
        },
      ],
    },
    {
      id: "data-privacy",
      slug: "data-privacy",
      legacyId: "module3",
      title: "Privasi Jejak Digital & Data Pribadi",
      category: "Privasi & Identitas Digital",
      description: "Pahami apa saja yang boleh dan tidak boleh kamu pamerkan di internet agar dirimu dan keluargamu selalu aman!",
      estimatedMinutes: 7,
      iconName: "EyeSlash",
      colorClass: "text-[var(--color-tami-green)]",
      bgClass: "bg-[var(--color-tami-green)]/15",
      submodules: [
        {
          id: "submod-3-1",
          title: "Jejak Kaki Digital yang Abadi di Internet",
          badge: "Fakta Dunia Maya",
          storyHook:
            "Setiap foto yang kamu unggah, komentar yang kamu tulis, dan video yang kamu bagikan seperti langkah kaki di semen basah: sekali menempel, akan membekas selamanya!",
          content: [
            "Meskipun kamu sudah menekan tombol 'Delete', orang lain bisa saja sudah mengambil tangkapan layar (screenshot) atau menyimpannya di server arsip.",
            "Jejak digitalmu hari ini bisa dilihat oleh calon sekolah, teman masa depan, atau orang asing bertahun-tahun kemudian.",
            "Berpikirlah sebelum membagikan sesuatu: 'Apakah aku nyaman jika guru atau orang tuaku melihat ini?'",
          ],
          actionSteps: [
            "Terapkan aturan 'Ujian Nenek': Jika kamu malu jika nenekmu melihatnya, jangan unggah!",
            "Jangan pernah mengunggah foto saat sedang marah atau terbawa emosi.",
            "Periksa jejak digitalmu secara berkala dan bersihkan postingan lama yang tidak pantas.",
          ],
          tamiWhisper:
            "Internet tidak pernah tidur dan jarang lupa. Jaga jejak digitalmu sebersih mungkin!",
        },
        {
          id: "submod-3-2",
          title: "Memilah Data Rahasia vs Boleh Dibagikan",
          badge: "Klasifikasi Aman",
          storyHook:
            "Orang jahat di internet tidak butuh kunci rumahmu untuk mengincarmu. Mereka hanya butuh potongan-potongan informasi kecil yang kamu sebar tanpa sadar!",
          content: [
            "Data Sangat Rahasia (DILARANG DISEBAR): Alamat rumah, nomor telepon pribadi, foto seragam yang ada badge sekolah, nama ibu kandung, dan tiket pesawat/konser.",
            "Data Boleh Dibagikan (Aman): Hobi menggambar, hewan kesukaan, kreasi karya seni tanpa wajah/lokasi, atau skor game tanpa username login.",
            "Bahkan foto selfie di depan rumah bisa menunjukkan nomor rumah dan nama jalanmu!",
          ],
          actionSteps: [
            "Buramkan (blur) nama sekolah, nomor plat kendaraan, atau alamat pada foto sebelum diunggah.",
            "Jangan pernah foto tiket penerbangan atau kartu identitas karena memuat barcode rahasia.",
            "Gunakan nama samaran (nickname) keren di game online alih-alih nama lengkap aslimu.",
          ],
          tamiWhisper:
            "Privasimu adalah harta paling berharga. Simpan informasi penting rapat-rapat!",
        },
        {
          id: "submod-3-3",
          title: "Izin Aplikasi & Kuis Kepribadian Jebakan",
          badge: "Radar Izin",
          storyHook:
            "'Cari tahu wajahmu saat tua!' atau 'Kuis: Karakter anime manakah kamu?' Sering melihat kuis seru ini di media sosial? Hati-hati, ada udang di balik batu!",
          content: [
            "Banyak kuis atau game gratis meminta izin akses kamera, kontak teman, dan lokasi GPS secara diam-diam.",
            "Data kontak dan lokasi yang terkumpul sering kali dijual ke pihak ketiga atau perusahaan iklan.",
            "Aplikasi senter atau kalkulator sederhana sama sekali tidak membutuhkan izin akses kontak atau lokasi HP-mu!",
          ],
          actionSteps: [
            "Selalu tolak izin yang tidak masuk akal (misal: game catur meminta izin mikrofon dan kontak).",
            "Atur akun media sosial menjadi 'Private' (Hanya Teman), bukan 'Public'.",
            "Minta izin orang tua sebelum mengunduh aplikasi baru di HP atau tablet.",
          ],
          tamiWhisper:
            "Jangan tukar data pribadimu hanya demi kuis receh. Jadilah pengguna yang cerdas memilih izin!",
        },
      ],
      quizzes: [
        {
          id: "q3-1",
          question: "Manakah informasi berikut yang PALING BERBAHAYA jika kamu unggah ke media sosial publik?",
          options: {
            A: "Foto makanan bekal makan siang di piring",
            B: "Foto tiket pesawat yang memperlihatkan barcode dan nama lengkap",
            C: "Gambar pemandangan matahari terbenam di pantai",
            D: "Daftar buku komik kesukaanmu",
          },
          correct_option: "B",
          explanation: "Barcode tiket pesawat memuat data paspor, kode booking penerbangan, dan data pribadi yang bisa disalahgunakan penjahat siber.",
          justifications: {
            A: "Aman dibagikan selama tidak memuat identitas sensitif.",
            B: "Sangat berbahaya! Barcode tiket menyimpan data rahasia penumpang yang mudah dipindai siapapun.",
            C: "Aman dibagikan.",
            D: "Aman, berbagi hobi positif tanpa risiko privasi.",
          },
        },
        {
          id: "q3-2",
          question: "Apa arti konsep 'Jejak Digital Tidak Bisa Dihapus Sepenuhnya'?",
          options: {
            A: "Komputer memiliki tinta permanen di layarnya",
            B: "Foto atau postingan yang sudah dihapus bisa saja sudah disimpan atau di-screenshot orang lain",
            C: "Internet akan mati jika kita menghapus file",
            D: "Semua data di internet tersimpan di satelit luar angkasa",
          },
          correct_option: "B",
          explanation: "Begitu data dikirim ke internet, kita kehilangan kendali atas siapa saja yang telah mengunduh atau menyalinnya.",
          justifications: {
            A: "Keliru, layar tidak memakai tinta cair.",
            B: "Tepat sekali! Tombol delete di akunmu tidak menghapus salinan di HP orang lain.",
            C: "Keliru dan tidak masuk akal.",
            D: "Keliru, internet menggunakan server jaringan bumi.",
          },
        },
        {
          id: "q3-3",
          question: "Sebuah aplikasi game mewarnai sederhana meminta izin mengakses buku kontak telepon dan lokasi GPS. Apa tindakan terbaikmu?",
          options: {
            A: "Izinkan saja semuanya agar bisa langsung main",
            B: "Tolak izin tersebut karena game mewarnai tidak butuh kontak telepon dan lokasi!",
            C: "Berikan nomor telepon teman sekolahmu",
            D: "Beli HP baru",
          },
          correct_option: "B",
          explanation: "Tolak izin yang tidak relevan dengan fungsi utama aplikasi untuk mencegah pencurian data pribadi.",
          justifications: {
            A: "Berbahaya, kontak keluargamu bisa disedot dan dijadikan target spam penipuan.",
            B: "Sangat cerdas! Terapkan prinsip izin minimal untuk menjaga keamanan HP.",
            C: "Sangat dilarang membagikan data orang lain tanpa izin.",
            D: "Tidak perlu ganti HP.",
          },
        },
        {
          id: "q3-4",
          question: "Mengapa sebaiknya akun media sosial anak disetel ke mode 'Privat' (Private Account)?",
          options: {
            A: "Agar ponsel tidak cepat panas",
            B: "Agar hanya teman yang kita kenal dan setujui yang bisa melihat foto dan postingan kita",
            C: "Supaya game kita tidak lag",
            D: "Agar kuota internet bertambah dua kali lipat",
          },
          correct_option: "B",
          explanation: "Mode privat membatasi interaksi hanya kepada lingkaran pertemanan nyata yang telah diverifikasi orang tua dan siswa.",
          justifications: {
            A: "Suhu ponsel tidak dipengaruhi status privasi akun.",
            B: "Benar! Menjauhkan intaian orang asing yang berniat jahat.",
            C: "Privasi akun media sosial tidak ada hubungannya dengan lag game.",
            D: "Tidak menambah kuota.",
          },
        },
        {
          id: "q3-5",
          question: "Saat berfoto dengan seragam sekolah untuk media sosial, apa yang sebaiknya kamu lakukan?",
          options: {
            A: "Pastikan nama sekolah dan logo badge terlihat sejelas mungkin",
            B: "Tulis alamat sekolah di caption foto",
            C: "Tutupi atau buramkan (blur) nama sekolah dan badge seragam demi keselamatan",
            D: "Tag lokasi sekolah di peta",
          },
          correct_option: "C",
          explanation: "Menyembunyikan identitas sekolah mencegah orang asing yang tidak bertanggung jawab melacak jadwal dan keberadaanmu.",
          justifications: {
            A: "Berbahaya, mempermudah penguntit mengetahui lokasi belajarmu sehari-hari.",
            B: "Sangat berisiko bagi keselamatan fisik.",
            C: "Tepat sekali! Selalu lindungi lokasi rutinitas fisikmu dari mata publik.",
            D: "Hindari menandai lokasi real-time.",
          },
        },
      ],
    },
    {
      id: "cyber-ethics",
      slug: "cyber-ethics",
      legacyId: "module4",
      title: "Etika Siber & Berani Lapor",
      category: "Kebaikan Digital & Perlindungan",
      description: "Jadilah pahlawan siber yang menyebarkan kebaikan dan berani bertindak saat melihat ketidakadilan online!",
      estimatedMinutes: 7,
      iconName: "ChatCircleDots",
      colorClass: "text-[var(--color-tami-violet)]",
      bgClass: "bg-[var(--color-tami-violet)]/15",
      submodules: [
        {
          id: "submod-4-1",
          title: "Kata-Kata di Balik Layar",
          badge: "Kebaikan Siber",
          storyHook:
            "Di balik setiap avatar game dan akun media sosial, ada manusia sungguhan yang punya hati dan perasaan sama sepertimu. Mengetik kata kasar di keyboard sama sakitnya dengan ucapan di dunia nyata!",
          content: [
            "Banyak orang merasa berani mengejek atau berkata kasar karena merasa tidak terlihat (anonim). Ini disebut 'Perundungan Siber' (Cyberbullying).",
            "Komentar negatif bisa merusak rasa percaya diri teman dan membuat mereka takut untuk bersekolah.",
            "Gunakan kekuatan kata-katamu untuk menyemangati, bukan menjatuhkan.",
          ],
          actionSteps: [
            "Pikirkan perasaan orang lain sebelum mengirim pesan atau komentar.",
            "Jangan pernah ikut-ikutan menertawakan teman di kolom komentar grup.",
            "Jadilah penyebar pujian positif saat teman membagikan karyanya.",
          ],
          tamiWhisper:
            "Pahlawan sejati tidak menjatuhkan orang lain. Gunakan jarimu untuk mengetik kebaikan!",
        },
        {
          id: "submod-4-2",
          title: "Berani Bicara: Menjadi Pelindung (Upstander)",
          badge: "Jiwa Ksatria",
          storyHook:
            "Saat melihat temanmu dirundung di game online atau grup obrolan, diam saja bukanlah pilihan netral. Diam berarti membiarkan si perundung merasa tindakannya benar!",
          content: [
            "Ada dua peran di dunia maya: Bystander (penonton pasif yang diam saja) dan Upstander (ksatria yang berani membela teman).",
            "Kamu tidak perlu membalas dengan amarah atau kekerasan. Cukup katakan: 'Hentikan, itu tidak keren!', lalu alihkan percakapan ke hal positif.",
            "Kirim pesan pribadi (DM) ke teman yang dirundung untuk memberinya semangat agar dia tidak merasa sendirian.",
          ],
          actionSteps: [
            "Tegur tindakan perundungan secara tenang dan sopan tanpa ikut menghina.",
            "Ajak teman yang diserang untuk keluar dari ruang obrolan game tersebut.",
            "Kirim pesan dukungan hangat kepada temanmu.",
          ],
          tamiWhisper:
            "Satu kalimat dukunganmu bisa menjadi penyelamat besar bagi hati teman yang terluka.",
        },
        {
          id: "submod-4-3",
          title: "Simpan Bukti (Screenshot) & Berani Lapor",
          badge: "Tindakan Nyata",
          storyHook:
            "Jika kamu atau temanmu menerima ancaman, pelecehan, atau pesan yang membuatmu tidak nyaman, jangan takut dan jangan dipendam sendiri!",
          content: [
            "Langkah 1: Jangan balas pesan jahat tersebut agar pelaku tidak semakin senang memancing emosimu.",
            "Langkah 2: Ambil Tangkapan Layar (Screenshot) seluruh isi obrolan, tanggal, dan nama akun pelaku sebagai bukti kuat.",
            "Langkah 3: Segera ceritakan kepada orang dewasa yang kamu percaya: orang tua, guru BK, atau wali kelas.",
          ],
          actionSteps: [
            "Ambil screenshot bukti sebelum pelaku sempat menghapus pesannya.",
            "Gunakan fitur 'Report / Laporkan' dan 'Block / Blokir' di aplikasi media sosial atau game.",
            "Bicarakan secara jujur kepada orang tua: melapor bukanlah mengadu, melainkan melindungi!",
          ],
          tamiWhisper:
            "Kamu tidak sendirian. Orang dewasa yang menyayangimu selalu siap membantu dan melindungimu!",
        },
      ],
      quizzes: [
        {
          id: "q4-1",
          question: "Apa perbedaan antara 'Bystander' dan 'Upstander' saat terjadi perundungan online?",
          options: {
            A: "Bystander adalah pemain pro, Upstander adalah pemain pemula",
            B: "Bystander hanya diam menonton, sedangkan Upstander berani membela dan membantu korban secara aman",
            C: "Bystander yang memulai perundungan, Upstander yang merekam video",
            D: "Keduanya sama-sama tidak peduli dengan orang lain",
          },
          correct_option: "B",
          explanation: "Upstander adalah ksatria siber yang peduli dan berani mengambil tindakan positif untuk menghentikan perundungan.",
          justifications: {
            A: "Keliru, tidak ada kaitannya dengan tingkat kemahiran game.",
            B: "Tepat sekali! Menjadi Upstander membuktikan integritas dan empati digitalmu.",
            C: "Keliru, yang memulai adalah pelaku (bully).",
            D: "Keliru, Upstander sangat peduli terhadap sesama.",
          },
        },
        {
          id: "q4-2",
          question: "Jika seseorang terus mengirim pesan ancaman kepadamu di game online, apa langkah pertama yang paling benar?",
          options: {
            A: "Balas dengan makian yang lebih kasar agar mereka takut",
            B: "Ajak mereka bertemu di dunia nyata untuk berkelahi",
            C: "Ambil screenshot bukti, jangan balas, blokir akunnya, dan laporkan ke orang tua/guru!",
            D: "Hapus akun game-mu dan menangis sendirian di kamar",
          },
          correct_option: "C",
          explanation: "Jangan terpancing emosi. Simpan bukti fisik berupa tangkapan layar dan minta bantuan orang dewasa terpercaya.",
          justifications: {
            A: "Sangat keliru! Membalas kasar justru membuat situasi semakin memburuk.",
            B: "Sangat berbahaya bagi keselamatan fisikmu!",
            C: "Langkah sempurna! Lindungi dirimu dengan bukti kuat dan dukungan orang dewasa.",
            D: "Kamu tidak boleh merasa bersalah atas perbuatan jahat orang lain.",
          },
        },
        {
          id: "q4-3",
          question: "Mengapa penting mengambil screenshot (tangkapan layar) saat mengalami perundungan siber?",
          options: {
            A: "Untuk dipajang sebagai status WhatsApp agar semua orang tahu",
            B: "Sebagai bukti otentik yang tidak bisa disangkal saat melapor kepada pihak sekolah atau orang tua",
            C: "Agar memori ponsel cepat penuh",
            D: "Untuk dijual ke internet",
          },
          correct_option: "B",
          explanation: "Screenshot adalah bukti tak terbantahkan jika pelaku mencoba menghapus pesan atau berpura-pura tidak melakukannya.",
          justifications: {
            A: "Sebaiknya jangan disebar ke publik tanpa arahan orang tua/guru.",
            B: "Tepat sekali! Bukti visual mempermudah orang dewasa menindak tegas pelaku.",
            C: "Keliru dan tidak masuk akal.",
            D: "Tidak bernilai jual dan melanggar privasi.",
          },
        },
        {
          id: "q4-4",
          question: "Teman sekelasmu sedang diejek di grup chat karena fotonya diedit menjadi meme yang memalukan. Apa tindakan terbaikmu?",
          options: {
            A: "Ikut membagikan meme tersebut ke grup lain agar terlihat lucu",
            B: "Kirim pesan penyemangat ke temanmu dan tegur teman-teman di grup bahwa hal itu menyakitkan",
            C: "Hanya tertawa dalam hati tanpa menulis apa-apa",
            D: "Pura-pura tidak melihat pesan grup",
          },
          correct_option: "B",
          explanation: "Empati aktif menghibur teman yang terluka dan berani mengingatkan teman lain adalah ciri anak yang berkarakter kuat.",
          justifications: {
            A: "Sangat jahat! Kamu menjadi bagian dari pelaku perundungan.",
            B: "Hebat! Kamu adalah teladan kebaikan siber yang membawa rasa aman bagi teman.",
            C: "Sikap pasif membiarkan keburukan berlanjut.",
            D: "Kurang berempati terhadap teman yang membutuhkan pertolongan.",
          },
        },
        {
          id: "q4-5",
          question: "Apakah menceritakan masalah perundungan siber kepada orang tua atau guru dianggap sebagai tindakan 'mengadu' yang memalukan?",
          options: {
            A: "Ya, anak keren harus menyelesaikan semua masalahnya sendiri",
            B: "Tidak sama sekali! Melapor adalah tindakan berani untuk melindungi diri sendiri dan menciptakan lingkungan yang aman bagi semua",
            C: "Tergantung apakah ada hadiahnya",
            D: "Ya, teman-teman akan menjauhimu jika kamu melapor",
          },
          correct_option: "B",
          explanation: "Meminta pertolongan orang dewasa adalah hak setiap anak dan tindakan paling cerdas saat menghadapi ancaman.",
          justifications: {
            A: "Mitos yang salah! Tidak semua masalah siber bisa dihadapi sendirian oleh anak.",
            B: "Benar sekali! Keberanian melapor menyelamatkan dirimu dan orang lain dari bahaya.",
            C: "Keselamatan adalah hadiah utamanya.",
            D: "Teman sejati akan menghargai kejujuran dan keberanianmu.",
          },
        },
      ],
    },
  ],
  en: [
    {
      id: "password-security",
      slug: "password-security",
      legacyId: "module1",
      title: "Strong Passwords & Key Vault",
      category: "Cryptography & Defense",
      description: "Master the art of creating passwords you can easily remember, but hacker bots can never crack!",
      estimatedMinutes: 7,
      iconName: "Key",
      colorClass: "text-[var(--color-tami-yellow)]",
      bgClass: "bg-[var(--color-tami-yellow)]/15",
      submodules: [
        {
          id: "submod-1-1",
          title: "Why Hackers Easily Guess Passwords",
          badge: "Password Mystery",
          storyHook:
            "Imagine having a secret safe, but leaving the key right under the doormat labeled '123456'. Computer hackers don't guess one by one with their fingers—they use automated cracking robots that test billions of combinations every single second!",
          content: [
            "Many people use pet names, birthdays, or the word 'password'. These patterns are the first things cracking software checks.",
            "The shorter your password is, the fewer combinations bots have to try. A 6-letter password can be cracked in the blink of an eye!",
            "The real secret to password strength lies in length and unpredictable sentence patterns.",
          ],
          actionSteps: [
            "Avoid using birthdays, school names, or game usernames as passwords.",
            "Never use keyboard rows like 'qwerty' or '12345678'.",
            "Aim for at least 12 characters for your important accounts.",
          ],
          tamiWhisper:
            "Remember friend: Hackers love predictable targets! Stump them with unique, unexpected passwords!",
        },
        {
          id: "submod-1-2",
          title: "tami's 3-Word Passphrase Trick",
          badge: "Super Formula",
          storyHook:
            "Who says strong passwords must look like impossible gibberish such as 'x$K9#mQ2' that even you forget? Tami has a magic trick: The Secret Sentence Method (Passphrase)!",
          content: [
            "Pick 3 or 4 random, unrelated nouns and weave them into a funny mini-story only you know.",
            "Example: 'FlyingCatEatsDonuts99!' or 'RocketShoeDrinksJuice#'.",
            "Cracking bots will take hundreds of years to brute-force a combination this long, yet your brain can picture it effortlessly!",
          ],
          actionSteps: [
            "Pick 3 funny or bizarre words that stick in your mind.",
            "Insert a favorite number and symbol between the words.",
            "Use a distinct passphrase for each game or social account.",
          ],
          tamiWhisper:
            "A long, memorable story-phrase is infinitely mightier than a short, complex puzzle you can't recall!",
        },
        {
          id: "submod-1-3",
          title: "Double Lock: Two-Factor Authentication (2FA)",
          badge: "Ultimate Shield",
          storyHook:
            "What if someone sneaks a peek while you type your password? Don't panic—there's a superhero shield called Two-Factor Authentication (2FA)!",
          content: [
            "2FA works like a house with two locks: the first key is your password, and the second key is a dynamic code sent straight to your parent's phone.",
            "Even if a thief steals your password, they are locked out at the second gate.",
            "Nearly all modern gaming platforms (Roblox, Steam, Google) provide 2FA for free.",
          ],
          actionSteps: [
            "Ask your parents to help turn on 2FA on your gaming accounts and email.",
            "Never share 2FA SMS/OTP codes with anyone—even someone claiming to be an admin!",
            "Keep emergency backup recovery codes in a secure notebook.",
          ],
          tamiWhisper:
            "2FA is your account's loyal guardian. Once active, cyber thieves hit a brick wall!",
        },
      ],
      quizzes: [
        {
          id: "q1-1",
          question: "Which of the following is the strongest and safest password?",
          options: {
            A: "Alex2012!",
            B: "FlyingElephantEatsDonuts#99",
            C: "qwertyuiop123",
            D: "secretpassword",
          },
          correct_option: "B",
          explanation: "A 4-word random passphrase with numbers and symbols is lengthy and computationally infeasible to crack!",
          justifications: {
            A: "Weak: incorporates a common name and birth year easily found online.",
            B: "Perfect! Long, vivid, random passphrase combining words, numbers, and symbols.",
            C: "Very weak: a standard keyboard row cracked in milliseconds.",
            D: "Extremely dangerous: 'password' is a hacker's #1 dictionary attempt.",
          },
        },
        {
          id: "q1-2",
          question: "Why is using your birthday as a password so risky?",
          options: {
            A: "Because birth dates are easily discovered on social media or school cards",
            B: "Because computers dislike calendar dates",
            C: "Because birthdays slow down your computer",
            D: "Because cracking robots cannot calculate numbers",
          },
          correct_option: "A",
          explanation: "Public personal data like birth dates are prime targets for automated credential guessing.",
          justifications: {
            A: "Spot on! Publicly available personal info is the easiest target for social engineering.",
            B: "Incorrect, computers process dates instantly.",
            C: "Incorrect, numbers don't impact system speed.",
            D: "Incorrect, cracking tools excel at brute-forcing numeric patterns.",
          },
        },
        {
          id: "q1-3",
          question: "What is the primary purpose of Two-Factor Authentication (2FA)?",
          options: {
            A: "Speeding up your internet connection while gaming",
            B: "Providing a second defensive security layer if your main password leaks",
            C: "Deleting inactive accounts automatically",
            D: "Eliminating the need to remember passwords",
          },
          correct_option: "B",
          explanation: "2FA ensures only the genuine owner can enter using a secondary one-time code sent to a verified device.",
          justifications: {
            A: "Incorrect: 2FA is an account security mechanism, not a network booster.",
            B: "Correct! Even if your password is stolen, intruders are blocked at the second gate.",
            C: "Incorrect: 2FA does not delete accounts.",
            D: "Incorrect: your primary password is still required and must be guarded.",
          },
        },
        {
          id: "q1-4",
          question: "If someone claiming to be a game admin asks for an OTP code texted to your phone, what should you do?",
          options: {
            A: "Send the code quickly so your account won't get banned",
            B: "Refuse firmly and keep it secret—genuine admins NEVER request OTP codes!",
            C: "Ask for free diamonds first before giving the code",
            D: "Send only half of the digits",
          },
          correct_option: "B",
          explanation: "OTP codes are your personal vault keys. Legitimate game administrators will never ask for them via chat!",
          justifications: {
            A: "Extremely dangerous! This is an account-hijacking trick.",
            B: "Awesome! You know the golden rule of cybersecurity: OTP is 100% private.",
            C: "Incorrect: they are scammers and will steal your account immediately.",
            D: "Incorrect: OTP codes must never be shared under any circumstances.",
          },
        },
        {
          id: "q1-5",
          question: "Is it safe to reuse the exact same password for school, gaming, and social media accounts?",
          options: {
            A: "Very safe and convenient so you don't forget",
            B: "Acceptable as long as the password is long",
            C: "Unsafe: if one site gets breached, all your other accounts are compromised!",
            D: "Safe if you only game on weekends",
          },
          correct_option: "C",
          explanation: "One vault, one unique key. Never keep all your digital treasures in a single basket.",
          justifications: {
            A: "High risk: convenience shouldn't compromise your safety.",
            B: "Even if long, a leak at one website allows hackers to credential-stuff your other accounts.",
            C: "Exactly right! Hackers routinely test leaked passwords across other popular platforms.",
            D: "Gaming schedule has zero effect on credential security.",
          },
        },
      ],
    },
    {
      id: "phishing-detection",
      slug: "phishing-detection",
      legacyId: "module2",
      title: "Phishing Detection & Link Traps",
      category: "Link Forensics & Social Engineering",
      description: "Become a savvy digital detective capable of sniffing out fake links and sneaky prize traps!",
      estimatedMinutes: 7,
      iconName: "ShieldWarning",
      colorClass: "text-[var(--color-tami-red)]",
      bgClass: "bg-[var(--color-tami-red)]/15",
      submodules: [
        {
          id: "submod-2-1",
          title: "Free Game Baits & Panic Warnings",
          badge: "Trap Tactics",
          storyHook:
            "'Congratulations! You won an exclusive Golden Dragon Skin worth $300! Click here within 5 minutes before your reward expires!' Received a message like this? That's a classic phishing lure!",
          content: [
            "The term 'Phishing' comes from fishing: attackers cast flashy bait or fake panic messages hoping you'll bite their hook without thinking.",
            "Hallmarks of lures: Unbelievable free prizes, or panic threats like 'Your account will be terminated in 10 minutes!'.",
            "When our emotions are triggered, we often forget to verify whether the sender is real.",
          ],
          actionSteps: [
            "If an offer sounds too good to be true, it's 99% a scam.",
            "Take a deep breath whenever a message creates artificial rush.",
            "Ask yourself: 'Did I ever actually enter this contest?'",
          ],
          tamiWhisper:
            "Scammers love targeting greed and panic. Stay calm and inspect with detective eyes!",
        },
        {
          id: "submod-2-2",
          title: "Detective Eyes: Spotting Fake vs Real Domain Names",
          badge: "Eagle Vision",
          storyHook:
            "Scammers can build fake websites that look 100% identical to Roblox or Google. But there's one thing they can never fake: the official registered domain name!",
          content: [
            "Watch out for 'Typosquatting'—mimicking genuine domains by tweaking or adding subtle letters.",
            "Examples: 'robllox-free.top' instead of 'roblox.com', or 'steancommunnity.co.xyz' instead of 'steamcommunity.com'.",
            "Always inspect the domain name directly before the first forward slash.",
          ],
          actionSteps: [
            "Check every single letter in your browser address bar carefully.",
            "Be wary of strange domain extensions (.xyz, .top, .tk, .cc).",
            "Never type your credentials on web pages with suspicious URLs.",
          ],
          tamiWhisper:
            "A single misspelled letter is an immediate red flag. Always read web addresses thoroughly!",
        },
        {
          id: "submod-2-3",
          title: "Decoy Buttons & Independent Verification",
          badge: "Direct Action",
          storyHook:
            "Many online traps hide behind flashy green 'DOWNLOAD NOW' buttons or fake login dialogs forwarded in private chat apps.",
          content: [
            "Never click verification or login links from unsolicited private chat messages.",
            "Practice 'Independent Verification': Open the official app or website manually in your browser instead of clicking forwarded links.",
            "If someone claiming to be a friend or teacher asks for urgent help from a strange new number, verify via their known contact.",
          ],
          actionSteps: [
            "Hover your cursor over links to preview their true destination before clicking.",
            "Consult with your parents or teachers if you receive strange school alerts.",
            "Report and block fraudulent contacts to protect other students.",
          ],
          tamiWhisper:
            "Independent verification is your ultimate shield. Never let strangers dictate where you click!",
        },
      ],
      quizzes: [
        {
          id: "q2-1",
          question: "Which of the following web addresses is the genuine official Roblox website?",
          options: {
            A: "https://roblox-rewards.free-skin.top/login",
            B: "https://www.roblox.com",
            C: "https://robllox-secure.xyz",
            D: "http://free-robux-promo.net",
          },
          correct_option: "B",
          explanation: "The official Roblox domain is roblox.com without extra decoy keywords or suspicious extensions.",
          justifications: {
            A: "Phishing lure! The actual root domain is free-skin.top.",
            B: "Correct! This is the genuine Roblox domain secured with HTTPS.",
            C: "Typosquatting: doubled 'l' (robllox) using a .xyz extension.",
            D: "Fraudulent bait using unencrypted HTTP and robux lures.",
          },
        },
        {
          id: "q2-2",
          question: "Why do scammers constantly impose tight timers like 'Claim within 5 minutes or lose forever'?",
          options: {
            A: "To save the user's mobile data bandwidth",
            B: "To induce panic so victims click without critical thinking",
            C: "Because game servers officially limit rewards to 5 minutes",
            D: "To prevent phone batteries from draining",
          },
          correct_option: "B",
          explanation: "Creating artificial urgency is a psychological exploit designed to bypass rational skepticism.",
          justifications: {
            A: "Incorrect: unrelated to data plans.",
            B: "Spot on! Scammers fear that if you take time to think, you'll uncover their fraud.",
            C: "Incorrect: legitimate platforms do not rush rewards via private messages.",
            D: "Incorrect: zero relevance to hardware.",
          },
        },
        {
          id: "q2-3",
          question: "You receive an urgent message from an unknown number claiming to be your teacher asking for your portal password. What is the safest response?",
          options: {
            A: "Send the password right away out of fear your grade will drop",
            B: "Send angry insults back to the number",
            C: "Verify directly with your teacher's number saved in the official class group or ask them tomorrow at school",
            D: "Send your friend's password instead",
          },
          correct_option: "C",
          explanation: "Verifying independently against a known, trusted contact is the safest defense against impersonation.",
          justifications: {
            A: "High danger! Scammers impersonate authority figures to exploit student obedience.",
            B: "Unhelpful: simply block and report the contact.",
            C: "Brilliant! Always confirm through trusted, official channels.",
            D: "Completely wrong and harmful to your friend.",
          },
        },
        {
          id: "q2-4",
          question: "What does 'hovering' over a link on a computer mean?",
          options: {
            A: "Rapidly clicking a link multiple times",
            B: "Moving your cursor over a link without clicking to preview the real destination URL in the corner",
            C: "Turning off your computer monitor briefly",
            D: "Clearing your web browser history",
          },
          correct_option: "B",
          explanation: "Hovering allows you to inspect the true hyperlinked URL preview displayed at the bottom corner of your browser.",
          justifications: {
            A: "Incorrect: that is double-clicking.",
            B: "Exactly right! This detective skill lets you verify where a link really points before you click.",
            C: "Incorrect: has zero effect.",
            D: "Incorrect: that is browsing history.",
          },
        },
        {
          id: "q2-5",
          question: "If you accidentally clicked a suspicious link and typed your password, what is your emergency first step?",
          options: {
            A: "Stay quiet and hope nothing bad happens",
            B: "Immediately change your password from the official website and inform your parents or teacher!",
            C: "Uninstall the web browser from your computer",
            D: "Turn off your bedroom lights",
          },
          correct_option: "B",
          explanation: "Acting promptly to change your password locks out intruders before they can seize your account.",
          justifications: {
            A: "Very risky: your account could be lost permanently.",
            B: "Smart and decisive! Rapidly changing your official password rescues your account.",
            C: "Deleting the browser doesn't revoke the credentials already sent to the attacker.",
            D: "Zero effect on cybersecurity.",
          },
        },
      ],
    },
    {
      id: "data-privacy",
      slug: "data-privacy",
      legacyId: "module3",
      title: "Digital Footprints & Privacy",
      category: "Privacy & Identity Protection",
      description: "Understand what is safe to share and what must stay private so you and your family stay secure online!",
      estimatedMinutes: 7,
      iconName: "EyeSlash",
      colorClass: "text-[var(--color-tami-green)]",
      bgClass: "bg-[var(--color-tami-green)]/15",
      submodules: [
        {
          id: "submod-3-1",
          title: "Digital Footprints Last Forever",
          badge: "Internet Reality",
          storyHook:
            "Every picture you post, comment you leave, and video you share is like a footprint in wet cement: once it sets, it stays there forever!",
          content: [
            "Even if you click 'Delete', anyone could have already taken a screenshot or archived the page on web backup servers.",
            "Your digital footprint today can be seen by future schools, employers, or strangers years down the road.",
            "Always think before posting: 'Would I be comfortable if my teacher or grandparents saw this?'",
          ],
          actionSteps: [
            "Use the 'Grandma Test': if you'd be embarrassed for your grandparents to see it, don't post it!",
            "Never post comments or videos when you are angry or emotional.",
            "Review your online accounts periodically and clean up outdated posts.",
          ],
          tamiWhisper:
            "The internet never sleeps and rarely forgets. Keep your digital trail clean and proud!",
        },
        {
          id: "submod-3-2",
          title: "Classifying Private vs Shareable Info",
          badge: "Safety Sorting",
          storyHook:
            "Cyber bad actors don't need your house keys to locate you. They just collect small clues scattered across your social posts!",
          content: [
            "Top Secret Data (NEVER SHARE): Home address, phone numbers, school uniform badges, parent's maiden name, and boarding passes.",
            "Safe to Share: Hobbies, favorite games, digital art creations without faces/locations, or high scores without login usernames.",
            "Even a casual selfie outside your front door can expose your street name and house number!",
          ],
          actionSteps: [
            "Blur school logos, car license plates, or house numbers on photos before uploading.",
            "Never share photos of travel tickets—their barcodes store sensitive personal records.",
            "Use a cool gaming nickname instead of your real legal full name.",
          ],
          tamiWhisper:
            "Your privacy is your most precious treasure. Guard your vital information closely!",
        },
        {
          id: "submod-3-3",
          title: "App Permissions & Trap Personality Quizzes",
          badge: "Permission Radar",
          storyHook:
            "'See what you'll look like in 50 years!' or 'Which anime character matches your soul?' Seen these quizzes online? Be careful—there's often a hidden hook!",
          content: [
            "Many viral quizzes and casual apps quietly request access to your camera, address book, and GPS location.",
            "Harvested contacts and location histories are frequently sold to marketing brokers or data trackers.",
            "A simple flashlight or coloring app has zero valid reason to inspect your friends list or GPS!",
          ],
          actionSteps: [
            "Always deny illogical permission requests (e.g. a puzzle game asking for microphone and contacts).",
            "Set social profiles to 'Private' (Friends Only) rather than public.",
            "Always seek parent approval before downloading new software.",
          ],
          tamiWhisper:
            "Never trade your private data for a silly viral quiz. Be the boss of your own app permissions!",
        },
      ],
      quizzes: [
        {
          id: "q3-1",
          question: "Which of the following is the MOST DANGEROUS item to post publicly on social media?",
          options: {
            A: "A photo of your lunch plate",
            B: "A photo of your flight boarding pass showing your full name and barcode",
            C: "A sunset photo at the beach",
            D: "A list of your favorite comic books",
          },
          correct_option: "B",
          explanation: "Boarding pass barcodes encode passenger records, booking codes, and sensitive personal identifiers easily decoded by anyone.",
          justifications: {
            A: "Safe to share as long as no sensitive info is visible.",
            B: "Extremely dangerous! Barcodes conceal encrypted travel records that attackers can exploit.",
            C: "Safe to share.",
            D: "Safe: sharing positive hobbies carries no privacy risk.",
          },
        },
        {
          id: "q3-2",
          question: "What does the concept 'Digital Footprints Last Forever' mean?",
          options: {
            A: "Computers have permanent ink in their screens",
            B: "Deleted posts or photos may have already been saved or screenshotted by other people",
            C: "The internet crashes if we delete files",
            D: "All data is stored inside space satellites",
          },
          correct_option: "B",
          explanation: "Once data is transmitted online, you forfeit exclusive control over who downloads or duplicates it.",
          justifications: {
            A: "Incorrect: screens do not use liquid ink.",
            B: "Spot on! Deleting content on your feed does not remove local copies saved on others' devices.",
            C: "Nonsensical.",
            D: "Incorrect: internet relies on ground-based server networks.",
          },
        },
        {
          id: "q3-3",
          question: "A basic coloring book game asks for permission to access your phone contacts and GPS location. What is your best move?",
          options: {
            A: "Grant all permissions immediately so you can start coloring",
            B: "Deny the permissions because coloring apps do not need phone contacts or GPS!",
            C: "Provide your friend's phone number instead",
            D: "Buy a new smartphone",
          },
          correct_option: "B",
          explanation: "Refuse irrelevant permissions to prevent unnecessary data harvesting.",
          justifications: {
            A: "Risky: your family's contacts could be harvested for spam and scam campaigns.",
            B: "Super smart! Practice the principle of least privilege to keep your device secure.",
            C: "Never share other people's numbers without consent.",
            D: "No new device needed.",
          },
        },
        {
          id: "q3-4",
          question: "Why should student social media profiles be kept on 'Private' mode?",
          options: {
            A: "To keep the phone from heating up",
            B: "To guarantee that only approved friends you know in real life can see your photos and posts",
            C: "To reduce game lag",
            D: "To double your mobile internet data",
          },
          correct_option: "B",
          explanation: "Private accounts restrict interaction to trusted, verified real-world relationships.",
          justifications: {
            A: "Device heat is unrelated to account privacy status.",
            B: "Correct! It shields your personal life from malicious strangers and data scrapers.",
            C: "Zero impact on game frame rates.",
            D: "Does not increase data allowances.",
          },
        },
        {
          id: "q3-5",
          question: "When taking a photo in your school uniform for social media, what safety measure should you take?",
          options: {
            A: "Make sure your school name and chest badge are clearly readable",
            B: "Type your school address in the caption",
            C: "Cover or blur your school name and uniform badge for personal safety",
            D: "Tag the school's live GPS location",
          },
          correct_option: "C",
          explanation: "Concealing school badges protects your physical routine and location from untrusted individuals online.",
          justifications: {
            A: "Dangerous: makes it easy for stalkers to identify your daily physical schedule.",
            B: "Severe hazard to physical safety.",
            C: "Exactly right! Always shield your real-world routines from public discovery.",
            D: "Avoid live geolocation tagging.",
          },
        },
      ],
    },
    {
      id: "cyber-ethics",
      slug: "cyber-ethics",
      legacyId: "module4",
      title: "Cyber Ethics & Speak Up",
      category: "Digital Kindness & Protection",
      description: "Be a cyber hero who champions kindness and speaks up decisively against online bullying!",
      estimatedMinutes: 7,
      iconName: "ChatCircleDots",
      colorClass: "text-[var(--color-tami-violet)]",
      bgClass: "bg-[var(--color-tami-violet)]/15",
      submodules: [
        {
          id: "submod-4-1",
          title: "Words Behind the Screen",
          badge: "Cyber Kindness",
          storyHook:
            "Behind every gaming avatar and social profile is a real human being with real feelings just like you. Harsh words typed on a keyboard hurt just as deeply as insults spoken in person!",
          content: [
            "Some people act reckless or mean online because they think anonymity hides them. This is called 'Cyberbullying'.",
            "Cruel comments destroy self-esteem and make victims dread attending school.",
            "Use the power of your words to uplift and support, never to tear others down.",
          ],
          actionSteps: [
            "Consider how you would feel before posting a comment or message.",
            "Never join in laughing at peers in group chat comments.",
            "Be a champion of encouragement when friends share their creative work.",
          ],
          tamiWhisper:
            "True heroes never bully others. Use your fingertips to type kindness!",
        },
        {
          id: "submod-4-2",
          title: "Speak Up: Becoming an Upstander",
          badge: "Hero Spirit",
          storyHook:
            "When you see a friend getting harassed in an online game or chat, staying silent isn't neutral. Silence makes the bully believe their behavior is acceptable!",
          content: [
            "Two roles exist in digital spaces: Bystanders (passive watchers who stay silent) and Upstanders (brave heroes who support victims safely).",
            "You don't have to shout or trade insults. Simply say: 'Stop, that's not cool!', and redirect the conversation to something positive.",
            "Send a private direct message (DM) to your friend to show warmth so they don't feel isolated.",
          ],
          actionSteps: [
            "Call out bullying calmly without stooping to insults.",
            "Help target friends step away from toxic game lobbies.",
            "Send uplifting support messages to reassure affected peers.",
          ],
          tamiWhisper:
            "A single supportive message can be a lifeline for a hurting friend.",
        },
        {
          id: "submod-4-3",
          title: "Capture Proof (Screenshot) & Tell an Adult",
          badge: "Decisive Action",
          storyHook:
            "If you or a friend experience harassment, threats, or uncomfortable messages online, do not suffer in silence!",
          content: [
            "Step 1: Do not reply with insults—bullies thrive on emotional reactions.",
            "Step 2: Capture a clear screenshot showing timestamps, usernames, and messages as definitive proof.",
            "Step 3: Confide immediately in a trusted adult: your parents, school counselor, or homeroom teacher.",
          ],
          actionSteps: [
            "Take screenshots immediately before messages get deleted.",
            "Use in-app 'Report' and 'Block' tools on the platform.",
            "Talk openly with parents: reporting harassment is courage, not tattling!",
          ],
          tamiWhisper:
            "You are never alone. The adults who love you are always ready to protect you!",
        },
      ],
      quizzes: [
        {
          id: "q4-1",
          question: "What is the key difference between a 'Bystander' and an 'Upstander' during online harassment?",
          options: {
            A: "Bystanders are pro gamers; Upstanders are novice players",
            B: "Bystanders passively stay silent, while Upstanders actively defend and support victims safely",
            C: "Bystanders start the bullying, while Upstanders record videos",
            D: "Both roles ignore the situation completely",
          },
          correct_option: "B",
          explanation: "Upstanders demonstrate digital courage and empathy by safely intervening to help targeted peers.",
          justifications: {
            A: "Incorrect: gaming skill has zero relevance.",
            B: "Spot on! Choosing to be an Upstander reflects real ethical character.",
            C: "Incorrect: bullies start the harassment.",
            D: "Incorrect: Upstanders care deeply about the well-being of others.",
          },
        },
        {
          id: "q4-2",
          question: "If someone repeatedly sends threatening chat messages to you in an online game, what is the best first step?",
          options: {
            A: "Reply with even harsher insults to frighten them",
            B: "Challenge them to an in-person physical fight",
            C: "Take screenshots for evidence, do not reply, block the user, and report to parents/teachers!",
            D: "Delete your gaming account and cry alone",
          },
          correct_option: "C",
          explanation: "Never escalate with retaliatory anger. Preserve documented evidence and consult trusted adults.",
          justifications: {
            A: "Very poor choice: retaliation fuels further escalation.",
            B: "Extremely dangerous to physical safety!",
            C: "Perfect response! Secure documented evidence and enlist adult support.",
            D: "You should never feel blamed or isolated due to others' bad behavior.",
          },
        },
        {
          id: "q4-3",
          question: "Why is capturing screenshots so essential when reporting cyberbullying?",
          options: {
            A: "To post publicly on your social media status",
            B: "As undeniable authentic evidence when reporting to school authorities or parents",
            C: "To fill up your phone's storage drive",
            D: "To sell the images online",
          },
          correct_option: "B",
          explanation: "Screenshots preserve timestamps, usernames, and unalterable records if perpetrators delete messages later.",
          justifications: {
            A: "Avoid spreading drama publicly without adult guidance.",
            B: "Exactly right! Concrete visual proof enables swift, fair intervention.",
            C: "Nonsensical.",
            D: "Unethical and illegal.",
          },
        },
        {
          id: "q4-4",
          question: "A classmate is being ridiculed in a group chat with an embarrassing edited meme. What is your most honorable action?",
          options: {
            A: "Forward the meme to other groups for laughs",
            B: "Send a supportive private message to your friend and tell the group that cruelty isn't funny",
            C: "Quietly laugh behind your screen without commenting",
            D: "Pretend you never read the group messages",
          },
          correct_option: "B",
          explanation: "Showing empathy to a hurt peer and calmly discouraging cruelty makes you a digital peacemaker.",
          justifications: {
            A: "Cruel: you become an active accomplice in the harassment.",
            B: "Heroic! You stand as a beacon of digital kindness and safety.",
            C: "Passive compliance allows cruelty to thrive.",
            D: "Lacks empathy toward a peer in distress.",
          },
        },
        {
          id: "q4-5",
          question: "Is reporting online harassment to your parents or school teachers considered cowardly 'tattling'?",
          options: {
            A: "Yes, cool kids must solve all problems entirely on their own",
            B: "Not at all! Speaking up is brave action that protects you and fosters a safer environment for everyone",
            C: "Only if a reward is promised",
            D: "Yes, your peers will ostracize you for reporting",
          },
          correct_option: "B",
          explanation: "Seeking adult help is every child's fundamental right and the smartest move when confronting cyber threats.",
          justifications: {
            A: "A damaging myth: severe online threats require responsible adult intervention.",
            B: "True! Courageous reporting protects yourself and prevents harm to others.",
            C: "Personal safety is the ultimate reward.",
            D: "True friends admire integrity and moral courage.",
          },
        },
      ],
    },
  ],
};

export function getModuleBySlugOrId(
  slugOrId: string,
  locale: string = "id"
): LearnModuleContent | undefined {
  const normalized = normalizeModuleSlug(slugOrId);
  const list = LEARN_MODULES_DATA[locale] || LEARN_MODULES_DATA.id;
  return list.find(
    (m) => m.slug === normalized || m.id === normalized || m.legacyId === slugOrId
  );
}
