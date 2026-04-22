import { useState, useMemo } from 'react';
import { TOOLS } from '../data/mockData';
import { useApp } from '../hooks/useApp';
import type { DecisionAnswers, Page } from '../types';

interface Question {
  key: keyof DecisionAnswers;
  label: string;
  hint: string;
  options: { val: string; label: string; desc: string }[];
}

const QUESTIONS: Question[] = [
  {
    key: 'budget',
    label: 'What is your licensing budget?',
    hint: 'This determines which commercial libraries are viable from the start.',
    options: [
      { val: 'free', label: 'Free / OSS only', desc: 'No commercial licenses — community or open-source only' },
      { val: 'moderate', label: 'Up to $1K / dev / yr', desc: 'Standard commercial tier for solo or small teams' },
      { val: 'generous', label: 'Enterprise budget', desc: 'Per-seat or site licenses are on the table' },
    ],
  },
  {
    key: 'clientSideOnly',
    label: 'Is your architecture client-side only?',
    hint: 'Some libraries require a Node.js server to generate exports.',
    options: [
      { val: 'yes', label: 'Yes — React SPA, no backend', desc: 'All exports must happen in the browser' },
      { val: 'no', label: 'No — Node.js backend available', desc: 'Server-side rendering and APIs are available' },
    ],
  },
  {
    key: 'primaryUseCase',
    label: 'What is your primary export requirement?',
    hint: 'Different libraries excel at different formats.',
    options: [
      { val: 'pdf', label: 'PDF reports / compliance docs', desc: 'Formal documents, regulatory filings, print-ready output' },
      { val: 'excel', label: 'Excel / data analysis', desc: 'Spreadsheets users will open in Excel and analyse' },
      { val: 'both', label: 'Both PDF and Excel', desc: 'Full document and data export pipeline' },
      { val: 'pptx', label: 'Presentations (PPTX)', desc: 'Slide decks for board reports and executive summaries' },
    ],
  },
  {
    key: 'typescriptPriority',
    label: 'How critical is TypeScript quality?',
    hint: 'Type definition completeness varies significantly between libraries.',
    options: [
      { val: 'critical', label: 'Critical — strict mode everywhere', desc: 'Any any in a library type is unacceptable' },
      { val: 'preferred', label: 'Preferred but practical', desc: 'Good types matter but we can work around gaps' },
      { val: 'optional', label: 'Optional', desc: 'JavaScript-first team, types are a nice-to-have' },
    ],
  },
  {
    key: 'teamSize',
    label: 'Engineering team size?',
    hint: 'Per-seat licensing has very different TCO depending on headcount.',
    options: [
      { val: 'small', label: '1–5 developers', desc: 'Solo project or small startup' },
      { val: 'medium', label: '6–20 developers', desc: 'Growing team — license costs start to matter' },
      { val: 'large', label: '20+ developers', desc: 'Per-seat pricing can exceed site license thresholds' },
    ],
  },
];

function deriveRecommendation(answers: DecisionAnswers): { toolId: string; reasoning: string; runnerId: string | null } | null {
  const { budget, clientSideOnly, primaryUseCase, typescriptPriority, teamSize } = answers;
  if (!budget || !clientSideOnly || !primaryUseCase || !typescriptPriority || !teamSize) return null;

  // jsreport wins if server available + PDF is top priority
  if (clientSideOnly === 'no' && (primaryUseCase === 'pdf')) {
    return { toolId: 'jsreports', reasoning: 'Your server-side architecture and PDF focus are exactly jsreport\'s sweet spot. Chrome rendering produces pixel-perfect PDFs your CSS controls. Zero client bundle overhead.', runnerId: 'playwright' };
  }
  // Playwright as architectural choice if server + fidelity matters and PDF only
  if (clientSideOnly === 'no' && primaryUseCase === 'pdf' && typescriptPriority === 'critical') {
    return { toolId: 'playwright', reasoning: 'First-class TypeScript, server-side, and zero UI discrepancy. If fidelity and type safety are both non-negotiable, Playwright\'s print-to-PDF architecture is unmatched.', runnerId: 'jsreports' };
  }
  // Free + client-side → Syncfusion community
  if (budget === 'free' && clientSideOnly === 'yes') {
    return { toolId: 'syncfusion', reasoning: 'Syncfusion\'s community license is free for companies under $1M revenue. You get client-side PDF, Excel, and 1,800+ components at zero cost. Hard to beat.', runnerId: null };
  }
  // TypeScript critical + commercial budget → Telerik
  if (typescriptPriority === 'critical' && budget !== 'free') {
    return { toolId: 'telerik', reasoning: 'Kendo UI for React has the most idiomatic React API and best-in-class TypeScript definitions. For strict-mode TypeScript teams, the developer experience is unmatched.', runnerId: 'syncfusion' };
  }
  // Excel heavy + data analytics → DevExpress
  if ((primaryUseCase === 'excel' || primaryUseCase === 'both') && teamSize !== 'large') {
    return { toolId: 'devexpress', reasoning: 'DevExtreme\'s ExcelJS integration gives you the richest cell-level formatting control in the browser ecosystem. The PivotGrid is ideal for HR analytics.', runnerId: 'syncfusion' };
  }
  // PPTX focus → Syncfusion (pptxgenjs behind scenes)
  if (primaryUseCase === 'pptx') {
    return { toolId: 'syncfusion', reasoning: 'For PPTX, pptxgenjs is the best browser-native solution. Syncfusion provides the DataGrid context while pptxgenjs handles the slide generation — a strong pairing.', runnerId: null };
  }
  // Large team + commercial → site license considerations push to Syncfusion
  if (teamSize === 'large' && budget === 'generous') {
    return { toolId: 'syncfusion', reasoning: 'At 20+ developers, Syncfusion\'s site license becomes cost-competitive. Combined with 1,800+ components, it\'s the most complete solution for large HR engineering teams.', runnerId: 'telerik' };
  }
  // Fallback
  return { toolId: 'syncfusion', reasoning: 'Syncfusion\'s balanced combination of client-side exports, comprehensive TypeScript support, and favourable community licensing makes it the safest default choice for most HR-tech contexts.', runnerId: null };
}

