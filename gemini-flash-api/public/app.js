const form = document.getElementById('chat-form');
const historyEl = document.getElementById('chat-history');
const attachmentInput = document.getElementById('attachment');
const attachmentPreview = document.getElementById('attachment-preview');
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message');
const toneInput = document.getElementById('tone');
const depthInput = document.getElementById('depth');

messageInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return;
  }

  if (event.shiftKey) {
    return;
  }

  event.preventDefault();
  form.requestSubmit();
});

attachmentInput.addEventListener('change', () => {
  const file = attachmentInput.files[0];
  attachmentPreview.textContent = file
    ? `Attachment: ${file.name}`
    : 'No attachment';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();
  const file = attachmentInput.files[0];

  if (!message && !file) {
    appendMessage('assistant', {
      meta: ['Scholly AI', 'Input required'],
      html: renderMarkdown(`
## Short Explanation
Please type a question or upload one learning material first.

## Key Points
- You can send a text-only question.
- You can also attach one document, image, or audio file.

## Follow-up Questions
- Which topic are you currently studying?
- Do you want a concise or detailed answer?
      `.trim()),
    });
    return;
  }

  const formData = new FormData();
  formData.append('message', message);
  formData.append('tone', toneInput.value);
  formData.append('depth', depthInput.value);

  if (file) {
    formData.append('attachment', file);
  }

  appendMessage('user', {
    meta: [],
    html: `<p>${escapeHtml(message || '(Using default action for attachment)')}</p>`,
  });

  setPending(true);

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'An error occurred while processing your chat.');
    }

    appendMessage('assistant', {
      meta: [
        'Scholly AI',
        buildSummary(payload.summary),
      ],
      html: renderMarkdown(payload.reply),
    });

    form.reset();
    attachmentPreview.textContent = 'No attachment';
  } catch (error) {
    appendMessage('assistant', {
      meta: ['Scholly AI', 'Error'],
      html: renderMarkdown(`
## Short Explanation
${escapeHtml(error.message)}

## Key Points
- Make sure your file format is supported.
- Try again with a clearer question.

## Follow-up Questions
- Would you like to try without an attachment first?
- Do you prefer a formal or friendly answer style?
      `.trim()),
    });
  } finally {
    setPending(false);
    historyEl.scrollTop = historyEl.scrollHeight;
  }
});

function setPending(isPending) {
  sendButton.disabled = isPending;
  sendButton.textContent = isPending ? 'Scholly AI is thinking...' : 'Send to Scholly AI';
}

function appendMessage(role, { meta, html }) {
  const article = document.createElement('article');
  article.className = `message ${role}`;

  const bodyEl = document.createElement('div');
  bodyEl.className = 'message-body';
  bodyEl.innerHTML = html;
  if (role === 'assistant') {
    enhanceFollowupButtons(bodyEl);
  }

  if (meta && meta.length > 0) {
    const metaEl = document.createElement('div');
    metaEl.className = 'message-meta';
    meta.forEach((item) => {
      const chip = document.createElement('span');
      chip.textContent = item;
      metaEl.appendChild(chip);
    });
    article.append(metaEl);
  }

  article.append(bodyEl);
  historyEl.appendChild(article);
  historyEl.scrollTop = historyEl.scrollHeight;
}

function buildSummary(summary = {}) {
  const parts = [];

  if (summary.attachmentKind) {
    parts.push(summary.attachmentKind);
  }

  if (summary.defaultAction) {
    parts.push(summary.defaultAction);
  }

  if (summary.preferences) {
    parts.push(`${summary.preferences.tone}/${summary.preferences.depth}`);
  }

  return parts.join(' • ') || 'Text';
}

function capitalize(value = '') {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderMarkdown(markdown) {
  const escaped = escapeHtml(markdown);
  const lines = escaped.split('\n');
  let html = '';
  let listType = null;

  function closeListIfOpen() {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      closeListIfOpen();
      html += `<h3>${formatInlineMarkdown(line.slice(3))}</h3>`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (listType !== 'ul') {
        closeListIfOpen();
        html += '<ul>';
        listType = 'ul';
      }
      html += `<li>${formatInlineMarkdown(line.slice(2))}</li>`;
      continue;
    }

    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (listType !== 'ol') {
        closeListIfOpen();
        html += '<ol>';
        listType = 'ol';
      }
      html += `<li>${formatInlineMarkdown(numberedMatch[1])}</li>`;
      continue;
    }

    if (!line.trim()) {
      closeListIfOpen();
      continue;
    }

    closeListIfOpen();

    html += `<p>${formatInlineMarkdown(line)}</p>`;
  }

  closeListIfOpen();

  return html;
}

function enhanceFollowupButtons(container) {
  const headings = Array.from(container.querySelectorAll('h3'));
  const followupHeading = headings.find((heading) =>
    /follow-up questions|follow up questions|pertanyaan lanjutan/i.test(
      heading.textContent || ''
    )
  );

  if (!followupHeading) {
    return;
  }

  let current = followupHeading.nextElementSibling;
  const questions = [];

  while (current && current.tagName !== 'H3') {
    if (current.tagName === 'UL' || current.tagName === 'OL') {
      const items = current.querySelectorAll('li');
      items.forEach((item) => {
        const text = (item.textContent || '').trim();
        if (text) {
          questions.push(text);
        }
      });
      const next = current.nextElementSibling;
      current.remove();
      current = next;
      continue;
    }

    current = current.nextElementSibling;
  }

  if (questions.length === 0) {
    return;
  }

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'followup-actions';

  questions.forEach((question) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'followup-button';
    button.textContent = question;
    button.addEventListener('click', () => {
      if (sendButton.disabled) {
        return;
      }
      messageInput.value = question;
      form.requestSubmit();
    });
    buttonGroup.appendChild(button);
  });

  followupHeading.insertAdjacentElement('afterend', buttonGroup);
}

function formatInlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
