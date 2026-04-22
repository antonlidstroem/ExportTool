import { useState, useMemo } from 'react';
import { EMPLOYEES, KPIS, DEPT_STATS } from '../data/mockData';
import { buildCSV, triggerDownload, exportToPDF, exportToXLSX, exportToPPTX, PDF_THEMES, formatCurrency } from '../utils/exportUtils';
import type { ColumnDef, Employee, KPI, DepartmentStat, ReportConfig } from '../types';
import { useApp } from '../hooks/useApp';

// ── Column definitions ────────────────────────────────────────────────────────

const ALL_EMP_COLS: ColumnDef<Employee>[] = [
  { key: 'id', label: 'ID', width: 12 },
  { key: 'firstName', label: 'First Name', width: 18 },
  { key: 'lastName', label: 'Last Name', width: 18 },
  { key: 'email', label: 'Email', width: 30 },
  { key: 'department', label: 'Department', width: 20 },
  { key: 'role', label: 'Role', width: 36 },
  { key: 'seniorityLevel', label: 'Seniority', width: 16 },
  { key: 'salary', label: 'Salary', width: 18, formatter: v => formatCurrency(Number(v)) },
  { key: 'status', label: 'Status', width: 16 },
  { key: 'performanceScore', label: 'Perf Score', width: 16, formatter: v => `${v}/5.0` },
  { key: 'startDate', label: 'Start Date', width: 18 },
];

const ALL_KPI_COLS: ColumnDef<KPI>[] = [
  { key: 'id', label: 'ID', width: 14 },
  { key: 'name', label: 'KPI Name', width: 36 },
  { key: 'department', label: 'Department', width: 22 },
  { key: 'value', label: 'Actual', width: 16, formatter: v => String(v) },
  { key: 'target', label: 'Target', width: 16, formatter: v => String(v) },
  { key: 'unit', label: 'Unit', width: 14 },
  { key: 'trend', label: 'Trend', width: 14 },
  { key: 'quarter', label: 'Quarter', width: 14 },
];

const ALL_DEPT_COLS: ColumnDef<DepartmentStat>[] = [
  { key: 'department', label: 'Department', width: 22 },
  { key: 'headCount', label: 'Headcount', width: 16, formatter: v => String(v) },
  { key: 'avgSalary', label: 'Avg Salary', width: 20, formatter: v => formatCurrency(Number(v)) },
  { key: 'totalPayroll', label: 'Total Payroll', width: 22, formatter: v => formatCurrency(Number(v)) },
  { key: 'avgPerformanceScore', label: 'Avg Score', width: 18, formatter: v => `${v}/5.0` },
  { key: 'turnoverRate', label: 'Turnover %', width: 18, formatter: v => `${v}%` },
];

const DEFAULT_CONFIG: ReportConfig = {
  title: 'Lidstroem HR Report',
  subtitle: 'People & Culture · Confidential',
  preparedBy: 'HR Intelligence Platform',
  department: 'All',
  format: 'pdf',
  pdfTheme: 'corporate',
  columns: ['firstName','lastName','department','role','salary','status','performanceScore'],
  departmentFilter: 'All',
  statusFilter: 'All',
};

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'HR', 'Finance', 'Sales'];

