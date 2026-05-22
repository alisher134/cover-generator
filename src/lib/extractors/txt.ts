import type { FileExtractor } from './types';

export class TxtExtractor implements FileExtractor {
  async extract(buffer: Buffer): Promise<string> {
    try {
      await Promise.resolve();
      const utf8Text = buffer.toString('utf8');

      if (utf8Text.includes('\uFFFD')) {
        return buffer.toString('latin1');
      }

      return utf8Text;
    } catch (error) {
      throw new Error(`Ошибка при чтении текстового файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  }
}

