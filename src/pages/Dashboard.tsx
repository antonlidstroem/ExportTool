import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { TOOLS, EMPLOYEES, DEPT_STATS, KPIS } from '../data/mockData';
import { formatCurrency } from '../utils/exportUtils';
import { useApp } from '../hooks/useApp';
import type { Tool, Page } from '../types';

// ── Mini benchmark radar per tool ─────────────────────────────────────────────
const radarData = (tool: Tool) => [
  { axis: 'TypeScript', val: tool.benchmark.typeScriptQualityScore },
  { axis: 'Docs',       val: tool.benchmark.documentationScore },
  { axis: 'Perf',       val: tool.benchmark.performanceScore },
  { axis: 'Community',  val: tool.benchmark.communityScore },
  { axis: 'Simplicity', val: 10 - tool.benchmark.apiComplexityScore },
];

const CRITERIA = [
  { key: 'typeScriptQualityScore', label: 'TypeScript',  higherBetter: true  },
  { key: 'documentationScore',     label: 'Docs',        higherBetter: true  },
  { key: 'performanceScore',       label: 'Performance', higherBetter: true  },
  { key: 'communityScore',         label: 'Community',   higherBetter: true  },
  { key: 'apiComplexityScore',     label: 'API Simple',  higherBetter: false },
] as const;

function scoreClass(val: number, higherBetter: boolean) {
  const norm = higherBetter ? val : 10 - val;
  return norm >= 7.5 ? 'score-high' : norm >= 5 ? 'score-mid' : 'score-low';
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--cyan)' }}>{payload[0].value}</div>
    </div>
  );
};

