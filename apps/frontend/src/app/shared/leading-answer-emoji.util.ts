const LEADING_EMOJI_SOURCE = String.raw`(\s*)((?:(?:[\p{Extended_Pictographic}](?:\uFE0F|\uFE0E)?(?:\u200D[\p{Extended_Pictographic}](?:\uFE0F|\uFE0E)?)*)|(?:[\p{Regional_Indicator}]{2})|(?:[#*0-9]\uFE0F?\u20E3))+)(?:\s+)`;

const BLOCK_LEADING_EMOJI_RE = new RegExp(
  String.raw`(<(?:p|li)(?:\s[^>]*)?>)${LEADING_EMOJI_SOURCE}`,
  'u',
);
const ROOT_LEADING_EMOJI_RE = new RegExp(String.raw`^${LEADING_EMOJI_SOURCE}`, 'u');
const MARKDOWN_EMOJI_SPAN_SOURCE = String.raw`(\s*)(<span\b[^>]*\bclass=(?:"[^"]*\bmarkdown-emoji\b[^"]*"|'[^']*\bmarkdown-emoji\b[^']*')[^>]*>[\s\S]*?<\/span>)(?:\s+)`;
const BLOCK_LEADING_MARKDOWN_EMOJI_RE = new RegExp(
  String.raw`(<(?:p|li)(?:\s[^>]*)?>)${MARKDOWN_EMOJI_SPAN_SOURCE}`,
  'u',
);
const ROOT_LEADING_MARKDOWN_EMOJI_RE = new RegExp(String.raw`^${MARKDOWN_EMOJI_SPAN_SOURCE}`, 'u');

export function decorateLeadingAnswerEmoji(html: string): string {
  if (!html || html.includes('answer-leading-emoji')) {
    return html;
  }

  const blockDecorated = html.replace(
    BLOCK_LEADING_EMOJI_RE,
    (_match, openingTag: string, leadingWhitespace: string, emoji: string) =>
      `${addClassToTag(openingTag, 'answer-leading-emoji-block')}${leadingWhitespace}<span class="answer-leading-emoji">${emoji}</span>`,
  );
  if (blockDecorated !== html) {
    return blockDecorated;
  }

  const rootDecorated = html.replace(
    ROOT_LEADING_EMOJI_RE,
    '$1<span class="answer-leading-emoji">$2</span>',
  );
  if (rootDecorated !== html) {
    return rootDecorated;
  }

  const blockMarkdownDecorated = html.replace(
    BLOCK_LEADING_MARKDOWN_EMOJI_RE,
    (_match, openingTag: string, leadingWhitespace: string, emojiSpan: string) =>
      `${addClassToTag(openingTag, 'answer-leading-emoji-block')}${leadingWhitespace}${addClassToTag(emojiSpan, 'answer-leading-emoji')}`,
  );
  if (blockMarkdownDecorated !== html) {
    return blockMarkdownDecorated;
  }

  return html.replace(
    ROOT_LEADING_MARKDOWN_EMOJI_RE,
    (_match, leadingWhitespace: string, emojiSpan: string) =>
      `${leadingWhitespace}${addClassToTag(emojiSpan, 'answer-leading-emoji')}`,
  );
}

function addClassToTag(tag: string, className: string): string {
  const classAttrRe = /\bclass=(['"])(.*?)\1/u;
  if (!classAttrRe.test(tag)) {
    return tag.replace(/>$/, ` class="${className}">`);
  }

  return tag.replace(classAttrRe, (_match, quote: string, existing: string) => {
    const classes = existing.split(/\s+/).filter(Boolean);
    if (!classes.includes(className)) {
      classes.push(className);
    }
    return `class=${quote}${classes.join(' ')}${quote}`;
  });
}
