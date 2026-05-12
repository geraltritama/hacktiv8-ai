import { getDefaultMaterialAction } from './attachment.js';
import { sanitizeDepth, sanitizeTone } from './prompt.js';

export function createChatSummary({ attachmentKind, tone, depth }) {
  return {
    attachmentKind,
    defaultAction: getDefaultMaterialAction(attachmentKind),
    preferences: {
      tone: sanitizeTone(tone),
      depth: sanitizeDepth(depth),
    },
  };
}

export function createValidationError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function createFallbackResponse(message) {
  return [
    '## Short Explanation',
    message,
    '',
    '## Key Points',
    '- Try clarifying your question or uploading clearer material.',
    '- Make sure the file you send matches your learning goal.',
    '',
    '## Follow-up Questions',
    '- Which part would you like to understand first?',
    '- Do you want a more concise or more detailed version?',
  ].join('\n');
}
