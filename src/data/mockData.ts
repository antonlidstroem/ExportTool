import type { Employee, Tool } from '../types';

export const EMPLOYEES: Employee[] = [
  { id:'EMP-001', firstName:'Astrid', lastName:'Lindqvist', email:'a.lindqvist@nexcorp.se', department:'Engineering', role:'Staff Software Engineer', seniorityLevel:'senior', salary:95000, currency:'USD', startDate:'2019-03-15', status:'active', managerId:'EMP-010', address:{city:'Stockholm',country:'Sweden',timezone:'Europe/Stockholm'}, skills:['TypeScript','React','Node.js','PostgreSQL'], performanceScore:4.6 },
  { id:'EMP-002', firstName:'Marcus', lastName:'Chen', email:'m.chen@nexcorp.se', department:'Engineering', role:'Principal Engineer', seniorityLevel:'lead', salary:135000, currency:'USD', startDate:'2017-08-01', status:'active', managerId:'EMP-010', address:{city:'San Francisco',country:'USA',timezone:'America/Los_Angeles'}, skills:['Go','Kubernetes','Rust','Distributed Systems'], performanceScore:4.9 },
  { id:'EMP-003', firstName:'Priya', lastName:'Mehta', email:'p.mehta@nexcorp.se', department:'Product', role:'Senior Product Manager', seniorityLevel:'senior', salary:115000, currency:'USD', startDate:'2020-11-10', status:'active', managerId:'EMP-011', address:{city:'London',country:'UK',timezone:'Europe/London'}, skills:['Roadmapping','User Research','SQL','Figma'], performanceScore:4.3 },
  { id:'EMP-004', firstName:'Tobias', lastName:'Krause', email:'t.krause@nexcorp.se', department:'Design', role:'Lead UX Designer', seniorityLevel:'lead', salary:108000, currency:'USD', startDate:'2018-06-20', status:'active', managerId:'EMP-011', address:{city:'Berlin',country:'Germany',timezone:'Europe/Berlin'}, skills:['Figma','Prototyping','Design Systems','User Testing'], performanceScore:4.7 },
  { id:'EMP-005', firstName:'Sofia', lastName:'Andersson', email:'s.andersson@nexcorp.se', department:'HR', role:'HR Business Partner', seniorityLevel:'mid', salary:72000, currency:'USD', startDate:'2021-02-28', status:'active', managerId:'EMP-012', address:{city:'Gothenburg',country:'Sweden',timezone:'Europe/Stockholm'}, skills:['Recruitment','HRIS','Employment Law','Mediation'], performanceScore:4.1 },
  { id:'EMP-006', firstName:'Jaylen', lastName:'Brooks', email:'j.brooks@nexcorp.se', department:'Marketing', role:'Growth Marketing Manager', seniorityLevel:'mid', salary:85000, currency:'USD', startDate:'2022-01-15', status:'active', managerId:'EMP-013', address:{city:'New York',country:'USA',timezone:'America/New_York'}, skills:['SEO','Analytics','Paid Media','Copywriting'], performanceScore:3.8 },
  { id:'EMP-007', firstName:'Nora', lastName:'Holm', email:'n.holm@nexcorp.se', department:'Finance', role:'Financial Controller', seniorityLevel:'senior', salary:98000, currency:'USD', startDate:'2019-09-01', status:'active', managerId:'EMP-014', address:{city:'Oslo',country:'Norway',timezone:'Europe/Oslo'}, skills:['IFRS','SAP','Financial Modeling','Audit'], performanceScore:4.5 },
  { id:'EMP-008', firstName:'Diego', lastName:'Vargas', email:'d.vargas@nexcorp.se', department:'Sales', role:'Enterprise Account Executive', seniorityLevel:'senior', salary:90000, currency:'USD', startDate:'2020-04-01', status:'active', managerId:'EMP-015', address:{city:'Madrid',country:'Spain',timezone:'Europe/Madrid'}, skills:['CRM','Negotiation','SaaS Sales','Salesforce'], performanceScore:4.4 },
  { id:'EMP-009', firstName:'Hannah', lastName:'Fischer', email:'h.fischer@nexcorp.se', department:'Engineering', role:'Junior Frontend Developer', seniorityLevel:'junior', salary:58000, currency:'USD', startDate:'2023-07-01', status:'active', managerId:'EMP-002', address:{city:'Munich',country:'Germany',timezone:'Europe/Berlin'}, skills:['React','CSS','TypeScript'], performanceScore:3.6 },
  { id:'EMP-010', firstName:'Elena', lastName:'Vasquez', email:'e.vasquez@nexcorp.se', department:'Engineering', role:'VP of Engineering', seniorityLevel:'vp', salary:185000, currency:'USD', startDate:'2016-01-10', status:'active', managerId:null, address:{city:'San Francisco',country:'USA',timezone:'America/Los_Angeles'}, skills:['Technical Strategy','OKRs','Architecture','Hiring'], performanceScore:4.8 },
  { id:'EMP-011', firstName:'Kwame', lastName:'Asante', email:'k.asante@nexcorp.se', department:'Product', role:'Director of Product', seniorityLevel:'director', salary:155000, currency:'USD', startDate:'2018-03-01', status:'active', managerId:null, address:{city:'Amsterdam',country:'Netherlands',timezone:'Europe/Amsterdam'}, skills:['Product Vision','Go-to-market','OKRs','Analytics'], performanceScore:4.6 },
  { id:'EMP-012', firstName:'Ingrid', lastName:'Svensson', email:'i.svensson@nexcorp.se', department:'HR', role:'Head of People & Culture', seniorityLevel:'director', salary:130000, currency:'USD', startDate:'2017-05-15', status:'active', managerId:null, address:{city:'Stockholm',country:'Sweden',timezone:'Europe/Stockholm'}, skills:['Organizational Design','L&D','Compensation Strategy','DEIB'], performanceScore:4.7 },
  { id:'EMP-013', firstName:'Ravi', lastName:'Patel', email:'r.patel@nexcorp.se', department:'Marketing', role:'Head of Marketing', seniorityLevel:'director', salary:140000, currency:'USD', startDate:'2019-11-01', status:'on-leave', managerId:null, address:{city:'Toronto',country:'Canada',timezone:'America/Toronto'}, skills:['Brand Strategy','B2B Marketing','ABM','Content Strategy'], performanceScore:4.2 },
  { id:'EMP-014', firstName:'Camille', lastName:'Dupont', email:'c.dupont@nexcorp.se', department:'Finance', role:'CFO', seniorityLevel:'vp', salary:200000, currency:'USD', startDate:'2015-09-01', status:'active', managerId:null, address:{city:'Paris',country:'France',timezone:'Europe/Paris'}, skills:['Corporate Finance','M&A','Investor Relations','FP&A'], performanceScore:4.9 },
  { id:'EMP-015', firstName:'Omar', lastName:'Hassan', email:'o.hassan@nexcorp.se', department:'Sales', role:'VP of Sales', seniorityLevel:'vp', salary:175000, currency:'USD', startDate:'2018-08-15', status:'active', managerId:null, address:{city:'Dubai',country:'UAE',timezone:'Asia/Dubai'}, skills:['Revenue Strategy','Sales Enablement','Pipeline Management','Enterprise Deals'], performanceScore:4.5 },
];