export const Dashboard = () => {
  const { navigate } = useApp();

  const totalPayroll  = EMPLOYEES.reduce((s, e) => s + e.salary, 0);
  const avgPerf       = (EMPLOYEES.reduce((s, e) => s + e.performanceScore, 0) / EMPLOYEES.length).toFixed(2);
  const activeCount   = EMPLOYEES.filter(e => e.status === 'active').length;
  const onTargetKPIs  = KPIS.filter(k => k.value >= k.target).length;

  const payrollChartData = DEPT_STATS.map(d => ({
    name: d.department.slice(0, 4),
    payroll: Math.round(d.totalPayroll / 1000),
    full: d.department,
  }));

  const hrScoreData = TOOLS.map(t => ({ name: t.name.split(' ')[0], score: t.hrUseCaseRating }));

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Decision Support Tool</div>
        <h1 className="page-title">HR Export Library <em>Evaluation</em></h1>
        <p className="page-subtitle">
          Compare Syncfusion, jsreport, Telerik Kendo UI, DevExpress, and Playwright for HR data export.
          Three libraries have live interactive demos — use the sidebar to explore each one.
        </p>
      </div>

      <div className="page-body">

        {/* ── KPI row ── */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Libraries Evaluated', value: '5',             sub: '3 with live demos',          color: 'cyan'  },
            { label: 'Employees in Dataset', value: String(EMPLOYEES.length), sub: `${activeCount} active`,  color: 'green' },
            { label: 'Total Payroll',        value: formatCurrency(totalPayroll), sub: '7 departments',      color: 'amber' },
            { label: 'KPIs On Target',       value: `${onTargetKPIs} / ${KPIS.length}`, sub: `Avg perf ${avgPerf}/5`, color: 'cyan' },
          ].map(m => (
            <div key={m.label} className="col-6 col-xl-3">
              <div className={`metric-card ${m.color}`}>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value">{m.value}</div>
                <div className="metric-sub">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tool cards ── */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
          Libraries Under Evaluation — click to open
        </div>
        <div className="row g-3 mb-4">
          {TOOLS.map(tool => (
            <div key={tool.id} className="col-md-6 col-xl-4">
              <div className="tool-card-nav" onClick={() => navigate(tool.id as Page)}>
                <div className="top-bar" style={{ background: `linear-gradient(90deg, ${tool.color}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: tool.color }}>{tool.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{tool.vendor} · v{tool.version}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{tool.hrUseCaseRating}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>HR score</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px' }}>{tool.tagline}</p>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${tool.hrUseCaseRating * 10}%`, background: tool.color, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <span className={`tag-pill ${tool.capabilities.pdfExport ? 'tag-green' : 'tag-red'}`}>PDF</span>
                  <span className={`tag-pill ${tool.capabilities.excelExport ? 'tag-green' : 'tag-red'}`}>Excel</span>
                  <span className={`tag-pill ${tool.capabilities.pptxExport ? 'tag-green' : 'tag-red'}`}>PPTX</span>
                  <span className={`tag-pill ${tool.capabilities.clientSide ? 'tag-cyan' : 'tag-amber'}`}>
                    {tool.capabilities.clientSide ? 'Client-side' : 'Server-side'}
                  </span>
                  {(tool.id === 'syncfusion' || tool.id === 'devexpress') && (
                    <span className="tag-pill tag-cyan">LIVE DEMO</span>
                  )}
                  {tool.id === 'jsreports' && (
                    <span className="tag-pill tag-cyan">DEMO</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="row g-3 mb-4">
          <div className="col-lg-5">
            <div className="card-dark h-100">
              <div className="card-dark-header">
                <span className="card-dark-title">HR Use Case Score</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>out of 10</span>
              </div>
              <div className="card-dark-body" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hrScoreData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.04)' }} />
                    <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                      {TOOLS.map((t, i) => <Cell key={i} fill={t.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card-dark h-100">
              <div className="card-dark-header">
                <span className="card-dark-title">Department Payroll ($K)</span>
              </div>
              <div className="card-dark-body" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollChartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.04)' }} />
                    <Bar dataKey="payroll" fill="var(--cyan)" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card-dark h-100">
              <div className="card-dark-header">
                <span className="card-dark-title">Syncfusion Radar</span>
              </div>
              <div className="card-dark-body" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData(TOOLS[0])}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
                    <Radar dataKey="val" stroke="#FF6800" fill="#FF6800" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ── Full comparison matrix ── */}
        <div className="card-dark mb-4">
          <div className="card-dark-header">
            <span className="card-dark-title">Feature & Benchmark Matrix</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>click a library name to open its page</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>Criterion</th>
                  {TOOLS.map(t => (
                    <th key={t.id} style={{ color: t.color, cursor: 'pointer', minWidth: 110 }}
                      onClick={() => navigate(t.id as Page)}>
                      {t.name.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Capabilities */}
                {[
                  { label: 'PDF Export',        capKey: 'pdfExport'        },
                  { label: 'Excel Export',       capKey: 'excelExport'      },
                  { label: 'PPTX Export',        capKey: 'pptxExport'       },
                  { label: 'Client-side',        capKey: 'clientSide'       },
                  { label: 'Grid Component',     capKey: 'gridComponent'    },
                  { label: 'TypeScript Support', capKey: 'typescriptSupport'},
                ].map(row => (
                  <tr key={row.label}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{row.label}</td>
                    {TOOLS.map(t => {
                      const v = t.capabilities[row.capKey];
                      return (
                        <td key={t.id} style={{ textAlign: 'center' }}>
                          <span style={{ color: v ? 'var(--green)' : 'var(--red)', fontSize: 14 }}>{v ? '✓' : '✕'}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Divider */}
                <tr>
                  <td colSpan={6} style={{ padding: '4px 14px', background: 'rgba(0,212,255,0.03)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Benchmark Scores (1–10)</span>
                  </td>
                </tr>

                {CRITERIA.map(c => (
                  <tr key={c.key}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {c.label}{!c.higherBetter && <span style={{ fontSize: 8, marginLeft: 4, opacity: 0.6 }}>(lower = better)</span>}
                    </td>
                    {TOOLS.map(t => {
                      const val = t.benchmark[c.key] as number;
                      return (
                        <td key={t.id} style={{ textAlign: 'center' }}>
                          <span className={`score-pill ${scoreClass(val, c.higherBetter)}`}>{val}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Bundle size */}
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>Bundle gzip</td>
                  {TOOLS.map(t => {
                    const kb = t.benchmark.bundleSize.minGzip;
                    const cls = kb === 0 ? 'score-high' : kb < 200 ? 'score-mid' : 'score-low';
                    return (
                      <td key={t.id} style={{ textAlign: 'center' }}>
                        <span className={`score-pill ${cls}`} style={{ minWidth: 52 }}>
                          {kb === 0 ? '0 KB' : `${kb}KB`}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Pricing */}
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>Pricing Model</td>
                  {TOOLS.map(t => {
                    const colors: Record<string, string> = { 'open-source': 'var(--green)', freemium: 'var(--cyan)', commercial: 'var(--amber)' };
                    return (
                      <td key={t.id} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: colors[t.pricing.model] ?? 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {t.pricing.model}
                      </td>
                    );
                  })}
                </tr>

                {/* HR score */}
                <tr style={{ background: 'rgba(0,212,255,0.02)' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)', fontWeight: 600 }}>HR Use Case Score</td>
                  {TOOLS.map(t => (
                    <td key={t.id} style={{ textAlign: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: t.color }}>{t.hrUseCaseRating}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quick KPI grid ── */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
          Live HR Dataset — Q4 2024 KPIs
        </div>
        <div className="row g-2 mb-4">
          {KPIS.slice(0, 6).map(kpi => {
            const onTarget = kpi.value >= kpi.target;
            const pct = Math.min(100, (kpi.value / kpi.target) * 100);
            const trendIcon = kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→';
            const trendColor = kpi.trend === 'up' ? 'var(--green)' : kpi.trend === 'down' ? 'var(--red)' : 'var(--amber)';
            return (
              <div key={kpi.id} className="col-6 col-md-4 col-xl-2">
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{kpi.department}</div>
                    <span style={{ color: trendColor, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{trendIcon}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.3 }}>{kpi.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: onTarget ? 'var(--green)' : 'var(--amber)', lineHeight: 1 }}>
                    {kpi.value}<span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 2 }}>{kpi.unit}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', margin: '4px 0' }}>Target: {kpi.target}</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: onTarget ? 'var(--green)' : 'var(--amber)', borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA strip ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-cyber-filled" onClick={() => navigate('syncfusion')}>→ Try Syncfusion Live Demo</button>
          <button className="btn-cyber-filled" style={{ background: '#FF7200', border: 'none' }} onClick={() => navigate('devexpress')}>→ Try DevExpress Live Demo</button>
          <button className="btn-cyber-filled" style={{ background: '#0078D4', border: 'none' }} onClick={() => navigate('jsreports')}>→ jsreport Template Editor</button>
          <button className="btn-cyber" onClick={() => navigate('playground')}>↓ Export Playground</button>
          <button className="btn-cyber" onClick={() => navigate('decision-guide')}>⟳ Decision Guide</button>
        </div>
      </div>
    </div>
  );
};
