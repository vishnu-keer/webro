import { qs, qsa } from '../modules/dom';
import { trackEvent } from '../modules/analytics';
import { findAnswer } from './matcher';

const BASE_DELAY_MS = 420;
const MS_PER_CHAR = 3.2;
const MAX_DELAY_MS = 1500;

/** Chat UI. Answer selection lives in `matcher.ts`; this only handles the DOM. */
export function initChatWidget(): void {
  const launcher = qs<HTMLButtonElement>('[data-chat-launcher]');
  const panel = qs('[data-chat-panel]');
  const log = qs('[data-chat-log]');
  const input = qs<HTMLInputElement>('[data-chat-input]');
  const sendButton = qs<HTMLButtonElement>('[data-chat-send]');
  const closeButton = qs<HTMLButtonElement>('[data-chat-close]');

  if (!launcher || !panel || !log || !input || !sendButton || !closeButton) return;

  let greeted = false;

  const append = (html: string, author: 'bot' | 'user'): void => {
    const bubble = document.createElement('div');
    bubble.className = `chat-message chat-message--${author}`;
    bubble.innerHTML = html;
    log.append(bubble);
    log.scrollTop = log.scrollHeight;
  };

  const showTyping = (): HTMLElement => {
    const indicator = document.createElement('div');
    indicator.className = 'chat-typing';
    indicator.innerHTML = '<i></i><i></i><i></i>';
    log.append(indicator);
    log.scrollTop = log.scrollHeight;
    return indicator;
  };

  const respond = (question: string): void => {
    append(question, 'user');
    const indicator = showTyping();
    const answer = findAnswer(question);

    // Pace the reply to its length so it reads like someone typing.
    const delay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS + answer.length * MS_PER_CHAR);

    window.setTimeout(() => {
      indicator.remove();
      append(answer, 'bot');
      trackEvent('chat_message', { question: question.slice(0, 60) });
    }, delay);
  };

  const open = (): void => {
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');

    if (!greeted) {
      greeted = true;
      window.setTimeout(
        () =>
          append(
            "Hi! 👋 I'm <strong>WEBRO AI</strong>.\n\nAsk me about pricing, timelines, services, or anything else — I'll answer straight away.",
            'bot',
          ),
        200,
      );
    }

    window.setTimeout(() => input.focus(), 320);
    trackEvent('chat_open');
  };

  const close = (): void => {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
  };

  const submit = (): void => {
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    respond(question);
  };

  launcher.addEventListener('click', () =>
    panel.classList.contains('is-open') ? close() : open(),
  );
  closeButton.addEventListener('click', close);
  sendButton.addEventListener('click', submit);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  qsa<HTMLButtonElement>('[data-chat-suggestion]').forEach((button) =>
    button.addEventListener('click', () =>
      respond(button.dataset.chatSuggestion ?? button.textContent ?? ''),
    ),
  );
}
