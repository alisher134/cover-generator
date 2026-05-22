import * as React from 'react';

export function GeneratorFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background text-foreground antialiased selection:bg-[#c5e384]/30 selection:text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#444444_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04]" />

      <main className="relative mx-auto flex w-full max-w-[800px] flex-1 flex-col items-center justify-center gap-8 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

export function GeneratorCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[500px] w-full flex-col justify-start overflow-hidden rounded-xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 lg:p-8">
      {children}
    </section>
  );
}
