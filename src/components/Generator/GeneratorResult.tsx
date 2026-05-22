'use client';

import { Check, Copy, Download, FileText } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';

import { generatorContext } from './GeneratorContext';

export function GeneratorResult() {
  const context = React.use(generatorContext);

  if (context === null) {
    return null;
  }

  const { actions, state } = context;

  if (state.status.type !== 'success' && state.generationText === '') {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <FileText className="size-4 text-foreground" />

          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Сгенерированное письмо
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-border bg-background/50 p-2 text-muted-foreground transition-all duration-150 hover:text-foreground active:translate-y-[1px]"
            title="Копировать в буфер"
            onClick={actions.handleCopy}
          >
            {state.copyStatus === 'copied' ? (
              <Check className="size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>

          <button
            className="rounded-lg border border-border bg-background/50 p-2 text-muted-foreground transition-all duration-150 hover:text-foreground active:translate-y-[1px]"
            title="Скачать файл"
            onClick={actions.handleDownload}
          >
            <Download className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative max-h-[460px] min-h-[300px] flex-1 overflow-y-auto rounded-lg border border-border bg-background/30 p-6 font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground focus:outline-none">
        {state.generationText}
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          className="h-10 flex-1 rounded-lg border border-border bg-transparent font-mono text-xs tracking-widest text-muted-foreground uppercase transition-all duration-150 hover:bg-white/5 hover:text-foreground active:translate-y-[1px]"
          onClick={actions.handleReset}
        >
          Сбросить и начать заново
        </Button>

        <Button
          className="h-10 flex-1 rounded-lg bg-primary font-mono text-xs tracking-widest text-primary-foreground uppercase transition-all duration-150 hover:opacity-90 active:translate-y-[1px]"
          onClick={actions.handleCopy}
        >
          {state.copyStatus === 'copied' ? 'Копировано!' : 'Копировать письмо'}
        </Button>
      </div>
    </div>
  );
}
