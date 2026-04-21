import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Playground } from './pages/Playground'; // Importera den nya sidan
import { useApp } from './hooks/useApp';
import type { Notification } from './context/appReducer';

export const App = () => {
  const { state, dismissNotification } = useApp();

  const renderPage = () => {
    switch (state.activePage) {
      case 'dashboard': 
        return <Dashboard />;
      case 'playground': 
        return <Playground />; // Här är den riktiga komponenten nu!
      case 'decision-guide':
        return <div className="page-body">Decision Guide kommer här...</div>;
      default: 
        return <Dashboard />;
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
          <div 
            key={n.id} 
            className={`notification-item notification-${n.type}`}
            onClick={() => dismissNotification(n.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ flex: 1 }}>{n.message}</div>
            <div style={{ opacity: 0.5 }}>&times;</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;