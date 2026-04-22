import type { Employee, Tool, KPI, DepartmentStat } from '../types';

export const EMPLOYEES: Employee[] = [
  { id:'EMP-001', firstName:'Astrid', lastName:'Lindqvist', email:'a.lindqvist@lidstroem.se', department:'Engineering', role:'Staff Software Engineer', seniorityLevel:'senior', salary:95000, currency:'USD', startDate:'2019-03-15', status:'active', managerId:'EMP-010', address:{city:'Stockholm',country:'Sweden',timezone:'Europe/Stockholm'}, skills:['TypeScript','React','Node.js','PostgreSQL'], performanceScore:4.6 },
  { id:'EMP-002', firstName:'Marcus', lastName:'Chen', email:'m.chen@lidstroem.se', department:'Engineering', role:'Principal Engineer', seniorityLevel:'lead', salary:135000, currency:'USD', startDate:'2017-08-01', status:'active', managerId:'EMP-010', address:{city:'San Francisco',country:'USA',timezone:'America/Los_Angeles'}, skills:['Go','Kubernetes','Rust','Distributed Systems'], performanceScore:4.9 },
  { id:'EMP-003', firstName:'Priya', lastName:'Mehta', email:'p.mehta@lidstroem.se', department:'Product', role:'Senior Product Manager', seniorityLevel:'senior', salary:115000, currency:'USD', startDate:'2020-11-10', status:'active', managerId:'EMP-011', address:{city:'London',country:'UK',timezone:'Europe/London'}, skills:['Roadmapping','User Research','SQL','Figma'], performanceScore:4.3 },
  { id:'EMP-004', firstName:'Tobias', lastName:'Krause', email:'t.krause@lidstroem.se', department:'Design', role:'Lead UX Designer', seniorityLevel:'lead', salary:108000, currency:'USD', startDate:'2018-06-20', status:'active', managerId:'EMP-011', address:{city:'Berlin',country:'Germany',timezone:'Europe/Berlin'}, skills:['Figma','Prototyping','Design Systems','User Testing'], performanceScore:4.7 },
  { id:'EMP-005', firstName:'Sofia', lastName:'Andersson', email:'s.andersson@lidstroem.se', department:'HR', role:'HR Business Partner', seniorityLevel:'mid', salary:72000, currency:'USD', startDate:'2021-02-28', status:'active', managerId:'EMP-012', address:{city:'Gothenburg',country:'Sweden',timezone:'Europe/Stockholm'}, skills:['Recruitment','HRIS','Employment Law','Mediation'], performanceScore:4.1 },
  { id:'EMP-006', firstName:'Jaylen', lastName:'Brooks', email:'j.brooks@lidstroem.se', department:'Marketing', role:'Growth Marketing Manager', seniorityLevel:'mid', salary:85000, currency:'USD', startDate:'2022-01-15', status:'active', managerId:'EMP-013', address:{city:'New York',country:'USA',timezone:'America/New_York'}, skills:['SEO','Analytics','Paid Media','Copywriting'], performanceScore:3.8 },
  { id:'EMP-007', firstName:'Nora', lastName:'Holm', email:'n.holm@lidstroem.se', department:'Finance', role:'Financial Controller', seniorityLevel:'senior', salary:98000, currency:'USD', startDate:'2019-09-01', status:'active', managerId:'EMP-014', address:{city:'Oslo',country:'Norway',timezone:'Europe/Oslo'}, skills:['IFRS','SAP','Financial Modeling','Audit'], performanceScore:4.5 },
  { id:'EMP-008', firstName:'Diego', lastName:'Vargas', email:'d.vargas@lidstroem.se', department:'Sales', role:'Enterprise Account Executive', seniorityLevel:'senior', salary:90000, currency:'USD', startDate:'2020-04-01', status:'active', managerId:'EMP-015', address:{city:'Madrid',country:'Spain',timezone:'Europe/Madrid'}, skills:['CRM','Negotiation','SaaS Sales','Salesforce'], performanceScore:4.4 },
  { id:'EMP-009', firstName:'Hannah', lastName:'Fischer', email:'h.fischer@lidstroem.se', department:'Engineering', role:'Junior Frontend Developer', seniorityLevel:'junior', salary:58000, currency:'USD', startDate:'2023-07-01', status:'active', managerId:'EMP-002', address:{city:'Munich',country:'Germany',timezone:'Europe/Berlin'}, skills:['React','CSS','TypeScript'], performanceScore:3.6 },
  { id:'EMP-010', firstName:'Elena', lastName:'Vasquez', email:'e.vasquez@lidstroem.se', department:'Engineering', role:'VP of Engineering', seniorityLevel:'vp', salary:185000, currency:'USD', startDate:'2016-01-10', status:'active', managerId:null, address:{city:'San Francisco',country:'USA',timezone:'America/Los_Angeles'}, skills:['Technical Strategy','OKRs','Architecture','Hiring'], performanceScore:4.8 },
  { id:'EMP-011', firstName:'Kwame', lastName:'Asante', email:'k.asante@lidstroem.se', department:'Product', role:'Director of Product', seniorityLevel:'director', salary:155000, currency:'USD', startDate:'2018-03-01', status:'active', managerId:null, address:{city:'Amsterdam',country:'Netherlands',timezone:'Europe/Amsterdam'}, skills:['Product Vision','Go-to-market','OKRs','Analytics'], performanceScore:4.6 },
  { id:'EMP-012', firstName:'Ingrid', lastName:'Svensson', email:'i.svensson@lidstroem.se', department:'HR', role:'Head of People & Culture', seniorityLevel:'director', salary:130000, currency:'USD', startDate:'2017-05-15', status:'active', managerId:null, address:{city:'Stockholm',country:'Sweden',timezone:'Europe/Stockholm'}, skills:['Organizational Design','L&D','Compensation Strategy','DEIB'], performanceScore:4.7 },
  { id:'EMP-013', firstName:'Ravi', lastName:'Patel', email:'r.patel@lidstroem.se', department:'Marketing', role:'Head of Marketing', seniorityLevel:'director', salary:140000, currency:'USD', startDate:'2019-11-01', status:'on-leave', managerId:null, address:{city:'Toronto',country:'Canada',timezone:'America/Toronto'}, skills:['Brand Strategy','B2B Marketing','ABM','Content Strategy'], performanceScore:4.2 },
  { id:'EMP-014', firstName:'Camille', lastName:'Dupont', email:'c.dupont@lidstroem.se', department:'Finance', role:'CFO', seniorityLevel:'vp', salary:200000, currency:'USD', startDate:'2015-09-01', status:'active', managerId:null, address:{city:'Paris',country:'France',timezone:'Europe/Paris'}, skills:['Corporate Finance','M&A','Investor Relations','FP&A'], performanceScore:4.9 },
  { id:'EMP-015', firstName:'Omar', lastName:'Hassan', email:'o.hassan@lidstroem.se', department:'Sales', role:'VP of Sales', seniorityLevel:'vp', salary:175000, currency:'USD', startDate:'2018-08-15', status:'active', managerId:null, address:{city:'Dubai',country:'UAE',timezone:'Asia/Dubai'}, skills:['Revenue Strategy','Sales Enablement','Pipeline Management','Enterprise Deals'], performanceScore:4.5 },
];

