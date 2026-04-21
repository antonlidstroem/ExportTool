import { useApp } from '../hooks/useApp'; // Går upp ett steg och in i hooks
import { TOOLS } from '../data/mockData';
import type { Tool } from '../types';

export const Sidebar = () => {
  const { state, navigate } = useApp();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">// NEXCORP</div>
        <div className="sidebar-logo-title">HR Export Tool</div>
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <div 
          className={`nav-item ${state.activePage === 'dashboard' ? 'active' : ''}`} 
          onClick={() => navigate('dashboard')}
        >
          Overview
        </div>
        <div 
          className={`nav-item ${state.activePage === 'playground' ? 'active' : ''}`} 
          onClick={() => navigate('playground')}
        >
          Playground
        </div>
        
        <div className="sidebar-section-label">Libraries</div>
        {TOOLS.map((tool: Tool) => (
          <div 
            key={tool.id} 
            className={`nav-item ${state.activePage === tool.id ? 'active' : ''}`} 
            onClick={() => navigate(tool.id)}
          >
            <div className="nav-dot" style={{ backgroundColor: tool.color }}></div>
            <span style={{ fontSize: '13px' }}>{tool.name}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        NexCorp HR v1.0.0
      </div>
    </nav>
  );
};