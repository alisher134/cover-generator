export function normalizeText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  text = text.replace(/[ \t]+/g, ' ');

  text = text.replace(/\n{3,}/g, '\n\n');

  text = text.trim();

  return text;
}