export const KPIS: KPI[] = [
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

export const DEPT_STATS: DepartmentStat[] = [
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
    id: 'syncfusion', name: 'Syncfusion', vendor: 'Syncfusion Inc.', version: '26.x',
    tagline: 'Real client-side Excel, PDF, and PPTX exports — all in the browser.',
    description: 'Syncfusion Essential JS 2 provides a production-grade React DataGrid with native Excel and PDF export pipelines running entirely in-browser. No server needed. Community license is free for companies under $1M revenue.',
    color: '#FF6800', category: 'component-suite',
    pricing: { model: 'commercial', startingPrice: '$995/dev/yr', notes: 'Community license FREE for <$1M revenue. Includes all 1,800+ components.', freeTrialDays: 30 },
    capabilities: { pdfExport: true, excelExport: true, pptxExport: true, csvExport: true, charting: true, gridComponent: true, typescriptSupport: true, clientSide: true, accessibilityCompliance: 'WCAG 2.1 AA' },
    benchmark: { bundleSize: { minGzip: 420, full: 1200 }, setupTimeMinutes: 45, apiComplexityScore: 7, documentationScore: 9, communityScore: 7, performanceScore: 8, typeScriptQualityScore: 9 },
    hrUseCaseRating: 8.8,
    pros: [
      { text: 'Community license is FREE for startups under $1M revenue — covers most HR-tech companies', weight: 'critical' },
      { text: 'Client-side Excel export preserves formatting, multiple sheets, freeze panes, and cell styles', weight: 'significant' },
      { text: 'PDF export uses vector rendering — no blurry bitmaps at any zoom level', weight: 'significant' },
      { text: 'WCAG 2.1 AA compliance built-in — critical for regulated industries', weight: 'minor' },
    ],
    cons: [
      { text: 'Full bundle exceeds 1.2MB — aggressive tree-shaking is mandatory for performance', weight: 'critical' },
      { text: 'React wrappers feel ported from Angular-first design — not idiomatically React', weight: 'significant' },
      { text: 'License compliance audit required when crossing the $1M revenue threshold', weight: 'minor' },
    ],
    bestFor: ['Full-featured enterprise dashboards', 'Startups under $1M needing a free solution', 'Complex Excel exports with rich formatting'],
    notRecommendedFor: ['Lightweight SPAs with strict bundle budgets', 'Teams strongly preferring OSS-only stack'],
    architecturalNotes: `import { GridComponent, ColumnsDirective, ColumnDirective,
  Inject, PdfExport, ExcelExport, Toolbar
} from '@syncfusion/ej2-react-grids';
import type { PdfExportProperties, ExcelExportProperties } from '@syncfusion/ej2-react-grids';

const gridRef = useRef<GridComponent>(null);

const exportPDF = () => {
  const props: PdfExportProperties = {
    pageOrientation: 'Landscape',
    fileName: 'hr_employees.pdf',
    theme: {
      header: { bold: true, fontColor: '#FFFFFF', fontSize: 12 },
      record: { fontColor: '#333333', fontSize: 10 },
    }
  };
  gridRef.current?.pdfExport(props);
};

const exportExcel = () => {
  const props: ExcelExportProperties = {
    fileName: 'hr_employees.xlsx',
    header: { headerRows: 1, rows: [{ cells: [{ colSpan: 5,
      value: 'LIDSTROEM HR Export', style: { bold: true } }] }] }
  };
  gridRef.current?.excelExport(props);
};

<GridComponent ref={gridRef} dataSource={employees}
  toolbar={['PdfExport', 'ExcelExport']}
  allowPdfExport={true} allowExcelExport={true}
  toolbarClick={onToolbarClick}>
  <ColumnsDirective>
    <ColumnDirective field="firstName" headerText="First Name" />
    <ColumnDirective field="salary" headerText="Salary" format="C0" />
  </ColumnsDirective>
  <Inject services={[PdfExport, ExcelExport, Toolbar]} />
</GridComponent>`,
  },
  {
    id: 'jsreports', name: 'jsreport', vendor: 'jsreport s.r.o.', version: '4.x',
    tagline: 'Server-side Chrome rendering for pixel-perfect PDF reports.',
    description: 'jsreport renders Handlebars templates through a headless Chromium browser on a Node.js server, producing pixel-perfect PDFs. The React frontend sends a JSON payload and receives a PDF binary. A public playground exists at playground.jsreport.net for experimentation.',
    color: '#0078D4', category: 'reporting-engine',
    pricing: { model: 'freemium', startingPrice: 'Free (self-hosted, LGPL)', notes: 'jsreport Online starts at $39/month. Enterprise with SSO at $390/month.', freeTrialDays: 14 },
    capabilities: { pdfExport: true, excelExport: true, pptxExport: false, csvExport: true, charting: true, gridComponent: false, typescriptSupport: true, clientSide: false, accessibilityCompliance: 'Template-dependent' },
    benchmark: { bundleSize: { minGzip: 12, full: 45 }, setupTimeMinutes: 120, apiComplexityScore: 8, documentationScore: 8, communityScore: 6, performanceScore: 9, typeScriptQualityScore: 6 },
    hrUseCaseRating: 7.2,
    pros: [
      { text: 'Chrome-rendered PDFs are pixel-perfect — your CSS controls every detail of the output', weight: 'critical' },
      { text: 'Non-developers can edit templates in the jsreport Studio UI without touching React code', weight: 'significant' },
      { text: 'Zero client bundle impact — entire engine lives on the server', weight: 'significant' },
      { text: 'Supports scheduled reports, email delivery, and report version history natively', weight: 'minor' },
    ],
    cons: [
      { text: 'Requires a Node.js server — fundamentally incompatible with client-side-only architectures', weight: 'critical' },
      { text: 'TypeScript types are community-maintained and incomplete for core APIs', weight: 'significant' },
      { text: 'Template-based approach lives outside the React component tree — design/dev gap', weight: 'significant' },
    ],
    bestFor: ['Server-side architectures with Node.js', 'Pixel-perfect regulatory compliance PDFs', 'Non-developer self-service reporting portals'],
    notRecommendedFor: ['Pure client-side React SPAs', 'Teams without Node.js backend', 'Real-time on-demand exports needing <1s latency'],
    architecturalNotes: `// Node.js server route (Express + jsreport):
import jsreport from '@jsreport/nodejs-client';

const client = jsreport('https://your-jsreport-server');

app.post('/api/export/employees', async (req, res) => {
  const { employees } = req.body;

  const report = await client.render({
    template: { name: 'employee-directory' }, // Handlebars template
    data: { employees, generatedAt: new Date().toISOString() }
  });

  res.setHeader('Content-Type', 'application/pdf');
  report.result.pipe(res);
});

// React client — just a fetch call:
const exportPDF = async () => {
  const res = await fetch('/api/export/employees', {
    method: 'POST',
    body: JSON.stringify({ employees: filteredData })
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url); // triggers browser PDF viewer
};`,
  },
  {
    id: 'telerik', name: 'Telerik Kendo UI', vendor: 'Progress Software', version: '7.x',
    tagline: 'The most React-idiomatic enterprise grid with polished export pipelines.',
    description: 'Kendo UI for React is Progress Software\'s flagship React UI suite. It offers a well-regarded DataGrid with built-in Excel and PDF export via @progress/kendo-drawing. The API is genuinely React-idiomatic with excellent TypeScript support. Requires a paid commercial license — no free tier for production use.',
    color: '#FF6358', category: 'component-suite',
    pricing: { model: 'commercial', startingPrice: '$899/dev/yr', notes: 'DevCraft Ultimate bundles all Telerik products. No free tier for commercial use. 30-day trial only.', freeTrialDays: 30 },
    capabilities: { pdfExport: true, excelExport: true, pptxExport: false, csvExport: true, charting: true, gridComponent: true, typescriptSupport: true, clientSide: true, accessibilityCompliance: 'WCAG 2.1 AA' },
    benchmark: { bundleSize: { minGzip: 380, full: 950 }, setupTimeMinutes: 30, apiComplexityScore: 5, documentationScore: 9, communityScore: 8, performanceScore: 8, typeScriptQualityScore: 9 },
    hrUseCaseRating: 8.5,
    pros: [
      { text: 'Most React-idiomatic API in the enterprise space — designed for React, not ported', weight: 'critical' },
      { text: 'Outstanding documentation with TypeScript examples throughout every API reference', weight: 'significant' },
      { text: 'Vector PDF via kendo-drawing — sharp output at any zoom level', weight: 'significant' },
      { text: 'Grid virtualization handles 100k+ rows without blocking the UI thread', weight: 'significant' },
    ],
    cons: [
      { text: 'No free tier — commercial license required even for evaluation beyond 30 days', weight: 'critical' },
      { text: 'Per-developer pricing scales sharply for larger teams — high TCO', weight: 'significant' },
      { text: 'Bundle size requires strategic imports to avoid shipping unused components', weight: 'minor' },
    ],
    bestFor: ['Enterprise HR portals with complex grid requirements', 'Teams prioritising React-first API design', 'Organizations already in the Progress ecosystem'],
    notRecommendedFor: ['Budget-constrained startups', 'Projects with hard bundle-size contracts'],
    architecturalNotes: `import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { GridPDFExport } from '@progress/kendo-react-pdf';

const excelRef = useRef<ExcelExport>(null);
const pdfRef = useRef<GridPDFExport>(null);

return (
  <>
    <button onClick={() => excelRef.current?.save()}>Export Excel</button>
    <button onClick={() => pdfRef.current?.save()}>Export PDF</button>

    <ExcelExport data={employees} fileName="hr_report.xlsx" ref={excelRef}>
      <Grid data={employees}>
        <GridColumn field="firstName" title="First Name" />
        <GridColumn field="salary" title="Salary" format="{0:c}" />
      </Grid>
    </ExcelExport>

    <GridPDFExport ref={pdfRef} paperSize="A4" landscape={true}>
      <Grid data={employees}>
        <GridColumn field="firstName" title="First Name" />
        <GridColumn field="salary" title="Salary" format="{0:c}" />
      </Grid>
    </GridPDFExport>
  </>
);`,
  },
  {
    id: 'devexpress', name: 'DevExpress', vendor: 'Developer Express Inc.', version: '24.x',
    tagline: 'Real DataGrid with live Excel and PDF export via ExcelJS + jsPDF.',
    description: 'DevExtreme React provides a high-performance DataGrid with grouping, filtering, and column chooser. Excel export uses ExcelJS client-side for rich formatting. PDF export uses jsPDF. A free community license exists for non-commercial projects.',
    color: '#FF7200', category: 'component-suite',
    pricing: { model: 'commercial', startingPrice: '$599/dev/yr (DevExtreme only)', notes: 'Free community license for non-commercial. Universal subscription ($2299+) covers all DevExpress products.', freeTrialDays: 30 },
    capabilities: { pdfExport: true, excelExport: true, pptxExport: false, csvExport: true, charting: true, gridComponent: true, typescriptSupport: true, clientSide: true, accessibilityCompliance: 'WCAG 2.1 AA (partial)' },
    benchmark: { bundleSize: { minGzip: 340, full: 880 }, setupTimeMinutes: 50, apiComplexityScore: 8, documentationScore: 8, communityScore: 7, performanceScore: 9, typeScriptQualityScore: 8 },
    hrUseCaseRating: 8.0,
    pros: [
      { text: 'PivotGrid is best-in-class for HR analytics — OLAP-style slice-and-dice without a server', weight: 'critical' },
      { text: 'ExcelJS integration gives the richest Excel formatting control in the browser ecosystem', weight: 'significant' },
      { text: 'Highest DataGrid rendering performance among peers for large employee datasets', weight: 'significant' },
      { text: 'Free community license for internal and non-commercial tools', weight: 'significant' },
    ],
    cons: [
      { text: 'Object-configuration API pattern feels dated compared to idiomatic JSX props', weight: 'critical' },
      { text: 'Configuration surface is enormous — very high learning curve', weight: 'significant' },
      { text: 'TypeScript definitions exist but complex generics are sometimes inaccurate', weight: 'significant' },
    ],
    bestFor: ['Data-heavy HR analytics with pivot requirements', 'Very large employee datasets (50k+)', 'Applications needing rich Excel cell formatting'],
    notRecommendedFor: ['Teams prioritising idiomatic modern React patterns', 'Projects where TypeScript strictness is non-negotiable at all layers'],
    architecturalNotes: `import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import { exportDataGrid as exportToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportToPDF } from 'devextreme/pdf_exporter';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

const onExportExcel = async (e: DataGridTypes.ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Employees');
  await exportToExcel({
    component: e.component, worksheet,
    autoFilterEnabled: true,
    customizeCell: ({ gridCell, excelCell }) => {
      if (gridCell?.column?.dataField === 'salary') {
        excelCell.numFmt = '$#,##0.00';
        excelCell.font = { bold: true };
      }
    }
  });
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'hr_report.xlsx');
};`,
  },
  {
    id: 'playwright', name: 'Playwright', vendor: 'Microsoft', version: '1.x',
    tagline: 'Architectural reference: use your React UI as the export engine itself.',
    description: 'Playwright spins up headless Chromium on a Node.js server, navigates to your React report page, and calls page.pdf(). The export IS your rendered UI — zero design discrepancy. Cannot run in the browser. Included as an architectural reference for server-side rendering architectures.',
    color: '#45BA4B', category: 'testing-framework',
    pricing: { model: 'open-source', startingPrice: 'Free (MIT)', notes: 'Playwright is free. Infrastructure costs only: Node.js server + Chromium (~280MB container overhead).', freeTrialDays: null },
    capabilities: { pdfExport: true, excelExport: false, pptxExport: false, csvExport: false, charting: true, gridComponent: false, typescriptSupport: true, clientSide: false, accessibilityCompliance: 'N/A' },
    benchmark: { bundleSize: { minGzip: 0, full: 0 }, setupTimeMinutes: 90, apiComplexityScore: 6, documentationScore: 10, communityScore: 10, performanceScore: 7, typeScriptQualityScore: 10 },
    hrUseCaseRating: 6.5,
    pros: [
      { text: 'Zero discrepancy between app UI and export — they are literally the same rendered page', weight: 'critical' },
      { text: 'Microsoft-backed OSS with first-class TypeScript support (60k+ GitHub stars)', weight: 'critical' },
      { text: 'CSS controls export layout — design team owns report appearance via @media print', weight: 'significant' },
      { text: 'Zero client-side bundle impact', weight: 'significant' },
    ],
    cons: [
      { text: 'Cannot run client-side — requires Node.js server with Chromium (~280MB)', weight: 'critical' },
      { text: 'No Excel or PPTX export capability — PDF only', weight: 'critical' },
      { text: 'Latency: Chromium startup + render + print = 2–8 seconds per export', weight: 'significant' },
    ],
    bestFor: ['Server-side architectures with existing Node.js backend', 'Teams where design fidelity is non-negotiable', 'Print-on-demand compliance report portals'],
    notRecommendedFor: ['Client-side-only React SPAs', 'Excel/PPTX export requirements', 'High-frequency low-latency exports'],
    architecturalNotes: `// Express route — server-side export:
import { chromium } from 'playwright';

app.post('/api/export/pdf', async (req, res) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to your actual React report page:
  await page.goto(
    \`\${process.env.APP_URL}/report?token=\${req.headers.authorization}\`
  );
  await page.waitForLoadState('networkidle');

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
  });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  res.send(pdf);
});

// React: just fetch and open the blob — no export logic client-side.`,
  },
];
