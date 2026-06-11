/** Split element text into .char spans (keeps accessibility via aria-label). */
export function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const chars = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

/** Split element text into .word spans. */
export function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = [];
  text.split(/\s+/).forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = w;
    el.appendChild(span);
    if (i >= 0) el.appendChild(document.createTextNode(' '));
    words.push(span);
  });
  return words;
}
