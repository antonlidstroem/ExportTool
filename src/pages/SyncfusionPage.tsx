import { useRef, useState } from 'react';
import {
  GridComponent, ColumnsDirective, ColumnDirective,
  Inject, PdfExport, ExcelExport, Toolbar, Filter, Sort, Page as GridPage,
  type GridModel,
  type PdfExportProperties,
  type ExcelExportProperties,
} from '@syncfusion/ej2-react-grids';
import type { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { EMPLOYEES } from '../data/mockData';
import { exportToPPTX } from '../utils/exportUtils';
import type { Employee, ColumnDef } from '../types';
import { useApp } from '../hooks/useApp';
import '@syncfusion/ej2-base/styles/material-dark.css';
import '@syncfusion/ej2-react-grids/styles/material-dark.css';

const PPTX_COLS: ColumnDef<Employee>[] = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'salary', label: 'Salary', formatter: v => '$' + Number(v).toLocaleString() },
  { key: 'seniorityLevel', label: 'Level' },
  { key: 'status', label: 'Status' },
  { key: 'performanceScore', label: 'Score', formatter: v => `${v}/5` },
];

const CODE = `import {
  GridComponent, ColumnsDirective, ColumnDirective,
  Inject, PdfExport, ExcelExport, Toolbar,
} from '@syncfusion/ej2-react-grids';
import type {
  PdfExportProperties,
  ExcelExportProperties,
} from '@syncfusion/ej2-react-grids';
import type { ClickEventArgs } from '@syncfusion/ej2-navigations';

const gridRef = useRef<GridComponent>(null);

const onToolbarClick = (args: ClickEventArgs) => {
  const id = args.item.id ?? '';

  if (id.includes('pdfexport')) {
    const props: PdfExportProperties = {
      pageOrientation: 'Landscape',
      fileName: 'hr_employees.pdf',
      theme: {
        header: { bold: true, fontColor: '#FFFFFF', fontSize: 11 },
        record: { fontColor: '#1a1a2e', fontSize: 9 },
      },
      header: {
        fromTop: 0, height: 50,
        contents: [{ type: 'Text', value: 'Lidstroem HR Export',
          position: { x: 0, y: 10 },
          style: { textBrushColor: '#ffffff', fontSize: 14 } }]
      },
    };
    gridRef.current?.pdfExport(props);
  }

  if (id.includes('excelexport')) {
    const props: ExcelExportProperties = {
      fileName: 'hr_employees.xlsx',
      header: {
        headerRows: 2,
        rows: [
          { cells: [{ colSpan: 9, value: 'Lidstroem HR — Employee Directory',
            style: { bold: true, fontSize: 14,
              backColor: '#0a1929', fontColor: '#00d4ff' } }] },
          { cells: [{ colSpan: 9,
            value: \`Generated \${new Date().toLocaleDateString()} · \${employees.length} employees\`,
            style: { italic: true, fontSize: 9 } }] },
        ]
      },
    };
    gridRef.current?.excelExport(props);
  }
};

<GridComponent ref={gridRef} dataSource={employees}
  toolbar={['PdfExport', 'ExcelExport', 'Search']}
  allowPdfExport={true} allowExcelExport={true}
  toolbarClick={onToolbarClick}
  allowFiltering={true} filterSettings={{ type: 'Excel' }}
  allowSorting={true} allowPaging={true}
  pageSettings={{ pageSize: 8 }}>
  <ColumnsDirective>
    <ColumnDirective field="firstName" headerText="First Name" width="120" />
    <ColumnDirective field="salary" headerText="Salary" format="C0" textAlign="Right" />
  </ColumnsDirective>
  <Inject services={[PdfExport, ExcelExport, Toolbar, Filter, Sort, GridPage]} />
</GridComponent>`;

