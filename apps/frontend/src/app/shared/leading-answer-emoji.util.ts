const LEADING_EMOJI_SOURCE = String.raw`(\s*)((?:(?:[\p{Extended_Pictographic}](?:\uFE0F|\uFE0E)?(?:\u200D[\p{Extended_Pictographic}](?:\uFE0F|\uFE0E)?)*)|(?:[\p{Regional_Indicator}]{2})|(?:[#*0-9]\uFE0F?\u20E3))+)(?:\s+)`;

const BLOCK_LEADING_EMOJI_RE = new RegExp(
  String.raw`(<(?:p|li)(?:\s[^>]*)?>)${LEADING_EMOJI_SOURCE}([\s\S]*?)(</(?:p|li)>)`,
  'u',
);
const ROOT_LEADING_EMOJI_RE = new RegExp(String.raw`^${LEADING_EMOJI_SOURCE}([\s\S]*?)$`, 'u');
const MARKDOWN_EMOJI_SPAN_SOURCE = String.raw`(\s*)(<span\b[^>]*\bclass=(?:"[^"]*\bmarkdown-emoji\b[^"]*"|'[^']*\bmarkdown-emoji\b[^']*')[^>]*>[\s\S]*?<\/span>)(?:\s+)`;
const BLOCK_LEADING_MARKDOWN_EMOJI_RE = new RegExp(
  String.raw`(<(?:p|li)(?:\s[^>]*)?>)${MARKDOWN_EMOJI_SPAN_SOURCE}([\s\S]*?)(</(?:p|li)>)`,
  'u',
);
const ROOT_LEADING_MARKDOWN_EMOJI_RE = new RegExp(
  String.raw`^${MARKDOWN_EMOJI_SPAN_SOURCE}([\s\S]*?)$`,
  'u',
);

export function decorateLeadingAnswerEmoji(html: string): string {
  if (!html || html.includes('answer-leading-emoji')) {
    return html;
  }

  const blockDecorated = html.replace(
    BLOCK_LEADING_EMOJI_RE,
    (
      _match,
      openingTag: string,
      leadingWhitespace: string,
      emoji: string,
      rest: string,
      closingTag: string,
    ) =>
      `${addClassToTag(openingTag, 'answer-leading-emoji-block')}${leadingWhitespace}${wrapLeadingAnswerEmoji(
        `<span class="answer-leading-emoji">${emoji}</span>`,
        rest,
      )}${closingTag}`,
  );
  if (blockDecorated !== html) {
    return blockDecorated;
  }

  const rootDecorated = html.replace(
    ROOT_LEADING_EMOJI_RE,
    (_match, leadingWhitespace: string, emoji: string, rest: string) =>
      `${leadingWhitespace}${wrapLeadingAnswerEmoji(
        `<span class="answer-leading-emoji">${emoji}</span>`,
        rest,
      )}`,
  );
  if (rootDecorated !== html) {
    return rootDecorated;
  }

  const blockMarkdownDecorated = html.replace(
    BLOCK_LEADING_MARKDOWN_EMOJI_RE,
    (
      _match,
      openingTag: string,
      leadingWhitespace: string,
      emojiSpan: string,
      rest: string,
      closingTag: string,
    ) =>
      `${addClassToTag(openingTag, 'answer-leading-emoji-block')}${leadingWhitespace}${wrapLeadingAnswerEmoji(
        addClassToTag(emojiSpan, 'answer-leading-emoji'),
        rest,
      )}${closingTag}`,
  );
  if (blockMarkdownDecorated !== html) {
    return blockMarkdownDecorated;
  }

  return html.replace(
    ROOT_LEADING_MARKDOWN_EMOJI_RE,
    (_match, leadingWhitespace: string, emojiSpan: string, rest: string) =>
      `${leadingWhitespace}${wrapLeadingAnswerEmoji(
        addClassToTag(emojiSpan, 'answer-leading-emoji'),
        rest,
      )}`,
  );
}

function wrapLeadingAnswerEmoji(emojiHtml: string, rest: string): string {
  return `${emojiHtml}<span class="answer-leading-emoji-text">${rest}</span>`;
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
