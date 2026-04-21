export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'vp' | 'director';
  salary: number;
  currency: string;
  startDate: string;
  status: 'active' | 'on-leave' | 'terminated' | 'inactive';
  managerId: string | null;
  performanceScore: number;
  address: { city: string; country: string; timezone: string };
  skills: string[];
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  version: string;
  tagline: string;
  description: string;
  color: string;
  capabilities: Record<string, boolean | string>;
  benchmark: {
    bundleSize: { minGzip: number; full: number };
    performanceScore: number;
    documentationScore: number;
    apiComplexityScore: number;
    communityScore: number;
    typeScriptQualityScore: number;
    setupTimeMinutes: number;
  };
  hrUseCaseRating: number;
  pros: { text: string; weight: string }[];
  cons: { text: string; weight: string }[];
  architecturalNotes: string;
}

export type Page = 'dashboard' | 'playground' | 'decision-guide' | string;