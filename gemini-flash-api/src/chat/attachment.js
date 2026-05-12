const DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'text/csv',
]);

export function resolveAttachmentKind(mimeType = '') {
  if (!mimeType) {
    return null;
  }

  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }

  if (mimeType.startsWith('text/') || DOCUMENT_MIME_TYPES.has(mimeType)) {
    return 'document';
  }

  return 'unsupported';
}

export function getDefaultMaterialAction(attachmentKind) {
  switch (attachmentKind) {
    case 'document':
      return 'summarize';
    case 'image':
      return 'explain';
    case 'audio':
      return 'transcribe-and-summarize';
    default:
      return null;
  }
}

export function buildInlineDataPart(file) {
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    },
  };
}
