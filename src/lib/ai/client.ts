import { AI_CONFIG } from './config';

export class AICliError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: string,
  ) {
    super(message);
    this.name = 'AICliError';
  }
}

export const aiCli = {
  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  async request(
    messages: { role: string; content: string }[],
    options: {
      jsonMode?: boolean;
      model?: string;
      temperature?: number;
    } = {},
  ): Promise<string> {
    const { apiKey, baseUrl, maxRetries, timeoutMs } = AI_CONFIG;
    const model = options.model ?? AI_CONFIG.modelLetter;

    if (apiKey === '') {
      throw new Error('API ключ AI-провайдера (GROQ_API_KEY) не настроен в файле .env');
    }

    const payload = {
      messages,
      model,
      response_format: options.jsonMode === true ? { type: 'json_object' } : undefined,
      temperature: options.temperature ?? 0.1,
    };

    let attempt = 0;

    while (attempt < maxRetries) {
      attempt += 1;
      const controller = new AbortController();
      const id = setTimeout(() => { controller.abort(); }, timeoutMs);

      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
          const errText = await response.text();

          throw new AICliError(
            `Запрос к AI API завершился с кодом ошибки ${String(response.status)}`,
            response.status,
            errText,
          );
        }

        const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
        const content = data.choices?.[0]?.message?.content;

        if (content === undefined) {
          throw new Error('Ответ от AI API не содержит сгенерированного контента');
        }

        return content;
      } catch (error) {
        clearTimeout(id);

        const isAbort = error instanceof Error && error.name === 'AbortError';
        const isRateLimit = error instanceof AICliError && error.status === 429;
        const isServerErr = error instanceof AICliError && error.status !== undefined && error.status >= 500;

        const shouldRetry = isAbort || isRateLimit || isServerErr || error instanceof TypeError;

        if (shouldRetry && attempt < maxRetries) {
          const backoff = Math.pow(2, attempt) * 1000 + Math.random() * 500;

          await this.delay(backoff);
          continue;
        }

        throw error instanceof Error
          ? error
          : new Error(`Неизвестная ошибка во время выполнения запроса к AI: ${JSON.stringify(error)}`);
      }
    }

    throw new Error('Не удалось получить ответ от AI после максимального количества попыток');
  },
};

