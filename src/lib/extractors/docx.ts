import mammoth from 'mammoth';

import type { FileExtractor } from './types';

export class DocxExtractor implements FileExtractor {
  async extract(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });

      if (!result.value || result.value.trim() === '') {
        throw new Error('Файл пуст или не содержит извлекаемого текста');
      }

      return result.value;
    } catch (error) {
      throw new Error(`Ошибка извлечения текста из DOCX: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  }
}
