declare module 'pdf-parse/worker' {
  export function getPath(): string;
  export function getData(): string;
}

import { PDFParse } from 'pdf-parse';
import { getPath } from 'pdf-parse/worker';

import type { FileExtractor } from './types';


PDFParse.setWorker(getPath());

export class PdfExtractor implements FileExtractor {
  async extract(buffer: Buffer): Promise<string> {
    try {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();

      if (result.text.trim() === '') {
        throw new Error('Файл пуст или отсканирован без текстового слоя (OCR)');
      }

      return result.text;
    } catch (error) {
      throw new Error(`Ошибка извлечения текста из PDF: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  }
}