export const SyncfusionPage = () => {
  const gridRef = useRef<GridComponent>(null);
  const { notify } = useApp();
  const [pptxLoading, setPptxLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [pdfTheme, setPdfTheme] = useState<'dark' | 'light'>('dark');

  const onToolbarClick = (args: ClickEventArgs) => {
    const id = args.item.id ?? '';

    if (id.includes('pdfexport')) {
      const isDark = pdfTheme === 'dark';
      const props: PdfExportProperties = {
        pageOrientation: 'Landscape',
        fileName: 'Lidstroem_employees_syncfusion.pdf',
        theme: {
          header: {
            bold: true,
            fontColor: isDark ? '#ffffff' : '#0a1929',
            fontSize: 10,
          },
          record: { fontColor: isDark ? '#1a1a2e' : '#334155', fontSize: 9 },
          caption: { bold: true, fontColor: '#0a2540' },
        },
        header: {
          fromTop: 0,
          height: 50,
          contents: [
            {
              type: 'Text',
              value: 'Lidstroem HR — Employee Directory',
              position: { x: 0, y: 10 },
              style: { textBrushColor: '#ffffff', fontSize: 13 },
            },
          ],
        },
        footer: {
          fromBottom: 10,
          height: 30,
          contents: [
            {
              type: 'Text',
              value: 'Confidential — Lidstroem People & Culture',
              position: { x: 0, y: 10 },
              style: { textBrushColor: '#888888', fontSize: 8 },
            },
            {
              type: 'PageNumber',
              pageNumberType: 'Arabic',
              format: 'Page {$current} of {$total}',
              position: { x: 580, y: 10 },
              style: { textBrushColor: '#888888', fontSize: 8 },
            },
          ],
        },
      };
      gridRef.current?.pdfExport(props);
      notify('Syncfusion PDF export → real ej2-pdf-export API called on the grid ref', 'success');
    }

    if (id.includes('excelexport')) {
      const props: ExcelExportProperties = {
        fileName: 'Lidstroem_employees_syncfusion.xlsx',
        header: {
          headerRows: 2,
          rows: [
            {
              cells: [{
                colSpan: 9,
                value: 'Lidstroem HR — Employee Directory',
                style: { bold: true, fontSize: 14, backColor: '#0a1929', fontColor: '#00d4ff' },
              }],
            },
            {
              cells: [{
                colSpan: 9,
                value: `Generated ${new Date().toLocaleDateString()} · ${EMPLOYEES.length} employees`,
                style: { italic: true, fontSize: 9, backColor: '#0d2137', fontColor: '#8ba3be' },
              }],
            },
          ],
        },
        footer: {
          footerRows: 1,
          rows: [{
            cells: [{
              colSpan: 9,
              value: 'Confidential — Lidstroem People & Culture',
              style: { fontSize: 8 },
            }],
          }],
        },
      };
      gridRef.current?.excelExport(props);
      notify('Syncfusion Excel export → real ExcelExport API with styled header rows', 'success');
    }
  };

  const handlePPTX = async () => {
    setPptxLoading(true);
    try {
      await exportToPPTX({
        data: EMPLOYEES,
        columns: PPTX_COLS,
        title: 'Lidstroem Employee Directory',
        subtitle: `Q4 2024 · ${EMPLOYEES.length} employees across 7 departments`,
        accentColor: '#FF6800',
      });
      notify('PPTX generated — pptxgenjs created a real .pptx with title slide + data slides', 'success');
    } catch (e) {
      notify('PPTX export failed — check console', 'error');
      console.error(e);
    } finally {
      setPptxLoading(false);
    }
  };

  const gridOptions: GridModel = {
    allowPdfExport: true,
    allowExcelExport: true,
    allowFiltering: true,
    allowSorting: true,
    allowPaging: true,
    pageSettings: { pageSize: 8 },
    filterSettings: { type: 'Excel' },
    toolbar: ['PdfExport', 'ExcelExport', 'Search'],
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow" style={{ color: '#FF6800' }}>Component Suite · Live Demo</div>
        <h1 className="page-title">Syncfusion <em>EJ2 React Grid</em></h1>
        <p className="page-subtitle">
          The real <code>@syncfusion/ej2-react-grids</code> component running in your browser.
          Use the toolbar to trigger PDF and Excel exports via the actual Syncfusion API.
          PPTX uses pptxgenjs — Syncfusion has no browser-native PowerPoint library.
        </p>
      </div>

      <div className="page-body">
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 6, padding: '10px 16px', marginBottom: 20,
          display: 'flex', gap: 10, fontSize: 12, color: 'var(--amber)',
        }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>⚠</span>
          <span>
            Syncfusion shows a <strong>watermark</strong> without a license key — functionality is fully intact.
            A free Community License is available at <strong>syncfusion.com</strong> for companies under $1M revenue.
          </span>
        </div>

        {/* Controls */}
        <div className="card-dark mb-4">
          <div className="card-dark-header">
            <span className="card-dark-title">Export Controls</span>
          </div>
          <div className="card-dark-body">
            <div className="row g-3 align-items-end">
              <div className="col-auto">
                <label className="form-label">PDF Colour Theme</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['dark', 'light'] as const).map(t => (
                    <button key={t} onClick={() => setPdfTheme(t)} style={{
                      padding: '6px 16px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                      fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                      background: pdfTheme === t ? '#FF6800' : 'transparent',
                      border: `1px solid ${pdfTheme === t ? '#FF6800' : 'var(--border)'}`,
                      color: pdfTheme === t ? '#fff' : 'var(--text-secondary)',
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-auto" style={{ marginLeft: 'auto' }}>
                <button onClick={handlePPTX} disabled={pptxLoading}
                  className="btn-cyber-filled" style={{ background: '#FF6800', border: 'none' }}>
                  {pptxLoading ? '⏳ Building…' : '▶ Export PPTX (pptxgenjs)'}
                </button>
              </div>
              <div className="col-auto">
                <button onClick={() => setShowCode(s => !s)} className="btn-cyber">
                  {showCode ? '▲ Hide Code' : '{ } Show TypeScript'}
                </button>
              </div>
            </div>
            <div style={{
              marginTop: 12, padding: '8px 12px', background: 'rgba(0,0,0,0.2)',
              borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            }}>
              PDF / Excel → use the <span style={{ color: '#FF6800' }}>PdfExport</span> and{' '}
              <span style={{ color: '#FF6800' }}>ExcelExport</span> buttons in the grid toolbar below
            </div>
          </div>
        </div>

        {showCode && (
          <div className="card-dark mb-4">
            <div className="card-dark-header">
              <span className="card-dark-title">TypeScript Integration Code</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#FF6800' }}>
                @syncfusion/ej2-react-grids v26.x
              </span>
            </div>
            <div className="card-dark-body" style={{ padding: 0 }}>
              <pre style={{
                margin: 0, padding: 20,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-secondary)', lineHeight: 1.7,
                overflowX: 'auto', whiteSpace: 'pre-wrap',
                background: 'rgba(2,8,15,0.6)',
              }}>
                {CODE}
              </pre>
            </div>
          </div>
        )}

        {/* Live Syncfusion Grid */}
        <div className="card-dark">
          <div className="card-dark-header">
            <span className="card-dark-title">
              Live DataGrid — {EMPLOYEES.length} employees · Sort, filter, page, then export
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--cyan)' }}>
              @syncfusion/ej2-react-grids v26.x
            </span>
          </div>
          <div style={{ padding: 16, overflowX: 'auto' }}>
            <GridComponent
              ref={gridRef}
              dataSource={EMPLOYEES}
              toolbarClick={onToolbarClick}
              {...gridOptions}
            >
              <ColumnsDirective>
                <ColumnDirective field="id" headerText="ID" width="90" />
                <ColumnDirective field="firstName" headerText="First Name" width="110" />
                <ColumnDirective field="lastName" headerText="Last Name" width="110" />
                <ColumnDirective field="department" headerText="Department" width="130" />
                <ColumnDirective field="role" headerText="Role" width="200" />
                <ColumnDirective field="salary" headerText="Salary" width="110" format="C0" textAlign="Right" />
                <ColumnDirective field="seniorityLevel" headerText="Level" width="90" />
                <ColumnDirective field="status" headerText="Status" width="100" />
                <ColumnDirective field="performanceScore" headerText="Score" width="80" format="N1" textAlign="Right" />
              </ColumnsDirective>
              <Inject services={[PdfExport, ExcelExport, Toolbar, Filter, Sort, GridPage]} />
            </GridComponent>
          </div>
        </div>

        {/* Metrics */}
        <div className="row g-3 mt-3">
          {[
            { label: 'TypeScript Quality', val: '9 / 10' },
            { label: 'Documentation', val: '9 / 10' },
            { label: 'Bundle (gzip)', val: '420 KB' },
            { label: 'HR Use Case Score', val: '8.8 / 10' },
          ].map(m => (
            <div key={m.label} className="col-6 col-md-3">
              <div className="metric-card" style={{ borderTop: '2px solid #FF6800' }}>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={{ fontSize: 22 }}>{m.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
