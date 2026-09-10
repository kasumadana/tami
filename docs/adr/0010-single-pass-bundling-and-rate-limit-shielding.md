# ADR 0010: Single-Pass Bundling dan Proteksi Kuota Rate-Limit AI

## Status
Accepted

## Konteks
Dengan penambahan fitur AI modern seperti Generative UI Widgets, Exploit Impact Simulation, dan Social Engineering Arena, terdapat risiko eskalasi pemanggilan API Google Gemini (RPM/RPD limits dan HTTP 429) jika menggunakan pendekatan multi-hop agent chaining konvensional. Sebagai platform edukasi anak, sistem harus selalu responsif, bebas error, dan hemat kuota tanpa mengurangi kekayaan interaksi antarmuka.

## Keputusan
1. **Single-Pass Multimodal Bundling pada Detektor:**
   - Data simulasi dampak eksploitasi (*Exploit Impact Simulator*) dimasukkan langsung ke dalam satu skema terstruktur Zod (`DetectorAnalysisSchema`) saat pemindaian awal tangkapan layar.
   - Tidak ada pemanggilan API kedua (*0 extra API calls*). Hasil simulasi langsung tersedia seketika saat kartu vonis dimuat.

2. **Unified Single-Pass Stream pada Generative UI Chat:**
   - Teks percakapan dan pemanggilan fungsi widget (`bindTools`) dialirkan dalam satu siklus inferensi tunggal melalui SSE/NDJSON.
   - Interaksi klik anak pada widget langsung dikunci di sisi klien (*instant debounce*) untuk mencegah pengiriman pesan ganda akibat penekanan tombol berulang.

3. **Batas Putaran Ketat pada Arena Rekayasa Sosial:**
   - Skenario roleplay interaktif dibatasi maksimal 3 putaran dialog (*3-round tactical arena*). Evaluasi akhir nalar dan lencana diterbitkan bersamaan dengan putaran ke-3.

4. **Mesin Fallback Kurasi Deterministik:**
   - Jika `GEMINI_API_KEY` tidak tersedia atau kuota habis (HTTP 429), sistem otomatis dan transparan mengalihkan eksekusi ke mesin kurasi lokal berkualitas tinggi, menjamin demonstrasi pengujian dan penilaian juri tetap berjalan tanpa hambatan visual.

## Konsekuensi & Alasan
- **Biaya API Nol/Minimal:** Fitur AI Generative mutakhir didapatkan tanpa pembengkakan biaya token atau latensi ganda.
- **Ketahanan Sistem 100%:** Mencegah kegagalan aplikasi akibat pembatasan kuota penyedia model.
