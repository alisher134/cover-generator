export interface AIProviderConfig {
  apiKey: string;
  baseUrl: string;
  modelResume: string;
  modelVacancy: string;
  modelLetter: string;
  maxRetries: number;
  timeoutMs: number;
}

export const AI_CONFIG: AIProviderConfig = {
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseUrl: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
  maxRetries: 3,
  modelLetter: process.env.GROQ_MODEL_LETTER ?? 'llama-3.3-70b-versatile',
  modelResume: process.env.GROQ_MODEL_RESUME ?? 'llama-3.3-70b-versatile',
  modelVacancy: process.env.GROQ_MODEL_VACANCY ?? 'llama-3.3-70b-versatile',
  timeoutMs: 15000,
};
