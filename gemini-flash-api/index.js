import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

import { processChatRequest } from './src/chat/service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = 'gemini-2.5-flash';
const PORT = process.env.PORT || 3000;

function normalizeApiError(error) {
  const fallback = {
    status: 500,
    message: 'Scholly AI could not process your request yet. Please try again.',
  };

  if (!error) {
    return fallback;
  }

  const parsed = {
    status: error.status || 500,
    message: error.message || fallback.message,
  };

  // Some SDK errors come as JSON strings in `error.message`.
  if (typeof parsed.message === 'string' && parsed.message.startsWith('{')) {
    try {
      const payload = JSON.parse(parsed.message);
      if (payload?.error?.code) {
        parsed.status = payload.error.code;
      }
      if (payload?.error?.message) {
        parsed.message = payload.error.message;
      }
    } catch {
      // Keep original message when JSON parsing fails.
    }
  }

  if (parsed.status === 503) {
    parsed.message =
      'The AI model is temporarily busy. Please try again in a few moments.';
  }

  return parsed;
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Scholly AI',
  });
});

app.post('/chat', upload.single('attachment'), async (req, res) => {
  try {
    const result = await processChatRequest({
      ai,
      model: GEMINI_MODEL,
      message: req.body.message || '',
      tone: req.body.tone,
      depth: req.body.depth,
      file: req.file,
    });

    res.status(200).json(result);
  } catch (error) {
    const { status, message } = normalizeApiError(error);
    res.status(status).json({ error: message });
  }
});

app.post('/generate-text', upload.none(), async (req, res) => {
  try {
    const result = await processChatRequest({
      ai,
      model: GEMINI_MODEL,
      message: req.body.prompt || '',
      tone: req.body.tone,
      depth: req.body.depth,
    });

    res.status(200).json({ result: result.reply, summary: result.summary });
  } catch (error) {
    const { status, message } = normalizeApiError(error);
    res.status(status).json({ error: message });
  }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  try {
    const result = await processChatRequest({
      ai,
      model: GEMINI_MODEL,
      message: req.body.prompt || '',
      tone: req.body.tone,
      depth: req.body.depth,
      file: req.file,
    });

    res.status(200).json({ result: result.reply, summary: result.summary });
  } catch (error) {
    const { status, message } = normalizeApiError(error);
    res.status(status).json({ error: message });
  }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  try {
    const result = await processChatRequest({
      ai,
      model: GEMINI_MODEL,
      message: req.body.prompt || '',
      tone: req.body.tone,
      depth: req.body.depth,
      file: req.file,
    });

    res.status(200).json({ result: result.reply, summary: result.summary });
  } catch (error) {
    const { status, message } = normalizeApiError(error);
    res.status(status).json({ error: message });
  }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  try {
    const result = await processChatRequest({
      ai,
      model: GEMINI_MODEL,
      message: req.body.prompt || '',
      tone: req.body.tone,
      depth: req.body.depth,
      file: req.file,
    });

    res.status(200).json({ result: result.reply, summary: result.summary });
  } catch (error) {
    const { status, message } = normalizeApiError(error);
    res.status(status).json({ error: message });
  }
});

app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Scholly AI running on port ${PORT}`);
});