export const DecisionGuide = () => {
  const { navigate } = useApp();
  const [answers, setAnswers] = useState<DecisionAnswers>({
    budget: null, clientSideOnly: null, primaryUseCase: null,
    typescriptPriority: null, teamSize: null,
  });
  const [revealed, setRevealed] = useState(false);

  const setAnswer = (key: keyof DecisionAnswers, val: string) =>
    setAnswers(prev => ({ ...prev, [key]: val as never }));

  const allAnswered = Object.values(answers).every(v => v !== null);
  const rec = useMemo(() => deriveRecommendation(answers), [answers]);
  const recTool = rec ? TOOLS.find(t => t.id === rec.toolId) : null;
  const runnerTool = rec?.runnerId ? TOOLS.find(t => t.id === rec.runnerId) : null;
  const answeredCount = Object.values(answers).filter(v => v !== null).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Rule-Based</div>
        <h1 className="page-title">Library <em>Decision Guide</em></h1>
        <p className="page-subtitle">Answer five questions to receive a recommendation tailored to your HR export context.</p>
      </div>

      <div className="page-body">
        <div className="row g-4">
          <div className="col-lg-7">
            {QUESTIONS.map((q, idx) => {
              const answered = answers[q.key] !== null;
              return (
                <div key={q.key} style={{
                  background: 'var(--card-bg)', border: `1px solid ${answered ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                  borderRadius:8, padding:20, marginBottom:16,
                }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--cyan)', letterSpacing:2, marginBottom:6 }}>
                    STEP {String(idx+1).padStart(2,'0')} {answered && '· ✓ answered'}
                  </div>
                  <div style={{ fontSize:15, fontWeight:500, color:'var(--text-primary)', marginBottom:4 }}>{q.label}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:12 }}>{q.hint}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {q.options.map(opt => {
                      const selected = answers[q.key] === opt.val;
                      return (
                        <div key={opt.val} onClick={() => setAnswer(q.key, opt.val)}
                          style={{
                            padding:'10px 14px', borderRadius:5, cursor:'pointer', transition:'all 0.15s',
                            border: `1px solid ${selected ? 'var(--cyan)' : 'var(--border)'}`,
                            background: selected ? 'var(--cyan-glow)' : 'transparent',
                          }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:12, height:12, borderRadius:'50%', flexShrink:0, border:`2px solid ${selected ? 'var(--cyan)' : 'var(--border)'}`, background: selected ? 'var(--cyan)' : 'transparent' }} />
                            <span style={{ fontSize:13, color: selected ? 'var(--cyan)' : 'var(--text-primary)', fontWeight: selected ? 500 : 400 }}>{opt.label}</span>
                          </div>
                          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3, paddingLeft:20 }}>{opt.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {allAnswered && !revealed && (
              <button className="btn-cyber-filled w-100" style={{ padding:'14px', fontSize:13 }}
                onClick={() => setRevealed(true)}>
                → Generate Recommendation
              </button>
            )}
          </div>

          <div className="col-lg-5">
            <div style={{ position:'sticky', top:24 }}>
              {/* Progress */}
              <div className="card-dark mb-3">
                <div className="card-dark-body">
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>Progress</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {QUESTIONS.map((q, i) => (
                      <div key={i} style={{ flex:1, height:4, borderRadius:2, background: answers[q.key] ? 'var(--cyan)' : 'var(--border)', transition:'background 0.2s' }} />
                    ))}
                  </div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)', marginTop:8 }}>{answeredCount}/5 questions answered</div>
                </div>
              </div>

              {/* Recommendation */}
              {revealed && rec && recTool && (
                <div style={{ background:'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,80,120,0.1) 100%)', border:'1px solid var(--border-bright)', borderRadius:8, padding:24 }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--cyan)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>// Recommended</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:600, color:recTool.color, marginBottom:2 }}>{recTool.name}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>{recTool.vendor}</div>

                  <div style={{ fontFamily:'var(--font-mono)', fontSize:28, fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>
                    {recTool.hrUseCaseRating}<span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:6 }}>/ 10 HR Score</span>
                  </div>

                  <div style={{ height:1, background:'var(--border)', margin:'16px 0' }} />
                  <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:16 }}>{rec.reasoning}</p>

                  {runnerTool && (
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)', marginBottom:16 }}>
                      Runner-up: <span style={{ color:runnerTool.color }}>{runnerTool.name}</span>
                    </div>
                  )}

                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn-cyber-filled" style={{ background:recTool.color, border:'none', flex:1, justifyContent:'center' }}
                      onClick={() => navigate(recTool.id as Page)}>
                      → View Analysis
                    </button>
                    <button className="btn-cyber" onClick={() => { setAnswers({ budget:null, clientSideOnly:null, primaryUseCase:null, typescriptPriority:null, teamSize:null }); setRevealed(false); }}>
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {!revealed && answeredCount > 0 && (
                <div className="card-dark">
                  <div className="card-dark-body" style={{ textAlign:'center', padding:32 }}>
                    <div style={{ fontSize:28, marginBottom:12, opacity:0.3 }}>
                      {'▪'.repeat(answeredCount)}{'▫'.repeat(5 - answeredCount)}
                    </div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)' }}>
                      {5 - answeredCount} more {5 - answeredCount === 1 ? 'question' : 'questions'} to go
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
