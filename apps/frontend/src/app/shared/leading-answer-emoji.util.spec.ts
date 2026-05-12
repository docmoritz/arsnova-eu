import { describe, expect, it } from 'vitest';
import { decorateLeadingAnswerEmoji } from './leading-answer-emoji.util';

describe('decorateLeadingAnswerEmoji', () => {
  it('wraps a leading emoji at the root with a styling span', () => {
    const html = '😄 Bereit loszulegen';

    expect(decorateLeadingAnswerEmoji(html)).toBe(
      '<span class="answer-leading-emoji">😄</span><span class="answer-leading-emoji-text">Bereit loszulegen</span>',
    );
  });

  it('wraps a leading emoji inside paragraph markup', () => {
    const html = '<p>😭 Gerade etwas überfordert</p>';

    expect(decorateLeadingAnswerEmoji(html)).toBe(
      '<p class="answer-leading-emoji-block"><span class="answer-leading-emoji">😭</span><span class="answer-leading-emoji-text">Gerade etwas überfordert</span></p>',
    );
  });

  it('preserves existing classes when decorating paragraph markup', () => {
    const html = '<p class="markdown-body">😄 Bereit loszulegen</p>';

    expect(decorateLeadingAnswerEmoji(html)).toBe(
      '<p class="markdown-body answer-leading-emoji-block"><span class="answer-leading-emoji">😄</span><span class="answer-leading-emoji-text">Bereit loszulegen</span></p>',
    );
  });

  it('decorates leading markdown shortcode emoji spans inside paragraph markup', () => {
    const html = '<p><span class="markdown-emoji" title=":apple:">🍎</span> Bereit loszulegen</p>';

    expect(decorateLeadingAnswerEmoji(html)).toBe(
      '<p class="answer-leading-emoji-block"><span class="markdown-emoji answer-leading-emoji" title=":apple:">🍎</span><span class="answer-leading-emoji-text">Bereit loszulegen</span></p>',
    );
  });

  it('does not decorate non-leading emojis', () => {
    const html = '<p>Team 😄 ist bereit</p>';

    expect(decorateLeadingAnswerEmoji(html)).toBe(html);
  });

  it('does not decorate the same html twice', () => {
    const html = '<p><span class="answer-leading-emoji">😡</span>Genervt</p>';

    expect(decorateLeadingAnswerEmoji(html)).toBe(html);
  });
});
