import { useState, useEffect } from 'react';
import { EMPLOYEES, KPIS } from '../data/mockData';
import { exportToPDF, PDF_THEMES } from '../utils/exportUtils';
import type { ColumnDef, Employee, KPI } from '../types';
import { useApp } from '../hooks/useApp';

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; padding: 32px; background: #fff; }
  .header { background: #0a1929; color: white; padding: 24px 32px; margin: -32px -32px 32px; }
  .title { font-size: 24px; font-weight: 600; }
  .subtitle { font-size: 12px; color: #00d4ff; margin-top: 4px; }
  .meta { font-size: 10px; color: #8ba3be; margin-top: 8px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #0a1929; color: #00d4ff; padding: 10px 12px;
       font-size: 9px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
  td { padding: 9px 12px; border-bottom: 1px solid #e8ecf0; font-size: 11px; }
  tr:nth-child(even) td { background: #f8fafc; }
  .badge { display:inline-block; padding:2px 8px; border-radius:3px; font-size:9px;
           font-weight:600; text-transform:uppercase; }
  .badge-active { background:#dcfce7; color:#166534; }
  .badge-leave { background:#fef3c7; color:#92400e; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">{{title}}</div>
    <div class="subtitle">{{subtitle}}</div>
    <div class="meta">Generated {{generatedAt}} · {{employees.length}} records</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Name</th><th>Department</th><th>Role</th>
        <th>Salary</th><th>Status</th><th>Score</th>
      </tr>
    </thead>
    <tbody>
      {{#each employees}}
      <tr>
        <td><strong>{{firstName}} {{lastName}}</strong><br>
            <small style="color:#666">{{email}}</small></td>
        <td>{{department}}</td>
        <td>{{role}}</td>
        <td style="font-family:monospace">\${{salary}}</td>
        <td><span class="badge badge-{{status}}">{{status}}</span></td>
        <td style="font-family:monospace">{{performanceScore}}/5</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>
</html>`;

const EMP_COLS: ColumnDef<Employee>[] = [
  { key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' },
  { key: 'department', label: 'Department' }, { key: 'role', label: 'Role' },
  { key: 'salary', label: 'Salary', formatter: v => '$' + Number(v).toLocaleString() },
  { key: 'status', label: 'Status' }, { key: 'performanceScore', label: 'Score', formatter: v => `${v}/5` },
];

const KPI_COLS: ColumnDef<KPI>[] = [
  { key: 'name', label: 'KPI' }, { key: 'department', label: 'Department' },
  { key: 'value', label: 'Actual', formatter: v => String(v) },
  { key: 'target', label: 'Target', formatter: v => String(v) },
  { key: 'unit', label: 'Unit' }, { key: 'trend', label: 'Trend' },
];

const SERVER_CODE = `// Node.js + Express server route:
import jsreport from '@jsreport/nodejs-client';

const client = jsreport('https://your-jsreport-server');

app.post('/api/export/employees', async (req, res) => {
  const { employees } = req.body as { employees: Employee[] };

  const report = await client.render({
    template: { name: 'employee-directory' }, // stored in jsreport Studio
    data: {
      title: 'Lidstroem — Employee Directory',
      subtitle: 'People & Culture · Confidential',
      generatedAt: new Date().toLocaleString(),
      employees,
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="employees.pdf"');
  report.result.pipe(res); // stream PDF binary to client
});

// React client — zero export logic needed:
const exportPDF = async () => {
  const res = await fetch('/api/export/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employees: filteredData }),
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url); // opens in browser PDF viewer
};`;

export const JsreportPage = () => {
  const { notify } = useApp();
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [previewHtml, setPreviewHtml] = useState('');
  const [dataset, setDataset] = useState<'employees' | 'kpis'>('employees');
  const [themeId, setThemeId] = useState('corporate');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showServer, setShowServer] = useState(false);

  // Live preview: merge template with data
  useEffect(() => {
    let rendered = template;
    const data = {
      title: 'Lidstroem HR Report',
      subtitle: dataset === 'employees' ? 'Employee Directory · Q4 2024' : 'KPI Dashboard · Q4 2024',
      generatedAt: new Date().toLocaleString(),
      employees: EMPLOYEES,
    };
    rendered = rendered.replace(/{{title}}/g, data.title);
    rendered = rendered.replace(/{{subtitle}}/g, data.subtitle);
    rendered = rendered.replace(/{{generatedAt}}/g, data.generatedAt);
    rendered = rendered.replace(/{{employees\.length}}/g, String(data.employees.length));

    // Handle {{#each employees}} ... {{/each}}
    const eachMatch = rendered.match(/{{#each employees}}([\s\S]*?){{\/each}}/);
    if (eachMatch) {
      const rowTemplate = eachMatch[1];
      const rows = data.employees.map(emp => {
        let row = rowTemplate;
        row = row.replace(/{{firstName}}/g, emp.firstName);
        row = row.replace(/{{lastName}}/g, emp.lastName);
        row = row.replace(/{{email}}/g, emp.email);
        row = row.replace(/{{department}}/g, emp.department);
        row = row.replace(/{{role}}/g, emp.role);
        row = row.replace(/\${{salary}}/g, '$' + emp.salary.toLocaleString());
        row = row.replace(/{{salary}}/g, String(emp.salary));
        row = row.replace(/{{status}}/g, emp.status);
        row = row.replace(/{{performanceScore}}/g, String(emp.performanceScore));
        return row;
      }).join('');
      rendered = rendered.replace(/{{#each employees}}[\s\S]*?{{\/each}}/, rows);
    }
    setPreviewHtml(rendered);
  }, [template, dataset]);

  const handleStandInPDF = async () => {
    setPdfLoading(true);
    const theme = PDF_THEMES.find(t => t.id === themeId) || PDF_THEMES[0];
    try {
      if (dataset === 'employees') {
        await exportToPDF({ data: EMPLOYEES, columns: EMP_COLS, title: 'Lidstroem — Employee Directory', subtitle: 'jsreport stand-in export · jsPDF rendered', preparedBy: 'Lidstroem HR', theme });
      } else {
        await exportToPDF({ data: KPIS, columns: KPI_COLS, title: 'Lidstroem — KPI Dashboard', subtitle: 'jsreport stand-in export · jsPDF rendered', preparedBy: 'Lidstroem HR', theme });
      }
      notify('Stand-in PDF exported via jsPDF — in production this would be a jsreport Chrome render', 'info');
    } catch (e) { notify('Export failed', 'error'); } finally { setPdfLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow" style={{ color: '#0078D4' }}>Reporting Engine · Server-Side</div>
        <h1 className="page-title">jsreport <em>Template Studio</em></h1>
        <p className="page-subtitle">
          Edit the Handlebars template below and watch it render live. In production, this template runs through Chromium on your Node.js server — producing pixel-perfect PDFs.
        </p>
      </div>

      <div className="page-body">
        {/* Architecture banner */}
        <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'12px 16px', marginBottom:20, fontSize:12 }}>
          <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <span style={{ color:'var(--red)', fontSize:16, flexShrink:0 }}>🖥</span>
            <div>
              <strong style={{ color:'var(--text-primary)' }}>Server-side rendering required.</strong>
              <span style={{ color:'var(--text-secondary)', marginLeft:6 }}>
                jsreport cannot run in the browser. The template editor below simulates the experience — the "Export Stand-in PDF" button uses jsPDF as a client-side approximation.
                In a real deployment, this template would render through Chromium on your Node.js server.
              </span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left: Template editor + controls */}
          <div className="col-lg-5">
            <div className="card-dark mb-3">
              <div className="card-dark-header">
                <span className="card-dark-title">Handlebars Template Editor</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'#0078D4' }}>Live Preview →</span>
              </div>
              <div className="card-dark-body" style={{ padding:0 }}>
                <textarea
                  value={template}
                  onChange={e => setTemplate(e.target.value)}
                  spellCheck={false}
                  style={{
                    width:'100%', minHeight:420, padding:16,
                    background:'#02080f', color:'#a8c7fa',
                    fontFamily:'var(--font-mono)', fontSize:11, lineHeight:1.6,
                    border:'none', outline:'none', resize:'vertical',
                    borderRadius:'0 0 8px 8px',
                  }}
                />
              </div>
            </div>

            <div className="card-dark">
              <div className="card-dark-header"><span className="card-dark-title">Export Stand-in (jsPDF)</span></div>
              <div className="card-dark-body">
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Dataset</label>
                    <select className="form-select" value={dataset} onChange={e => setDataset(e.target.value as 'employees' | 'kpis')}>
                      <option value="employees">Employees (15)</option>
                      <option value="kpis">KPIs (12)</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">PDF Theme</label>
                    <select className="form-select" value={themeId} onChange={e => setThemeId(e.target.value)}>
                      {PDF_THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn-cyber-filled w-100" onClick={handleStandInPDF} disabled={pdfLoading}
                  style={{ background:'#0078D4', border:'none' }}>
                  {pdfLoading ? '⏳ Generating…' : '↓ Export Stand-in PDF (jsPDF)'}
                </button>
                <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:8, marginBottom:0 }}>
                  This approximates jsreport output. Real jsreport would match your HTML template exactly via Chrome rendering.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="col-lg-7">
            <div className="card-dark" style={{ height:'100%' }}>
              <div className="card-dark-header">
                <span className="card-dark-title">Live HTML Preview</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)' }}>Updates on each keystroke</span>
              </div>
              <div style={{ background:'#fff', borderRadius:'0 0 8px 8px', overflow:'hidden', height: 680 }}>
                <iframe
                  srcDoc={previewHtml}
                  style={{ width:'100%', height:'100%', border:'none' }}
                  title="jsreport template preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Server code */}
        <div className="card-dark mt-4">
          <div className="card-dark-header" style={{ cursor:'pointer' }} onClick={() => setShowServer(s => !s)}>
            <span className="card-dark-title">Node.js Server Integration Code</span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'#0078D4', cursor:'pointer' }}>
              {showServer ? '▲ collapse' : '▼ expand'}
            </span>
          </div>
          {showServer && (
            <div className="card-dark-body">
              <pre style={{ margin:0, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-secondary)', lineHeight:1.7, overflowX:'auto', whiteSpace:'pre-wrap' }}>
                {SERVER_CODE}
              </pre>
            </div>
          )}
        </div>

        {/* Benchmarks */}
        <div className="row g-3 mt-3">
          {[
            { label: 'PDF Fidelity', val: '10/10 (Chrome)', raw: true },
            { label: 'Client Bundle', val: '~12 KB', raw: true },
            { label: 'Setup Time', val: '120 min (server)', raw: true },
            { label: 'HR Score', val: '7.2 / 10', raw: true },
          ].map(m => (
            <div key={m.label} className="col-6 col-md-3">
              <div className="metric-card" style={{ borderTop:'2px solid #0078D4' }}>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={{ fontSize:18 }}>{m.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