export const Playground = () => {
  const { notify } = useApp();
  const [config, setConfig] = useState<ReportConfig>(DEFAULT_CONFIG);
  const [dataset, setDataset] = useState<'employees' | 'kpis' | 'departments'>('employees');
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof ReportConfig>(k: K, v: ReportConfig[K]) => setConfig(prev => ({ ...prev, [k]: v }));

  const toggleColumn = (key: string) => {
    set('columns', config.columns.includes(key)
      ? config.columns.filter(c => c !== key)
      : [...config.columns, key]);
  };

  // Active column defs based on selection
  const activeCols = useMemo(() => {
    if (dataset === 'employees') return ALL_EMP_COLS.filter(c => config.columns.includes(c.key as string));
    if (dataset === 'kpis') return ALL_KPI_COLS;
    return ALL_DEPT_COLS;
  }, [dataset, config.columns]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (dataset !== 'employees') return dataset === 'kpis' ? KPIS : DEPT_STATS;
    return EMPLOYEES.filter(e => {
      if (config.departmentFilter !== 'All' && e.department !== config.departmentFilter) return false;
      if (config.statusFilter !== 'All' && e.status !== config.statusFilter) return false;
      return true;
    });
  }, [dataset, config.departmentFilter, config.statusFilter]);

  const selectedTheme = PDF_THEMES.find(t => t.id === config.pdfTheme) || PDF_THEMES[0];

  const handleExport = async () => {
    setLoading(true);
    try {
      if (config.format === 'csv') {
        const csv = buildCSV(filteredData as object[], activeCols as ColumnDef<object>[]);
        triggerDownload(csv, `${config.title.replace(/\s+/g,'_').toLowerCase()}.csv`, 'text/csv;charset=utf-8;');
        notify(`CSV exported — ${filteredData.length} rows, ${activeCols.length} columns`, 'success');
      } else if (config.format === 'pdf') {
        await exportToPDF({ data: filteredData as object[], columns: activeCols as ColumnDef<object>[], title: config.title, subtitle: config.subtitle, preparedBy: config.preparedBy, theme: selectedTheme });
        notify(`PDF exported — "${config.title}" · ${selectedTheme.name} theme`, 'success');
      } else if (config.format === 'xlsx') {
        await exportToXLSX({ data: filteredData as object[], columns: activeCols as ColumnDef<object>[], title: config.title, sheetName: dataset === 'employees' ? 'Employees' : dataset === 'kpis' ? 'KPIs' : 'Departments' });
        notify(`Excel exported — ${filteredData.length} rows with formatted headers`, 'success');
      } else if (config.format === 'pptx') {
        await exportToPPTX({ data: filteredData as object[], columns: activeCols as ColumnDef<object>[], title: config.title, subtitle: config.subtitle });
        notify(`PPTX exported — ${filteredData.length} rows across slide deck`, 'success');
      }
    } catch (e) {
      notify('Export failed — check browser console', 'error');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const allColKeys = dataset === 'employees' ? ALL_EMP_COLS.map(c => c.key as string) : [];

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Interactive Lab</div>
        <h1 className="page-title">Export <em>Playground</em></h1>
        <p className="page-subtitle">Build and download real exports — PDF with themes, formatted Excel, PPTX slides, or CSV. All client-side, zero server.</p>
      </div>

      <div className="page-body">
        <div className="row g-4">

          {/* LEFT: Configuration panel */}
          <div className="col-lg-4">

            {/* 1. Dataset */}
            <div className="card-dark mb-3">
              <div className="card-dark-header"><span className="card-dark-title">1. Dataset</span></div>
              <div className="card-dark-body" style={{ display:'flex', gap:6 }}>
                {(['employees','kpis','departments'] as const).map(d => (
                  <button key={d} onClick={() => { setDataset(d); if (d !== 'employees') set('columns', []); }}
                    style={{ flex:1, padding:'8px 4px', borderRadius:4, cursor:'pointer', fontSize:10, fontFamily:'var(--font-mono)',
                      background: dataset === d ? 'var(--cyan)' : 'transparent',
                      border: `1px solid ${dataset === d ? 'var(--cyan)' : 'var(--border)'}`,
                      color: dataset === d ? 'var(--navy-950)' : 'var(--text-secondary)' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Filters (employees only) */}
            {dataset === 'employees' && (
              <div className="card-dark mb-3">
                <div className="card-dark-header"><span className="card-dark-title">2. Filters</span></div>
                <div className="card-dark-body">
                  <div className="mb-2">
                    <label className="form-label">Department</label>
                    <select className="form-select" value={config.departmentFilter} onChange={e => set('departmentFilter', e.target.value)}>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select className="form-select" value={config.statusFilter} onChange={e => set('statusFilter', e.target.value)}>
                      {['All','active','on-leave','inactive'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--cyan)', marginTop:10 }}>
                    {filteredData.length} of {EMPLOYEES.length} employees
                  </div>
                </div>
              </div>
            )}

            {/* 3. Columns (employees only) */}
            {dataset === 'employees' && (
              <div className="card-dark mb-3">
                <div className="card-dark-header">
                  <span className="card-dark-title">3. Columns</span>
                  <button onClick={() => set('columns', allColKeys)} style={{ background:'none', border:'none', fontFamily:'var(--font-mono)', fontSize:9, color:'var(--cyan)', cursor:'pointer' }}>select all</button>
                </div>
                <div className="card-dark-body" style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {ALL_EMP_COLS.map(c => {
                    const active = config.columns.includes(c.key as string);
                    return (
                      <button key={String(c.key)} onClick={() => toggleColumn(c.key as string)}
                        style={{ padding:'4px 10px', borderRadius:3, fontSize:10, fontFamily:'var(--font-mono)', cursor:'pointer',
                          background: active ? 'var(--cyan-glow)' : 'transparent',
                          border: `1px solid ${active ? 'var(--border-bright)' : 'var(--border)'}`,
                          color: active ? 'var(--cyan)' : 'var(--text-muted)' }}>
                        {active ? '✓ ' : ''}{c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Format */}
            <div className="card-dark mb-3">
              <div className="card-dark-header"><span className="card-dark-title">4. Format</span></div>
              <div className="card-dark-body" style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {(['pdf','xlsx','pptx','csv'] as const).map(f => (
                  <button key={f} onClick={() => set('format', f)}
                    style={{ padding:'8px 14px', borderRadius:4, fontSize:11, fontFamily:'var(--font-mono)', cursor:'pointer', textTransform:'uppercase',
                      background: config.format === f ? 'var(--cyan)' : 'transparent',
                      border: `1px solid ${config.format === f ? 'var(--cyan)' : 'var(--border)'}`,
                      color: config.format === f ? 'var(--navy-950)' : 'var(--text-secondary)', fontWeight: config.format === f ? 700 : 400 }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. PDF Theme (if pdf) */}
            {config.format === 'pdf' && (
              <div className="card-dark mb-3">
                <div className="card-dark-header"><span className="card-dark-title">5. PDF Theme</span></div>
                <div className="card-dark-body" style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {PDF_THEMES.map(t => (
                    <div key={t.id} onClick={() => set('pdfTheme', t.id)}
                      style={{ padding:'10px 14px', borderRadius:5, cursor:'pointer', transition:'all 0.15s',
                        border: `1px solid ${config.pdfTheme === t.id ? 'var(--border-bright)' : 'var(--border)'}`,
                        background: config.pdfTheme === t.id ? 'var(--cyan-glow)' : 'transparent',
                        display:'flex', alignItems:'center', gap:12 }}>
                      {/* Color swatches */}
                      <div style={{ display:'flex', gap:3, flexShrink:0 }}>
                        <div style={{ width:14, height:14, borderRadius:2, background:t.headerBg, border:'1px solid rgba(255,255,255,0.1)' }} />
                        <div style={{ width:14, height:14, borderRadius:2, background:t.accentColor }} />
                        <div style={{ width:14, height:14, borderRadius:2, background:t.altRowBg, border:'1px solid rgba(0,0,0,0.1)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:500, color: config.pdfTheme === t.id ? 'var(--cyan)' : 'var(--text-primary)' }}>{t.name}</div>
                        <div style={{ fontSize:10, color:'var(--text-muted)' }}>{t.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Metadata */}
            <div className="card-dark mb-4">
              <div className="card-dark-header"><span className="card-dark-title">6. Report Metadata</span></div>
              <div className="card-dark-body">
                {(['title','subtitle','preparedBy'] as const).map(field => (
                  <div key={field} className="mb-2">
                    <label className="form-label">{field.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</label>
                    <input className="form-control" value={config[field]}
                      onChange={e => set(field, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-cyber-filled w-100" onClick={handleExport} disabled={loading || (dataset === 'employees' && activeCols.length === 0)}
              style={{ padding:'14px', fontSize:13 }}>
              {loading ? '⏳ Generating…' : `↓ Export ${config.format.toUpperCase()} · ${filteredData.length} rows`}
            </button>
            {dataset === 'employees' && activeCols.length === 0 && (
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--amber)', textAlign:'center', marginTop:8 }}>Select at least one column</div>
            )}
          </div>

          {/* RIGHT: Live preview */}
          <div className="col-lg-8">
            {/* Theme preview (PDF only) */}
            {config.format === 'pdf' && (
              <div className="card-dark mb-4">
                <div className="card-dark-header">
                  <span className="card-dark-title">PDF Preview — {selectedTheme.name}</span>
                  {selectedTheme.hasCoverPage && <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--cyan)' }}>✓ Cover Page</span>}
                </div>
                <div style={{ background: selectedTheme.bodyBg, borderRadius:'0 0 8px 8px', overflow:'hidden' }}>
                  {/* Mock cover if applicable */}
                  {selectedTheme.hasCoverPage && (
                    <div style={{ background: selectedTheme.headerBg, padding:'24px 32px', borderLeft:`6px solid ${selectedTheme.accentColor}` }}>
                      <div style={{ fontFamily:'monospace', fontSize:18, fontWeight:700, color: selectedTheme.headerText, marginBottom:4 }}>{config.title}</div>
                      <div style={{ fontFamily:'monospace', fontSize:11, color: selectedTheme.accentColor }}>{config.subtitle}</div>
                      <div style={{ fontFamily:'monospace', fontSize:9, color:'#8ba3be', marginTop:12 }}>Prepared by: {config.preparedBy} · {new Date().toLocaleDateString()}</div>
                    </div>
                  )}
                  {/* Mock table header */}
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr>
                          {activeCols.map(c => (
                            <th key={String(c.key)} style={{ padding:'8px 12px', background: selectedTheme.headerBg, color: selectedTheme.headerText, fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:0.5, textAlign:'left', whiteSpace:'nowrap' }}>
                              {c.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as Employee[]).slice(0, 6).map((row, ri) => (
                          <tr key={ri}>
                            {activeCols.map(c => (
                              <td key={String(c.key)} style={{ padding:'7px 12px', borderBottom:`1px solid ${selectedTheme.borderColor}`, fontSize:11, fontFamily:'monospace', background: ri % 2 === 1 ? selectedTheme.altRowBg : selectedTheme.bodyBg, color: selectedTheme.bodyBg === '#ffffff' || selectedTheme.bodyBg === '#fafafa' ? '#1a1a2e' : '#e2eaf4', whiteSpace:'nowrap' }}>
                                {(() => { const raw = (row as unknown as Record<string, unknown>)[c.key as string]; return c.formatter ? c.formatter(raw as never) : (raw == null ? '' : String(raw)); })()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredData.length > 6 && (
                      <div style={{ padding:'8px 12px', fontFamily:'monospace', fontSize:9, color:'#999', background: selectedTheme.altRowBg }}>
                        + {filteredData.length - 6} more rows in export
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Data table preview for non-PDF */}
            {config.format !== 'pdf' && (
              <div className="card-dark mb-4">
                <div className="card-dark-header">
                  <span className="card-dark-title">Data Preview — {filteredData.length} rows · {activeCols.length} columns</span>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table className="hr-table">
                    <thead>
                      <tr>{activeCols.slice(0,8).map(c => <th key={String(c.key)}>{c.label}</th>)}</tr>
                    </thead>
                    <tbody>
                      {(filteredData as unknown as Record<string, unknown>[]).slice(0,8).map((row, i) => (
                        <tr key={i}>
                          {activeCols.slice(0,8).map(c => (
                            <td key={String(c.key)} style={{ whiteSpace:'nowrap', fontSize:11 }}>
                              {(() => { const raw = row[c.key as string]; return c.formatter ? c.formatter(raw as never) : (raw == null ? '' : String(raw)); })()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Format info card */}
            <div className="card-dark">
              <div className="card-dark-header"><span className="card-dark-title">Format Details — {config.format.toUpperCase()}</span></div>
              <div className="card-dark-body">
                {config.format === 'pdf' && <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.7, margin:0 }}>Generated via <code>jsPDF</code> + <code>jspdf-autotable</code>. Landscape A4, custom header/footer on every page{selectedTheme.hasCoverPage ? ', cover page with metadata' : ''}. Each theme applies different color schemes to header rows, alternating rows, and accent bars. This is the same API you would use to power a Syncfusion or DevExpress export callback.</p>}
                {config.format === 'xlsx' && <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.7, margin:0 }}>Generated via <code>ExcelJS</code> directly — the same library DevExtreme uses under the hood for its Excel export. Title row with branded color, subtitle row, styled column headers, alternating row fills, frozen header at row 3, and auto-filter on every column. All cell styling is strongly typed via ExcelJS's TypeScript definitions.</p>}
                {config.format === 'pptx' && <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.7, margin:0 }}>Generated via <code>pptxgenjs</code>. Title slide with accent bar, then data slides (max 18 rows per slide). Syncfusion has no browser-native PPTX library — this is the recommended pairing: use Syncfusion for PDF/Excel and pptxgenjs for presentations.</p>}
                {config.format === 'csv' && <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.7, margin:0 }}>Pure client-side CSV with RFC 4180 quoting — all special characters and commas properly escaped. Your column selection determines exactly which fields are included. Works in any spreadsheet application without any conversion step.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
