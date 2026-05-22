'use server';

import { aiService } from '@/lib/ai';
import { extractorFactory } from '@/lib/extractors';
import { normalizeText } from '@/lib/normalization/normalizeText';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];

export interface GenerationStepResult {
  success: boolean;
  step: 'upload' | 'extraction' | 'normalization' | 'profile' | 'vacancy' | 'generation' | 'validation';
  message: string;
  error?: string;
}

export interface PipelineResult {
  success: boolean;
  coverLetter?: string;
  error?: string;
}

export async function processPipelineAction(formData: FormData): Promise<PipelineResult> {
  try {
    const resumeFile = formData.get('resumeFile') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (resumeFile === null) {
      return { error: 'Файл резюме обязателен для загрузки.', success: false };
    }

    if (jobDescription === null || jobDescription.trim().length < 10) {
      return { error: 'Описание вакансии обязательно и должно содержать не менее 10 символов.', success: false };
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
      return { error: 'Размер файла превышает допустимый лимит 5 МБ.', success: false };
    }

    const mimeType = resumeFile.type;
    const filename = resumeFile.name;
    const extension = filename.split('.').pop()?.toLowerCase() ?? '';

    const isAllowedMime = ALLOWED_MIME_TYPES.includes(mimeType);
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(extension);

    if (!isAllowedMime && !isAllowedExt) {
      return {
        error: `Недопустимый формат файла: ${filename}. Поддерживаются только форматы PDF, DOCX и TXT.`,
        success: false,
      };
    }

    let buffer: Buffer;

    try {
      const arrayBuffer = await resumeFile.arrayBuffer();

      buffer = Buffer.from(arrayBuffer);
    } catch {
      return { error: 'Не удалось прочитать загруженный файл. Возможно, файл поврежден.', success: false };
    }

    let extractedText = '';

    try {
      extractedText = await extractorFactory.extract(buffer, mimeType, filename);
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Произошла непредвиденная ошибка при извлечении текста из файла.',
        success: false,
      };
    }

    const normalizedText = normalizeText(extractedText);

    if (normalizedText.length < 50) {
      return {
        error: 'Извлеченный текст резюме слишком короткий. Убедитесь, что файл резюме содержит текстовую информацию.',
        success: false,
      };
    }

    let profile;

    try {
      profile = await aiService.extractProfile(normalizedText);
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Не удалось извлечь профиль кандидата с помощью AI.',
        success: false,
      };
    }

    let vacancy;

    try {
      vacancy = await aiService.analyzeVacancy(jobDescription);
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Не удалось проанализировать требования вакансии с помощью AI.',
        success: false,
      };
    }

    let rawLetter = '';

    try {
      rawLetter = await aiService.generateLetter(profile, vacancy);
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Не удалось сгенерировать сопроводительное письмо с помощью AI.',
        success: false,
      };
    }

    let polishedLetter = rawLetter;

    try {
      polishedLetter = await aiService.validateAndPolishLetter(profile, vacancy, rawLetter);
    } catch {
      polishedLetter = rawLetter;
    }

    return {
      coverLetter: polishedLetter,
      success: true,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Произошла критическая ошибка при обработке данных на сервере.',
      success: false,
    };
  }
}

