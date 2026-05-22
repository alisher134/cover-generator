'use client';

import { Check, Cpu, RefreshCw } from 'lucide-react';
import * as React from 'react';

import { generatorContext } from './GeneratorContext';

export function GeneratorLoader() {
  const context = React.use(generatorContext);

  if (context === null) {
    return null;
  }

  const { meta, state } = context;

  if (state.status.type !== 'processing') {
    return null;
  }

  const currentStep = state.status.currentStep;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-12">
      <div className="relative flex size-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border border-primary/30 [animation-duration:8s]" />

        <Cpu className="size-6 animate-pulse text-primary" />
      </div>

      <div className="flex w-full max-w-[340px] flex-col gap-4">
        <span className="text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          Обработка запроса
        </span>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-background/50 p-4 font-mono text-[10px]">
          {meta.pipelineSteps.map((step, idx) => (
            <div
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                idx < currentStep
                  ? 'font-medium text-foreground opacity-80'
                  : idx === currentStep
                    ? 'font-bold text-foreground opacity-100'
                    : 'text-muted-foreground opacity-40'
              }`}
              key={idx}
            >
              {idx < currentStep ? (
                <Check className="size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground" />
              ) : idx === currentStep ? (
                <RefreshCw className="size-3.5 animate-spin text-primary" />
              ) : (
                <div className="mx-1.5 size-1 rounded-full bg-border" />
              )}

              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
