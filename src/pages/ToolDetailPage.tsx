import { useApp } from '../hooks/useApp';
import { TOOLS } from '../data/mockData';
import type { Page } from '../types';

interface BenchmarkBarProps { label: string; value: number; max?: number; higherBetter?: boolean; raw?: string; }

const BenchmarkBar = ({ label, value, max = 10, higherBetter = true, raw }: BenchmarkBarProps) => {
  const pct = (value / max) * 100;
  const barColor = higherBetter
    ? (value >= 7.5 ? 'var(--green)' : value >= 5 ? 'var(--amber)' : 'var(--red)')
    : (value <= 4 ? 'var(--green)' : value <= 6 ? 'var(--amber)' : 'var(--red)');
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-secondary)', width:150, flexShrink:0 }}>{label}</div>
      <div style={{ flex:1, height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: barColor, borderRadius:3, transition:'width 0.5s ease' }} />
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)', width:60, textAlign:'right' }}>
        {raw ?? value}
      </div>
    </div>
  );
};

export const ToolDetailPage = ({ toolId }: { toolId: string }) => {
  const { navigate } = useApp();
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return <div className="page-body">Tool not found.</div>;

  const isLiveDemo = toolId === 'syncfusion' || toolId === 'devexpress' || toolId === 'jsreports';

  return (
    <div>
      <div className="page-header" style={{ borderBottom:`3px solid ${tool.color}20` }}>
        <div className="page-eyebrow" style={{ color: tool.color }}>
          {tool.category === 'component-suite' ? 'Component Suite' : tool.category === 'reporting-engine' ? 'Reporting Engine' : 'Architectural Reference'}
        </div>
        <h1 className="page-title">{tool.name}</h1>
        <p className="page-subtitle">{tool.vendor} · v{tool.version} · {tool.pricing.startingPrice}</p>
        <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
          {Object.entries(tool.capabilities)
            .filter(([, v]) => typeof v === 'boolean')
            .map(([k, v]) => (
              <span key={k} style={{
                padding:'3px 10px', borderRadius:3, fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:0.5,
                background: v ? 'var(--green-dim)' : 'var(--red-dim)',
                color: v ? 'var(--green)' : 'var(--red)',
                border: `1px solid ${v ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                {v ? '✓' : '✕'} {k.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            ))}
        </div>
      </div>

      <div className="page-body">
        {/* Live Demo CTA */}
        {isLiveDemo && (
          <div style={{ background:`${tool.color}15`, border:`1px solid ${tool.color}40`, borderRadius:8, padding:'16px 20px', marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:tool.color, textTransform:'uppercase', letterSpacing:2, marginBottom:4 }}>Live Demo Available</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)' }}>This page has a dedicated interactive demo with a real working component.</div>
            </div>
            <button className="btn-cyber-filled" style={{ background:tool.color, border:'none' }}
              onClick={() => navigate(toolId as Page)}>
              → Open Live Demo
            </button>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Overview */}
            <div className="card-dark mb-4">
              <div className="card-dark-header"><span className="card-dark-title">Overview</span></div>
              <div className="card-dark-body">
                <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.8, marginBottom:16 }}>{tool.description}</p>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:10, lineHeight:2, color:'var(--text-secondary)' }}>
                  <div><span style={{ color:'var(--text-muted)' }}>Licensing: </span><span style={{ color:'var(--cyan)' }}>{tool.pricing.model}</span></div>
                  <div><span style={{ color:'var(--text-muted)' }}>Starting at: </span>{tool.pricing.startingPrice}</div>
                  {tool.pricing.freeTrialDays && <div><span style={{ color:'var(--text-muted)' }}>Free trial: </span>{tool.pricing.freeTrialDays} days</div>}
                  <div style={{ marginTop:8, fontSize:11, color:'var(--text-muted)', lineHeight:1.6 }}>{tool.pricing.notes}</div>
                </div>
              </div>
            </div>

            {/* Pros / Cons */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card-dark h-100">
                  <div className="card-dark-header"><span className="card-dark-title" style={{ color:'var(--green)' }}>✓ Advantages</span></div>
                  <div className="card-dark-body">
                    {tool.pros.map((p, i) => (
                      <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:12, lineHeight:1.5, color: p.weight === 'critical' ? 'var(--text-primary)' : p.weight === 'significant' ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        <span style={{ color:'var(--green)', flexShrink:0, marginTop:1 }}>●</span>
                        <span>{p.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card-dark h-100">
                  <div className="card-dark-header"><span className="card-dark-title" style={{ color:'var(--red)' }}>✕ Limitations</span></div>
                  <div className="card-dark-body">
                    {tool.cons.map((c, i) => (
                      <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:12, lineHeight:1.5, color: c.weight === 'critical' ? 'var(--text-primary)' : c.weight === 'significant' ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        <span style={{ color:'var(--red)', flexShrink:0, marginTop:1 }}>●</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture code */}
            <div className="card-dark">
              <div className="card-dark-header"><span className="card-dark-title">{ '{ }' } Integration Pattern</span></div>
              <div className="card-dark-body" style={{ padding:0 }}>
                <pre style={{ margin:0, padding:20, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-secondary)', lineHeight:1.7, overflowX:'auto', whiteSpace:'pre-wrap', background:'rgba(2,8,15,0.5)', borderRadius:'0 0 8px 8px' }}>
                  {tool.architecturalNotes}
                </pre>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Score card */}
            <div className="card-dark mb-3" style={{ borderTop:`3px solid ${tool.color}` }}>
              <div className="card-dark-body" style={{ textAlign:'center', padding:'24px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>HR Use Case Score</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:52, fontWeight:700, color:tool.color, lineHeight:1 }}>{tool.hrUseCaseRating}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-muted)', marginTop:4 }}>out of 10</div>
              </div>
            </div>

            {/* Benchmarks */}
            <div className="card-dark mb-3">
              <div className="card-dark-header"><span className="card-dark-title">Benchmarks</span></div>
              <div className="card-dark-body">
                <BenchmarkBar label="TypeScript Quality" value={tool.benchmark.typeScriptQualityScore} />
                <BenchmarkBar label="Documentation" value={tool.benchmark.documentationScore} />
                <BenchmarkBar label="Performance" value={tool.benchmark.performanceScore} />
                <BenchmarkBar label="Community" value={tool.benchmark.communityScore} />
                <BenchmarkBar label="API Simplicity" value={10 - tool.benchmark.apiComplexityScore} />
                <BenchmarkBar label="Bundle (gzip)" value={tool.benchmark.bundleSize.minGzip === 0 ? 10 : Math.max(1, 10 - tool.benchmark.bundleSize.minGzip / 50)} raw={tool.benchmark.bundleSize.minGzip === 0 ? '0 KB' : `${tool.benchmark.bundleSize.minGzip} KB`} />
              </div>
            </div>

            {/* Best for */}
            <div className="card-dark">
              <div className="card-dark-header"><span className="card-dark-title">Fit Assessment</span></div>
              <div className="card-dark-body">
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--green)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>Best For</div>
                {tool.bestFor.map((b, i) => <div key={i} style={{ fontSize:12, color:'var(--text-secondary)', padding:'4px 0', borderBottom:'1px solid var(--border)', lineHeight:1.5 }}>→ {b}</div>)}
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--red)', letterSpacing:1.5, textTransform:'uppercase', margin:'16px 0 8px' }}>Avoid If</div>
                {tool.notRecommendedFor.map((b, i) => <div key={i} style={{ fontSize:12, color:'var(--text-muted)', padding:'4px 0', lineHeight:1.5 }}>→ {b}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
