import { DocxExtractor } from './docx';
import { PdfExtractor } from './pdf';
import { TxtExtractor } from './txt';
import type { FileExtractor } from './types';

export interface ExtractorFactory {
  extract(buffer: Buffer, mimeType: string, filename: string): Promise<string>;
  getExtractor(mimeType: string, filename: string): FileExtractor;
}

export const extractorFactory: ExtractorFactory = {
  async extract(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
    const extractor = this.getExtractor(mimeType, filename);
    const text = await extractor.extract(buffer);

    if (text === '' || text.trim().length === 0) {
      throw new Error('Не удалось извлечь текст из файла резюме. Убедитесь, что файл не поврежден и содержит текстовый слой.');
    }

    return text;
  },

  getExtractor(mimeType: string, filename: string): FileExtractor {
    const ext = filename.split('.').pop()?.toLowerCase();

    if (mimeType === 'application/pdf' || ext === 'pdf') {
      return new PdfExtractor();
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      return new DocxExtractor();
    }

    if (mimeType === 'text/plain' || ext === 'txt') {
      return new TxtExtractor();
    }

    throw new Error(`Неподдерживаемый тип файла: ${mimeType !== '' ? mimeType : (ext ?? 'неизвестно')}. Допускаются только PDF, DOCX и TXT.`);
  },
};


