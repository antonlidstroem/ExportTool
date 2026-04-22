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

export interface KPI {
  id: string;
  name: string;
  description: string;
  value: number;
  target: number;
  unit: string;
  department: string;
  quarter: string;
  year: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DepartmentStat {
  department: string;
  headCount: number;
  avgSalary: number;
  avgPerformanceScore: number;
  totalPayroll: number;
  turnoverRate: number;
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  version: string;
  tagline: string;
  description: string;
  color: string;
  category: 'component-suite' | 'reporting-engine' | 'testing-framework';
  capabilities: Record<string, boolean | string>;
  pricing: {
    model: string;
    startingPrice: string;
    notes: string;
    freeTrialDays: number | null;
  };
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
  pros: { text: string; weight: 'critical' | 'significant' | 'minor' }[];
  cons: { text: string; weight: 'critical' | 'significant' | 'minor' }[];
  bestFor: string[];
  notRecommendedFor: string[];
  architecturalNotes: string;
}

export type Page =
  | 'dashboard'
  | 'playground'
  | 'decision-guide'
  | 'syncfusion'
  | 'jsreports'
  | 'telerik'
  | 'devexpress'
  | 'playwright';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'pptx';

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  width?: number;
  formatter?: (val: T[keyof T]) => string;
}

export interface PdfTheme {
  id: string;
  name: string;
  description: string;
  headerBg: string;
  headerText: string;
  accentColor: string;
  bodyBg: string;
  altRowBg: string;
  borderColor: string;
  hasCoverPage: boolean;
}

export interface ReportConfig {
  title: string;
  subtitle: string;
  preparedBy: string;
  department: string;
  format: ExportFormat;
  pdfTheme: string;
  columns: string[];
  departmentFilter: string;
  statusFilter: string;
}

export interface DecisionAnswers {
  budget: 'free' | 'moderate' | 'generous' | null;
  clientSideOnly: 'yes' | 'no' | null;
  primaryUseCase: 'pdf' | 'excel' | 'both' | 'pptx' | null;
  typescriptPriority: 'critical' | 'preferred' | 'optional' | null;
  teamSize: 'small' | 'medium' | 'large' | null;
}
