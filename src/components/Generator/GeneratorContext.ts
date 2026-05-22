'use client';

import * as React from 'react';

import type { GeneratorContextValue } from '@/lib/types';

export const generatorContext = React.createContext<GeneratorContextValue | null>(null);
