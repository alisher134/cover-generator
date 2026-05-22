import * as React from 'react';

export type GenerationStatus =
  | { type: 'idle' }
  | { type: 'processing'; currentStep: number }
  | { type: 'success'; letterText: string };

export type DragState = 'idle' | 'active';
export type CopyStatus = 'idle' | 'copied';

export interface FormErrors {
  jobDescription?: string;
  resumeFile?: string;
}

export interface GeneratorState {
  resumeFile: File | null;
  jobDescription: string;
  errors: FormErrors;
  dragState: DragState;
  status: GenerationStatus;
  generationText: string;
  copyStatus: CopyStatus;
}

export interface GeneratorActions {
  setResumeFile: (file: File | null) => void;
  setJobDescription: (text: string) => void;
  setDragState: (state: DragState) => void;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  processFile: (file: File) => void;
  handleRemoveFile: (e: React.MouseEvent) => void;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  handleCopy: () => void;
  handleDownload: () => void;
  handleReset: () => void;
}

export interface GeneratorMeta {
  pipelineSteps: { label: string; time: number }[];
}

export interface GeneratorContextValue {
  state: GeneratorState;
  actions: GeneratorActions;
  meta: GeneratorMeta;
}
