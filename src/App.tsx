import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Playground } from './pages/Playground';
import { SyncfusionPage } from './pages/SyncfusionPage';
import { JsreportPage } from './pages/JsreportPage';
import { DevExpressPage } from './pages/DevExpressPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { DecisionGuide } from './pages/DecisionGuide';
import { useApp } from './hooks/useApp';
import type { Notification } from './context/appReducer';

export const App = () => {
  const { state, dismissNotification } = useApp();

  const renderPage = () => {
    switch (state.activePage) {
      case 'dashboard':      return <Dashboard />;
      case 'playground':     return <Playground />;
      case 'decision-guide': return <DecisionGuide />;
      case 'syncfusion':     return <SyncfusionPage />;
      case 'jsreports':      return <JsreportPage />;
      case 'devexpress':     return <DevExpressPage />;
      case 'telerik':        return <ToolDetailPage toolId="telerik" />;
      case 'playwright':     return <ToolDetailPage toolId="playwright" />;
      default:               return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {renderPage()}
      </main>
      <div className="notifications-container">
        {state.notifications.map((n: Notification) => (
          <div key={n.id} className={`notification-item notification-${n.type}`}
            onClick={() => dismissNotification(n.id)} style={{ cursor: 'pointer', display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:14 }}>{n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : 'ℹ'}</span>
            <div style={{ flex:1 }}>{n.message}</div>
            <div style={{ opacity:0.5, fontSize:16 }}>&times;</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
