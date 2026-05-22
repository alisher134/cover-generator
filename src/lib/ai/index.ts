import {
  COVER_LETTER_GENERATION_PROMPT,
  COVER_LETTER_VALIDATION_PROMPT,
  RESUME_EXTRACTION_PROMPT,
  VACANCY_ANALYSIS_PROMPT,
} from '../prompts';
import {
  candidateProfileSchema,
  type CandidateProfile,
  vacancyAnalysisSchema,
  type VacancyAnalysis,
} from '../schemas';
import { aiCli } from './client';

export const aiService = {
  async analyzeVacancy(vacancyText: string): Promise<VacancyAnalysis> {
    const messages = [
      { content: VACANCY_ANALYSIS_PROMPT, role: 'system' },
      { content: `Проанализируй следующую вакансию и верни JSON по схеме:\n\n${vacancyText}`, role: 'user' },
    ];

    try {
      const response = await aiCli.request(messages, { jsonMode: true });
      const parsed = JSON.parse(response) as unknown;

      return vacancyAnalysisSchema.parse(parsed);
    } catch (error) {
      throw new Error(`Ошибка анализа текста вакансии с помощью AI: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  },

  async extractProfile(normalizedText: string): Promise<CandidateProfile> {
    const messages = [
      { content: RESUME_EXTRACTION_PROMPT, role: 'system' },
      { content: `<resume_raw_text>\n${normalizedText}\n</resume_raw_text>`, role: 'user' },
    ];

    try {
      const response = await aiCli.request(messages, { jsonMode: true });
      const parsed = JSON.parse(response) as unknown;

      return candidateProfileSchema.parse(parsed);
    } catch (error) {
      throw new Error(`Ошибка структурирования профиля кандидата с помощью AI: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  },

  async generateLetter(
    profile: CandidateProfile,
    vacancy: VacancyAnalysis,
  ): Promise<string> {
    const prompt = COVER_LETTER_GENERATION_PROMPT
      .replace('{candidate_profile}', JSON.stringify(profile, null, 2))
      .replace('{vacancy_analysis}', JSON.stringify(vacancy, null, 2));

    const messages = [
      { content: prompt, role: 'user' },
    ];

    try {
      return await aiCli.request(messages, { temperature: 0.7 });
    } catch (error) {
      throw new Error(`Ошибка генерации сопроводительного письма с помощью AI: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  },

  async validateAndPolishLetter(
    profile: CandidateProfile,
    vacancy: VacancyAnalysis,
    rawLetter: string,
  ): Promise<string> {
    const prompt = COVER_LETTER_VALIDATION_PROMPT
      .replace('{candidate_profile}', JSON.stringify(profile, null, 2))
      .replace('{vacancy_analysis}', JSON.stringify(vacancy, null, 2))
      .replace('{cover_letter}', rawLetter);

    const messages = [
      { content: prompt, role: 'user' },
    ];

    try {
      return await aiCli.request(messages, { temperature: 0.3 });
    } catch {
      return rawLetter;
    }
  },
};

