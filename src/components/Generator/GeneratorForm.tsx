'use client';

import { FileCheck, Sliders, UploadCloud } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { generatorContext } from './GeneratorContext';

export function GeneratorForm() {
  const context = React.use(generatorContext);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  if (context === null) {
    return null;
  }

  const { actions, state } = context;

  if (state.status.type !== 'idle') {
    return null;
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      actions.setDragState('active');
    } else if (e.type === 'dragleave') {
      actions.setDragState('idle');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.setDragState('idle');

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files.item(0);

      if (file !== null) {
        actions.processFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files !== null && files.length > 0) {
      const file = files.item(0);

      if (file !== null) {
        actions.processFile(file);
      }
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    actions.handleRemoveFile(e);

    if (fileInputRef.current !== null) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${String(bytes)} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={actions.handleSubmit}>
      <div className="mb-2 flex items-center gap-2.5 border-b border-border pb-3">
        <Sliders className="size-4 text-foreground" />

        <h2 className="text-base font-medium tracking-tight">Ввод исходных данных</h2>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          Резюме кандидата
        </Label>

        <div
          className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border p-8 text-center transition-all duration-300 ${
            state.dragState === 'active'
              ? 'border-primary bg-primary/20'
              : state.resumeFile !== null
                ? 'border-primary/30 bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-white/5'
          }`}
          onClick={() => {
            fileInputRef.current?.click();
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            accept=".pdf,.docx,.txt"
            className="hidden"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
          />

          {state.resumeFile !== null ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-primary-foreground/10 bg-primary">
                <FileCheck className="size-5 text-primary-foreground" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="max-w-[280px] truncate text-sm font-medium text-foreground">
                  {state.resumeFile.name}
                </span>

                <span className="font-mono text-[10px] text-muted-foreground">
                  {formatFileSize(state.resumeFile.size)} {"// "}{state.resumeFile.name.split('.').pop()?.toUpperCase()}
                </span>
              </div>

              <button
                className="mt-2 rounded-md border border-border bg-transparent px-3 py-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-all duration-150 hover:bg-white/5 hover:text-foreground active:translate-y-[1px]"
                type="button"
                onClick={handleRemoveFile}
              >
                Удалить файл
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="mb-1 size-7 text-muted-foreground" />

              <span className="text-sm font-medium text-foreground">
                Перетащите резюме сюда или нажмите для выбора
              </span>

              <span className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                PDF, DOCX, TXT // ДО 5 MB
              </span>
            </div>
          )}
        </div>

        {state.errors.resumeFile !== undefined && (
          <p className="text-destructive mt-1 font-mono text-xs">{state.errors.resumeFile}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="flex justify-between font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          <span>Описание вакансии</span>

          {state.jobDescription.length > 0 && (
            <span className="font-mono text-[10px]">
              {state.jobDescription.length.toString()} символов
            </span>
          )}
        </Label>

        <Textarea
          className="min-h-[160px] resize-y rounded-lg border-border bg-background/50 text-sm text-foreground transition-all placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Вставьте требования, стек технологий, задачи и информацию о компании..."
          value={state.jobDescription}
          onChange={(e) => {
            actions.setJobDescription(e.target.value);
          }}
        />

        {state.errors.jobDescription !== undefined && (
          <p className="text-destructive mt-1 font-mono text-xs">{state.errors.jobDescription}</p>
        )}
      </div>

      <Button
        className="mt-2 h-10 w-full rounded-lg border border-transparent bg-primary font-mono text-xs tracking-widest text-primary-foreground uppercase transition-all duration-150 hover:opacity-90 active:translate-y-[1px]"
        type="submit"
      >
        Начать семантическую генерацию
      </Button>
    </form>
  );
}
