# 0001. 100% Client-Side Edge Computing untuk Kuis Kinestetik

Untuk kuis evaluasi pemahaman modul pembelajaran di tami, kami memutuskan menjalankan pelacakan gestur tangan (MediaPipe Tasks-Vision WASM) dan pengenalan suara (Web Speech API) secara 100% lokal di browser pengguna (edge computing), tanpa mengirim stream kamera atau rekaman suara ke server backend maupun layanan cloud.

Keputusan ini diambil untuk menjamin perlindungan privasi anak (kepatuhan regulasi perlindungan data pribadi dan perlindungan anak digital) serta memastikan latensi deteksi 0ms dengan performa 30–60 FPS tanpa beban biaya bandwidth atau kuota API server.

## Status
Accepted

## Considered Options
- **Cloud-Based Multimodal Video/Audio Streaming (Gemini / Whisper API)**: Mengunggah frame kamera atau rekaman audio ke server untuk dianalisis. Ditolak karena biaya API tinggi, latensi 1–3 detik yang memutus interaktivitas anak, dan risiko pelanggaran privasi data biometrik anak.
- **Client-Side Edge Computing (MediaPipe WASM + Web Speech API)**: Diterima karena privasi 100% terjamin, data kamera tidak pernah keluar dari memori browser siswa, dan responsif.