export const KPIS = [
  { id:'KPI-001', name:'Employee Retention Rate', description:'Percentage of employees retained over the period', value:91.2, target:90, unit:'%', department:'HR', quarter:'Q4', year:2024, trend:'up' },
  { id:'KPI-002', name:'Time to Hire', description:'Average days from job posting to offer acceptance', value:34, target:28, unit:'days', department:'HR', quarter:'Q4', year:2024, trend:'down' },
  { id:'KPI-003', name:'Engineering Velocity', description:'Story points delivered per sprint', value:78, target:80, unit:'SP', department:'Engineering', quarter:'Q4', year:2024, trend:'stable' },
  { id:'KPI-004', name:'Bug Escape Rate', description:'Bugs found in production vs total bugs', value:4.2, target:3.0, unit:'%', department:'Engineering', quarter:'Q4', year:2024, trend:'down' },
  { id:'KPI-005', name:'MRR Growth', description:'Month-over-month recurring revenue growth', value:8.7, target:10, unit:'%', department:'Sales', quarter:'Q4', year:2024, trend:'up' },
  { id:'KPI-006', name:'Customer Churn Rate', description:'Monthly customer churn percentage', value:1.9, target:2.0, unit:'%', department:'Sales', quarter:'Q4', year:2024, trend:'down' },
  { id:'KPI-007', name:'NPS Score', description:'Net Promoter Score across all customers', value:52, target:55, unit:'score', department:'Product', quarter:'Q4', year:2024, trend:'up' },
  { id:'KPI-008', name:'Feature Adoption Rate', description:'Percentage of users adopting new features', value:38, target:45, unit:'%', department:'Product', quarter:'Q4', year:2024, trend:'stable' },
  { id:'KPI-009', name:'Marketing Qualified Leads', description:'MQLs generated per quarter', value:1240, target:1100, unit:'leads', department:'Marketing', quarter:'Q4', year:2024, trend:'up' },
  { id:'KPI-010', name:'Cost per Acquisition', description:'Average cost to acquire a new customer', value:2150, target:1900, unit:'USD', department:'Marketing', quarter:'Q4', year:2024, trend:'down' },
  { id:'KPI-011', name:'Gross Margin', description:'Company-wide gross profit margin', value:72.4, target:75, unit:'%', department:'Company-wide', quarter:'Q4', year:2024, trend:'up' },
  { id:'KPI-012', name:'Runway', description:'Months of operational runway at current burn', value:22, target:18, unit:'months', department:'Finance', quarter:'Q4', year:2024, trend:'stable' },
];

