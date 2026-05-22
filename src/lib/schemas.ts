import { z } from 'zod';

export const candidateProfileSchema = z.object({
  contacts: z.object({
    email: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    phone: z.string().optional(),
    portfolio: z.string().optional(),
    telegram: z.string().optional(),
  }).optional().default({}),
  education: z.array(
    z.object({
      degree: z.string().optional(),
      institution: z.string(),
      years: z.string().optional(),
    })
  ).optional().default([]),
  experience: z.array(
    z.object({
      achievements: z.array(z.string()).optional().default([]),
      company: z.string().default('Неизвестная компания'),
      duration: z.string().optional(),
      position: z.string().default('Специалист'),
      technologies: z.array(z.string()).optional().default([]),
    })
  ).default([]),
  fullName: z.string().default('Не указано'),
  languages: z.array(z.string()).optional().default([]),
  position: z.string().optional(),
  projects: z.array(
    z.object({
      description: z.string().optional(),
      name: z.string(),
      technologies: z.array(z.string()).optional().default([]),
    })
  ).optional().default([]),
  skills: z.array(z.string()).default([]),
  summary: z.string().optional(),
});

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;

export const vacancyAnalysisSchema = z.object({
  companyName: z.string().default('Команда'),
  domainContext: z.string().nullable().optional().default(null),
  hardSkills: z.array(z.string()).default([]),
  position: z.string().default('Специалист'),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  seniority: z.string().nullable().optional().default(null),
  softSkills: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export type VacancyAnalysis = z.infer<typeof vacancyAnalysisSchema>;

