# Scholly AI

Scholly AI adalah chatbot AI sederhana untuk membantu mahasiswa belajar lebih cepat.
Project ini menggunakan Gemini Flash melalui backend ExpressJS dengan alur chat utama (text-first) dan dukungan 1 lampiran per query (dokumen, gambar, atau audio).

## Fitur MVP

- Unified chat UI (riwayat chat terlihat)
- Response preference tone: `santai` / `formal`
- Response preference depth: `ringkas` / `detail`
- Single attachment query per kiriman
- Dokumen -> default diringkas
- Gambar -> default dijelaskan
- Audio -> default ditranskrip lalu dirangkum
- Learning disclaimer (pengingat bahwa hasil AI perlu diverifikasi)

## Tech Stack

- Node.js + ExpressJS
- Multer (upload file)
- Google Gen AI SDK (`@google/genai`)
- Vanilla HTML/CSS/JS frontend

## Menjalankan Project

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` dari `.env.example`, lalu isi API key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

3. Jalankan server:

```bash
npm start
```

4. Buka browser:

```text
http://localhost:3000
```

## Script

- `npm start` -> menjalankan server
- `npm test` -> menjalankan unit test module chat

## Endpoint Utama

- `GET /api/health`
- `POST /chat` (multipart/form-data)

Field `POST /chat`:

- `message` (string, optional jika ada lampiran)
- `tone` (`santai` atau `formal`)
- `depth` (`ringkas` atau `detail`)
- `attachment` (file, optional, max 1)

## Struktur Project

```text
gemini-flash-api/
  public/
    index.html
    styles.css
    app.js
  src/chat/
    attachment.js
    prompt.js
    response.js
    service.js
  test/
    chat-modules.test.js
  index.js
  PRD.md
  README.md
```

## Bukti Pengumpulan yang Perlu Disiapkan

- Link repository GitHub
- Screenshot halaman utama Scholly AI
- Screenshot contoh chat teks
- Screenshot contoh chat dengan lampiran (dokumen/gambar/audio)
- Screenshot contoh response terstruktur

## Jawaban Singkat Form Pengumpulan

- Nama project: `Scholly AI`
- Target pengguna: mahasiswa/pelajar yang belajar dari materi multi-format
- Cara membantu pengguna: tanya materi, rangkum dokumen, jelaskan gambar catatan, transkrip + ringkas audio
