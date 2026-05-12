import { getDefaultMaterialAction } from './attachment.js';

const VALID_TONES = new Set(['formal', 'friendly']);
const VALID_DEPTHS = new Set(['concise', 'detailed']);

export function sanitizeTone(value) {
  return VALID_TONES.has(value) ? value : 'friendly';
}

export function sanitizeDepth(value) {
  return VALID_DEPTHS.has(value) ? value : 'concise';
}

export function normalizeMessage(message = '', attachmentKind = null) {
  const trimmed = message.trim();

  if (trimmed) {
    return trimmed;
  }

  if (!attachmentKind) {
    return '';
  }

  const action = getDefaultMaterialAction(attachmentKind);

  if (action === 'summarize') {
    return 'Please help me understand this document.';
  }

  if (action === 'explain') {
    return 'Please explain the learning content in this image.';
  }

  if (action === 'transcribe-and-summarize') {
    return 'Please transcribe and summarize this audio so it is easier to study.';
  }

  return '';
}

export function buildPrompt({
  message,
  tone,
  depth,
  attachmentKind,
  attachmentName,
}) {
  const safeTone = sanitizeTone(tone);
  const safeDepth = sanitizeDepth(depth);
  const defaultAction = getDefaultMaterialAction(attachmentKind);
  const attachmentContext = attachmentKind
    ? `There is attached Learning Material of type ${attachmentKind}${attachmentName ? ` with file name "${attachmentName}"` : ''}.`
    : 'There is no attached Learning Material.';

  const defaultActionInstruction = defaultAction
    ? `If the learner does not give a specific instruction, use this Default Material Action: ${defaultAction}.`
    : 'If there is no attachment, focus on the learner text question.';

  return `
You are Scholly AI, a study assistant for college learners in the academic domain.

Core rules:
- Default to clear and simple English unless the learner explicitly uses another language.
- Match the requested tone "${safeTone}" and depth "${safeDepth}".
- Prioritize learning support and conceptual understanding over instant answers.
- If the learner asks an exercise or problem-solving question, provide a Guided Learning Response: reasoning steps first, final conclusion after.
- If context is unclear, the image is unreadable, the audio is hard to understand, or the document is not legible, do not invent details. Provide an honest Clarification Request.
- If there is an attachment, keep the explanation grounded in that material.

Input context:
- ${attachmentContext}
- ${defaultActionInstruction}

Response format:
## Short Explanation
Write the core explanation in 1 to 2 short paragraphs.

## Key Points
- Write 3 to 5 key points.

## Follow-up Questions
- Write 2 to 3 follow-up questions that help the learner study deeper.

If clarification is needed, still use the same headings and briefly explain what needs to be clarified.

Learner question:
${message}
  `.trim();
}
