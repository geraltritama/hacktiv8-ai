import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getDefaultMaterialAction,
  resolveAttachmentKind,
} from '../src/chat/attachment.js';
import {
  buildPrompt,
  normalizeMessage,
  sanitizeDepth,
  sanitizeTone,
} from '../src/chat/prompt.js';

test('resolveAttachmentKind detects supported categories', () => {
  assert.equal(resolveAttachmentKind('image/png'), 'image');
  assert.equal(resolveAttachmentKind('audio/mpeg'), 'audio');
  assert.equal(resolveAttachmentKind('application/pdf'), 'document');
  assert.equal(resolveAttachmentKind('application/zip'), 'unsupported');
});

test('getDefaultMaterialAction maps each attachment kind', () => {
  assert.equal(getDefaultMaterialAction('document'), 'summarize');
  assert.equal(getDefaultMaterialAction('image'), 'explain');
  assert.equal(getDefaultMaterialAction('audio'), 'transcribe-and-summarize');
  assert.equal(getDefaultMaterialAction(null), null);
});

test('normalizeMessage falls back to attachment-based instruction', () => {
  assert.equal(
    normalizeMessage('', 'document'),
    'Please help me understand this document.'
  );
  assert.equal(
    normalizeMessage('', 'image'),
    'Please explain the learning content in this image.'
  );
});

test('sanitize helpers keep PRD-supported preferences only', () => {
  assert.equal(sanitizeTone('formal'), 'formal');
  assert.equal(sanitizeTone('random'), 'friendly');
  assert.equal(sanitizeDepth('detailed'), 'detailed');
  assert.equal(sanitizeDepth('long'), 'concise');
});

test('buildPrompt includes structured response instructions', () => {
  const prompt = buildPrompt({
    message: 'Explain the REST API concept.',
    tone: 'formal',
    depth: 'detailed',
    attachmentKind: 'document',
    attachmentName: 'rest-material.pdf',
  });

  assert.match(prompt, /Scholly AI/);
  assert.match(prompt, /tone "formal"/);
  assert.match(prompt, /depth "detailed"/);
  assert.match(prompt, /rest-material\.pdf/);
  assert.match(prompt, /## Short Explanation/);
  assert.match(prompt, /## Key Points/);
  assert.match(prompt, /## Follow-up Questions/);
});
