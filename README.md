# Scholly AI

Scholly AI is a lightweight AI study assistant designed for college learners.  
It uses a text-first chat workflow and supports one optional attachment per message (document, image, or audio) to enrich learning context.

## Overview

Scholly AI helps users:
- ask academic questions in natural language
- summarize learning documents
- explain note/slide images
- transcribe and summarize learning audio

The product is intentionally scoped as an MVP: simple, demo-friendly, and focused on core learning support.

## MVP Features

- Unified chat interface with visible chat history
- Response settings:
- Writing style: `friendly` or `formal`
- Answer length: `concise` or `detailed`
- Single attachment per message
- Default attachment behavior:
- Document -> summarize
- Image -> explain
- Audio -> transcribe and summarize
- Follow-up questions rendered as clickable quick-action buttons
- Learning disclaimer in the UI

## Tech Stack

- **Backend:** Node.js, Express.js
- **AI SDK:** `@google/genai` (Gemini)
- **Upload middleware:** Multer
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Tests:** Node built-in test runner (`node --test`)

## Project Structure

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
  .env.example
  package.json
  README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` into `.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### 3. Run the app

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm start` -> start the Express server
- `npm test` -> run unit tests

## API Endpoints

### Health Check

- `GET /api/health`

Response:

```json
{
  "status": "ok",
  "app": "Scholly AI"
}
```

### Unified Chat Endpoint

- `POST /chat` (`multipart/form-data`)

Fields:

- `message` (string, optional if attachment exists)
- `tone` (`friendly` | `formal`)
- `depth` (`concise` | `detailed`)
- `attachment` (file, optional, max 1 file)

## Testing

Run:

```bash
npm test
```

Current tests cover:
- attachment type detection
- default attachment action mapping
- message normalization
- preference sanitization
- prompt generation rules

## Deployment Notes

- Keep `GEMINI_API_KEY` in environment variables, never in source code.
- `.env` must not be committed.
- For production hosting, ensure Node server support and proper environment variable configuration.

## Submission Checklist

- GitHub repository URL
- Home screen screenshot
- Text chat example screenshot
- Attachment-based chat example screenshot
- Structured response screenshot

## Project Info (for Form Submission)

- **Project Name:** Scholly AI
- **Target Users:** College learners studying from multi-format materials
- **How It Helps:** Q&A learning support, document summarization, image explanation, audio transcription + summary
