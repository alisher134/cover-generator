'use client';

import * as React from 'react';

import { generatorContext } from './GeneratorContext';

import { generateMockCoverLetter } from '@/lib/generatorLogic';
import type {
  CopyStatus,
  DragState,
  FormErrors,
  GenerationStatus,
} from '@/lib/types';

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [jobDescription, setJobDescription] = React.useState('');
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [dragState, setDragState] = React.useState<DragState>('idle');
  const [status, setStatus] = React.useState<GenerationStatus>({ type: 'idle' });
  const [generationText, setGenerationText] = React.useState('');
  const [copyStatus, setCopyStatus] = React.useState<CopyStatus>('idle');

  const pipelineSteps = React.useMemo(
    () => [
      { label: 'Чтение структуры файла резюме...', time: 1200 },
      { label: 'Извлечение ключевых навыков и опыта...', time: 1400 },
      { label: 'Семантическое сопоставление с вакансией...', time: 1300 },
      { label: 'Генерация финального сопроводительного письма...', time: 1500 },
    ],
    [],
  );

  const streamLetter = React.useCallback((text: string) => {
    let index = 0;
    const charsPerTick = 6;
    const speed = 4;

    const timer = setInterval(() => {
      if (index < text.length) {
        const nextChunk = text.substring(index, index + charsPerTick);

        setGenerationText((prev) => prev + nextChunk);
        index += charsPerTick;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }, []);

  const handleSubmit = React.useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      setErrors({});
      setGenerationText('');
      setStatus({ currentStep: 0, type: 'processing' });

      let currentStep = 0;

      const runPipeline = () => {
        if (currentStep < pipelineSteps.length) {
          setTimeout(() => {
            currentStep += 1;

            if (currentStep < pipelineSteps.length) {
              setStatus({ currentStep, type: 'processing' });
              runPipeline();
            } else {
              const fileNameStr = resumeFile !== null ? resumeFile.name : '';
              const fullLetterText = generateMockCoverLetter(fileNameStr, jobDescription);

              setStatus({ letterText: fullLetterText, type: 'success' });
              streamLetter(fullLetterText);
            }
          }, pipelineSteps[currentStep].time);
        }
      };

      runPipeline();
    },
    [jobDescription, resumeFile, pipelineSteps, streamLetter],
  );

  const processFile = React.useCallback((file: File) => {
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resumeFile: undefined }));
  }, []);

  const handleRemoveFile = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeFile(null);
    setErrors((prev) => ({ ...prev, resumeFile: undefined }));
  }, []);

  const handleCopy = React.useCallback(() => {
    void navigator.clipboard.writeText(generationText);
    setCopyStatus('copied');

    setTimeout(() => {
      setCopyStatus('idle');
    }, 2000);
  }, [generationText]);

  const handleDownload = React.useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([generationText], { type: 'text/plain;charset=utf-8' });

    element.href = URL.createObjectURL(file);
    const downloadName = resumeFile !== null ? resumeFile.name.replace(/\.[^/.]+$/, '') : 'Кандидат';

    element.download = `Сопроводительное_Письмо_${downloadName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [generationText, resumeFile]);

  const handleReset = React.useCallback(() => {
    setGenerationText('');
    setStatus({ type: 'idle' });
  }, []);

  const state = React.useMemo(
    () => ({
      copyStatus,
      dragState,
      errors,
      generationText,
      jobDescription,
      resumeFile,
      status,
    }),
    [resumeFile, jobDescription, errors, dragState, status, generationText, copyStatus],
  );

  const actions = React.useMemo(
    () => ({
      handleCopy,
      handleDownload,
      handleRemoveFile,
      handleReset,
      handleSubmit,
      processFile,
      setDragState,
      setErrors,
      setJobDescription,
      setResumeFile,
    }),
    [processFile, handleRemoveFile, handleSubmit, handleCopy, handleDownload, handleReset],
  );

  const meta = React.useMemo(
    () => ({
      pipelineSteps,
    }),
    [pipelineSteps],
  );

  const contextValue = React.useMemo(
    () => ({ actions, meta, state }),
    [state, actions, meta],
  );

  return (
    <generatorContext.Provider value={contextValue}>
      {children}
    </generatorContext.Provider>
  );
}
