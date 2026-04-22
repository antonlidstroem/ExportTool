import { useApp } from '../hooks/useApp';
import { TOOLS } from '../data/mockData';
import type { Tool, Page } from '../types';
import logoUrl from '../assets/vite.svg';

export const Sidebar = () => {
  const { state, navigate } = useApp();

  const mainItems: { id: Page; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'playground', label: 'Export Playground' },
    { id: 'decision-guide', label: 'Decision Guide' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',    // Centers image and text-div horizontally
        textAlign: 'center',      // Centers the text lines themselves
        gap: '12px',
        paddingBottom: '20px'
      }}>
        <img 
          src={logoUrl} 
          alt="Logo" 
          style={{ width: '32px', height: '32px', flexShrink: 0 }} 
        />
        
        <div>
          
          <div className="sidebar-logo-title" style={{ lineHeight: '1.2' }}>
            Export<br/>Decision Tool
          </div>
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {mainItems.map(item => (
          <div key={item.id} className={`nav-item ${state.activePage === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}>
            <div className="nav-dot" style={{ background: state.activePage === item.id ? 'var(--cyan)' : 'var(--text-muted)', opacity: state.activePage === item.id ? 1 : 0.5 }} />
            <span>{item.label}</span>
          </div>
        ))}

        <div className="sidebar-section-label">Libraries</div>
        {TOOLS.map((tool: Tool) => (
          <div key={tool.id} className={`nav-item ${state.activePage === tool.id ? 'active' : ''}`}
            onClick={() => navigate(tool.id as Page)}>
            <div className="nav-dot" style={{ backgroundColor: tool.color }} />
            <span style={{ fontSize: '13px' }}>{tool.name}</span>
            {(tool.id === 'syncfusion' || tool.id === 'devexpress') && (
              <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:8, background:'var(--green-dim)', color:'var(--green)', border:'1px solid rgba(16,185,129,0.3)', padding:'1px 5px', borderRadius:3 }}>LIVE</span>
            )}
            {tool.id === 'jsreports' && (
              <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:8, background:'rgba(0,120,212,0.15)', color:'#0078D4', border:'1px solid rgba(0,120,212,0.3)', padding:'1px 5px', borderRadius:3 }}>DEMO</span>
            )}
            {tool.id === 'playwright' && (
              <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:8, background:'var(--amber-dim)', color:'var(--amber)', border:'1px solid rgba(245,158,11,0.3)', padding:'1px 5px', borderRadius:3 }}>REF</span>
            )}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div>v2.0.0 · TypeScript strict</div>
        <div style={{ marginTop:2, opacity:0.6 }}>5 libraries evaluated</div>
      </div>
    </nav>
  );
};
