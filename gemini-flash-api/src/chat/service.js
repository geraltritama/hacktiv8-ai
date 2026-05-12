import { buildInlineDataPart, resolveAttachmentKind } from './attachment.js';
import { buildPrompt, normalizeMessage } from './prompt.js';
import {
  createChatSummary,
  createFallbackResponse,
  createValidationError,
} from './response.js';

export async function processChatRequest({
  ai,
  model,
  message,
  tone,
  depth,
  file,
}) {
  const attachmentKind = file ? resolveAttachmentKind(file.mimetype) : null;

  if (attachmentKind === 'unsupported') {
    throw createValidationError(
      'This file type is not supported yet. Please use a document, image, or audio file.'
    );
  }

  const normalizedMessage = normalizeMessage(message, attachmentKind);

  if (!normalizedMessage) {
    throw createValidationError(
      'Please write a question first or upload one learning material to process.'
    );
  }

  const prompt = buildPrompt({
    message: normalizedMessage,
    tone,
    depth,
    attachmentKind,
    attachmentName: file?.originalname,
  });

  const contents = [{ text: prompt }];

  if (file) {
    contents.push(buildInlineDataPart(file));
  }

  const response = await ai.models.generateContent({
    model,
    contents,
  });

  const reply = response.text?.trim() || createFallbackResponse(
    'I could not produce a complete answer for this input yet.'
  );

  return {
    reply,
    summary: createChatSummary({
      attachmentKind,
      tone,
      depth,
    }),
  };
}
