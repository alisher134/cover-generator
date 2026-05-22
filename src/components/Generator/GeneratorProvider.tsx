'use client';

import * as React from 'react';

import { generatorContext } from './GeneratorContext';

import { processPipelineAction } from '@/app/actions/generator';
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
      { label: 'Чтение и извлечение текста резюме...', time: 1200 },
      { label: 'Нормализация текста и защита от инъекций...', time: 1000 },
      { label: 'Структурирование профиля кандидата с помощью AI...', time: 1500 },
      { label: 'Семантический анализ требований вакансии через AI...', time: 1300 },
      { label: 'Генерация персонализированного сопроводительного письма...', time: 1600 },
      { label: 'Финальная валидация и защита от галлюцинаций...', time: 1200 },
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

      if (!resumeFile) {
        setErrors((prev) => ({ ...prev, resumeFile: 'Пожалуйста, выберите или перетащите файл резюме (PDF, DOCX, TXT).' }));

        return;
      }

      if (!jobDescription || jobDescription.trim().length < 10) {
        setErrors((prev) => ({ ...prev, jobDescription: 'Пожалуйста, введите описание вакансии (минимум 10 символов).' }));

        return;
      }

      setErrors({});
      setGenerationText('');
      setStatus({ currentStep: 0, type: 'processing' });

      const formData = new FormData();

      formData.append('resumeFile', resumeFile);
      formData.append('jobDescription', jobDescription);

      let currentStep = 0;
      let serverResult: { success: boolean; coverLetter?: string; error?: string } | null = null;
      let isStepperFinished = false;

      const checkCompletion = () => {
        if (isStepperFinished && serverResult !== null) {
          if (serverResult.success && serverResult.coverLetter !== undefined) {
            const letter = serverResult.coverLetter;

            setStatus({ letterText: letter, type: 'success' });
            streamLetter(letter);
          } else {
            setStatus({ type: 'idle' });
            setErrors({
              jobDescription: serverResult.error ?? 'Произошла непредвиденная ошибка при генерации.',
            });
          }
        }
      };

      const runServerAction = async () => {
        try {
          const res = await processPipelineAction(formData);

          serverResult = res;
        } catch (err) {
          serverResult = {
            error: err instanceof Error ? err.message : 'Произошла ошибка при вызове сервера.',
            success: false,
          };
        }

        checkCompletion();
      };

      const runStepper = () => {
        if (currentStep < pipelineSteps.length - 1) {
          setTimeout(() => {
            currentStep += 1;
            setStatus({ currentStep, type: 'processing' });
            runStepper();
          }, pipelineSteps[currentStep].time);
        } else {
          isStepperFinished = true;
          checkCompletion();
        }
      };

      void runServerAction();
      runStepper();
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
