export function GeneratorHeader() {
  return (
    <header className="flex w-full flex-col items-center gap-4 pt-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
          Интеллектуальный синтез сопроводительных писем
        </h1>

        <p className="mx-auto max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
          Премиальный генератор сопроводительных писем на базе семантического анализа резюме и
          глубокого соответствия требованиям вакансии.
        </p>
      </div>
    </header>
  );
}