export const DEPT_STATS = [
  { department:'Engineering', headCount:4, avgSalary:118250, avgPerformanceScore:4.5, totalPayroll:473000, turnoverRate:8.5 },
  { department:'Product', headCount:2, avgSalary:135000, avgPerformanceScore:4.5, totalPayroll:270000, turnoverRate:5.0 },
  { department:'Design', headCount:1, avgSalary:108000, avgPerformanceScore:4.7, totalPayroll:108000, turnoverRate:0.0 },
  { department:'HR', headCount:2, avgSalary:101000, avgPerformanceScore:4.4, totalPayroll:202000, turnoverRate:10.2 },
  { department:'Marketing', headCount:2, avgSalary:112500, avgPerformanceScore:4.0, totalPayroll:225000, turnoverRate:12.0 },
  { department:'Finance', headCount:2, avgSalary:149000, avgPerformanceScore:4.7, totalPayroll:298000, turnoverRate:4.0 },
  { department:'Sales', headCount:2, avgSalary:132500, avgPerformanceScore:4.5, totalPayroll:265000, turnoverRate:15.5 },
];

export const TOOLS: Tool[] = [
  {
    id:'syncfusion', name:'Syncfusion', vendor:'Syncfusion Inc.', version:'26.x',
    tagline:'1,800+ components. Community license covers most HR-tech startups at zero cost.',
    description:`Syncfusion is a commercial UI component library with over 1,800 components. For HR reporting, it provides the Essential JS 2 suite with a high-performance DataGrid, PDF Viewer, Excel Export, and Chart components — all with deep TypeScript support. Its export pipeline runs fully client-side via JavaScript PDF and XlsIO libraries with zero external dependencies or server calls.`,
    color:'#FF6800',
    capabilities:{ pdfExport:true, excelExport:true, csvExport:true, charting:true, gridComponent:true, serverSideRendering:true, reactNativeSupport:true, typescriptSupport:true, accessibilityCompliance:'WCAG 2.1 AA', theming:true },
    benchmark:{ 
        bundleSize:{minGzip:420,full:1200}, 
        setupTimeMinutes:45, 
        apiComplexityScore:7, 
        documentationScore:9, 
        communityScore:7, 
        performanceScore:8, 
        typeScriptQualityScore:9 
    },
    hrUseCaseRating:8.8,
    pros:[
      { text:'Community license: FREE for startups with <$1M revenue — covers most early-stage HR-tech firms', weight:'critical' },
      { text:'Among the most complete TypeScript definitions in the enterprise component ecosystem', weight:'significant' },
      { text:'Fully client-side PDF export via @syncfusion/ej2-pdf-export — no server round-trip required', weight:'significant' },
      { text:'Excel export preserves formatting, multiple sheets, and cell styles', weight:'significant' },
      { text:'WCAG 2.1 AA compliance out of the box — critical for enterprise procurement', weight:'minor' },
    ],
    cons:[
      { text:'Full bundle exceeds 1.2MB uncompressed — aggressive tree-shaking is mandatory, not optional', weight:'critical' },
      { text:'React wrappers feel like a port from Angular-first design — API is not idiomatically React', weight:'significant' },
      { text:'License compliance audits required when crossing the $1M revenue threshold mid-project', weight:'minor' },
    ],
    architecturalNotes:`// React integration pattern (simplified):
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { PdfExport, ExcelExport } from '@syncfusion/ej2-react-grids';

// Strongly typed export properties:
const pdfProps: PdfExportProperties = {
  pageOrientation: 'Landscape',
  fileName: 'hr_employees.pdf',
  theme: { header: { bold: true, fontColor: '#FFFFFF' } }
};

// Trigger export via ref:
gridRef.current.pdfExport(pdfProps);
gridRef.current.excelExport({ fileName: 'hr_employees.xlsx' });`,
  },
  {
    id:'jsreports', name:'jsreport', vendor:'jsreport s.r.o.', version:'4.x',
    tagline:'Server-first reporting engine. Pixel-perfect PDFs via Chrome headless rendering.',
    description:`jsreport is an open-source (LGPL v3) reporting platform designed as a Node.js server-side rendering engine. It uses a template-based approach (Handlebars, JsRender) combined with Chrome headless for pixel-perfect PDF generation. Client-side SDK usage is limited to triggering reports via REST API calls.`,
    color:'#0078D4',
    capabilities:{ pdfExport:true, excelExport:true, csvExport:true, charting:true, gridComponent:false, serverSideRendering:true, reactNativeSupport:false, typescriptSupport:true, accessibilityCompliance:'Template-dependent', theming:true },
    benchmark:{ 
        bundleSize:{minGzip:12,full:45}, 
        setupTimeMinutes:120, 
        apiComplexityScore:8, 
        documentationScore:8, 
        communityScore:6, 
        performanceScore:9, 
        typeScriptQualityScore:6 
    },
    hrUseCaseRating:7.2,
    pros:[
      { text:'Best-in-class PDF fidelity — Chrome-based rendering means pixel-perfect output matching your actual UI', weight:'critical' },
      { text:'Template studio UI allows non-developers to create and modify report layouts independently', weight:'significant' },
      { text:'Extremely small client-side bundle — just a REST API client call', weight:'significant' },
    ],
    cons:[
      { text:'NOT a client-side solution — requires Node.js server or SaaS subscription', weight:'critical' },
      { text:'Template-based approach creates a design/development gap', weight:'significant' },
    ],
    architecturalNotes:`// Architecture: React → REST → jsreport → PDF response
const exportReport = async (employees: Employee[]) => {
  const res = await fetch('https://your-server/api/report', {
    method: 'POST',
    body: JSON.stringify({ template: { name: 'hr-report' }, data: { employees } })
  });
  const blob = await res.blob();
};`,
  },
  {
    id:'telerik', name:'Telerik Kendo UI', vendor:'Progress Software', version:'7.x (React)',
    tagline:'The most React-idiomatic enterprise grid with polished export pipelines.',
    description:`Kendo UI for React is Progress Software's flagship React UI suite. It offers a well-regarded Grid component with built-in Excel and PDF export, powered by @progress/kendo-drawing and @progress/kendo-file-saver.`,
    color:'#FF6358',
    capabilities:{ pdfExport:true, excelExport:true, csvExport:true, charting:true, gridComponent:true, serverSideRendering:true, reactNativeSupport:false, typescriptSupport:true, accessibilityCompliance:'WCAG 2.1 AA', theming:true },
    benchmark:{ 
        bundleSize:{minGzip:380,full:950}, 
        setupTimeMinutes:30, 
        apiComplexityScore:5, 
        documentationScore:9, 
        communityScore:8, 
        performanceScore:8, 
        typeScriptQualityScore:9 
    },
    hrUseCaseRating:8.5,
    pros:[
      { text:'Most React-idiomatic API in the enterprise space — feels like it was designed for React', weight:'critical' },
      { text:'Vector PDF export via kendo-drawing — no blurry rasterized output', weight:'significant' },
      { text:'Grid virtualization handles 100k+ rows without UI thread blocking', weight:'significant' },
    ],
    cons:[
      { text:'No free tier for commercial use — trial expires after 30 days', weight:'critical' },
      { text:'Bundle size is substantial', weight:'significant' },
    ],
    architecturalNotes:`// Type-safe Kendo React Grid with PDF/Excel export:
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';

const EmployeeGrid = ({ data }) => (
  <ExcelExport data={data} fileName="employees.xlsx">
    <Grid data={data} />
  </ExcelExport>
);`,
  },
  {
    id:'devexpress', name:'DevExpress', vendor:'Developer Express Inc.', version:'24.x',
    tagline:'Maximum feature density. Best-in-class PivotGrid for HR analytics at scale.',
    description:`DevExpress offers the DevExtreme React UI library with a comprehensive DataGrid, PivotGrid, and export capabilities using ExcelJS under the hood.`,
    color:'#FF7200',
    capabilities:{ pdfExport:true, excelExport:true, csvExport:true, charting:true, gridComponent:true, serverSideRendering:true, reactNativeSupport:false, typescriptSupport:true, accessibilityCompliance:'WCAG 2.1 AA (partial)', theming:true },
    benchmark:{ 
        bundleSize:{minGzip:340,full:880}, 
        setupTimeMinutes:50, 
        apiComplexityScore:8, 
        documentationScore:8, 
        communityScore:7, 
        performanceScore:9, 
        typeScriptQualityScore:8 
    },
    hrUseCaseRating:8.0,
    pros:[
      { text:'PivotGrid is best-in-class for HR analytics — OLAP-style slice-and-dice on salary data', weight:'critical' },
      { text:'ExcelJS integration provides the richest Excel formatting API in the client-side ecosystem', weight:'significant' },
    ],
    cons:[
      { text:'API design feels dated — object-configuration pattern rather than idiomatic JSX', weight:'critical' },
      { text:'React support feels secondary to jQuery/Knockout origins', weight:'significant' },
    ],
    architecturalNotes:`// DevExtreme Excel export with ExcelJS:
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';

const onExporting = async (e) => {
  const workbook = new Workbook();
  await exportDataGrid({ component: e.component, worksheet: workbook.addWorksheet('HR') });
};`,
  },
  {
    id:'playwright', name:'Playwright', vendor:'Microsoft', version:'1.x',
    tagline:'Architectural reference: use your React UI itself as the export engine.',
    description:`Playwright is Microsoft's cross-browser framework. Used in backends to spin up headless Chromium, navigate to a React page, and call page.pdf(). Produces perfectly styled exports matching your actual UI.`,
    color:'#45BA4B',
    capabilities:{ pdfExport:true, excelExport:false, csvExport:false, charting:true, gridComponent:false, serverSideRendering:true, reactNativeSupport:false, typescriptSupport:true, accessibilityCompliance:'N/A', theming:true },
    benchmark:{ 
        bundleSize:{minGzip:0,full:0}, 
        setupTimeMinutes:90, 
        apiComplexityScore:6, 
        documentationScore:10, 
        communityScore:10, 
        performanceScore:7, 
        typeScriptQualityScore:10 
    },
    hrUseCaseRating:6.5,
    pros:[
      { text:'Exports your actual rendered React UI — zero pixel discrepancy', weight:'critical' },
      { text:'Zero client-side bundle impact; Chromium runs entirely on the server', weight:'significant' },
    ],
    cons:[
      { text:'Cannot run in browser — requires server infrastructure', weight:'critical' },
      { text:'No Excel/XLSX export capability — PDF generation only', weight:'critical' },
    ],
    architecturalNotes:`// Server-side export route (Node.js + Playwright):
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(APP_URL);
const buffer = await page.pdf({ format: 'A4' });`,
  }
];