import { useApp } from '../hooks/useApp';
import { TOOLS, EMPLOYEES } from '../data/mockData';
import { buildCSV, triggerDownload, formatCurrency } from '../utils/exportUtils';
import type { Employee, Tool } from '../types';

export const Playground = () => {
  const { state, dispatch, notify } = useApp();

  // 1. Hämta valt verktyg baserat på state
  const selectedTool = TOOLS.find(t => t.id === state.playgroundSelectedTool) || TOOLS[0];

  // 2. Filtrera anställda baserat på val (All vs Engineering)
  const filteredData = state.playgroundSelectedDataset === 'engineering' 
    ? EMPLOYEES.filter(e => e.department === 'Engineering')
    : EMPLOYEES;

  // 3. Export-logik
  const handleExport = () => {
    try {
        if (state.playgroundSelectedFormat === 'csv') {
        // Genom att definiera kolumnerna så här blir de strikt typade mot Employee
        const columns: { key: keyof Employee; label: string }[] = [
            { key: 'id', label: 'ID' },
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'department', label: 'Department' },
            { key: 'salary', label: 'Salary' }
        ];
        
        const csvContent = buildCSV(filteredData, columns);
        triggerDownload(csvContent, `hr_export_${selectedTool.id}.csv`, 'text/csv');
        notify(`Successfully exported ${filteredData.length} records via ${selectedTool.name}`, 'success');
        } else {
        notify(`${selectedTool.name} engine: PDF Generation is simulated in this build.`, 'info');
        }
        } catch (error) {
            notify('Export failed. Check console for details.', 'error');
            console.error(error);
        }
    };

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Interactive Lab</div>
        <h1 className="page-title">Export <em>Playground</em></h1>
        <p className="page-subtitle">Testa bibliotekens prestanda på {filteredData.length} rader data.</p>
      </div>

      <div className="page-body">
        <div className="row g-4">
          {/* Vänster kolumn: Konfiguration */}
          <div className="col-lg-4">
            <section className="mb-4">
              <label className="form-label">1. Select Library Engine</label>
              <div className="row g-2">
                {TOOLS.map((tool: Tool) => (
                  <div key={tool.id} className="col-6">
                    <div 
                      className={`tool-card ${state.playgroundSelectedTool === tool.id ? 'active' : ''}`}
                      onClick={() => dispatch({ type: 'SET_PLAYGROUND_TOOL', payload: tool.id })}
                      style={{ 
                        borderColor: state.playgroundSelectedTool === tool.id ? tool.color : 'var(--border)',
                        backgroundColor: state.playgroundSelectedTool === tool.id ? 'var(--cyan-glow)' : 'var(--card-bg)',
                        cursor: 'pointer',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{tool.name}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{tool.vendor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <label className="form-label">2. Dataset & Format</label>
              <div className="card-dark p-3">
                <div className="mb-3">
                  <label className="small text-muted d-block mb-1">Scope</label>
                  <select 
                    className="form-select"
                    value={state.playgroundSelectedDataset}
                    onChange={(e) => dispatch({ type: 'SET_PLAYGROUND_DATASET', payload: e.target.value })}
                  >
                    <option value="employees">Full Workforce (All Depts)</option>
                    <option value="engineering">Engineering Only</option>
                  </select>
                </div>
                <div>
                  <label className="small text-muted d-block mb-1">File Format</label>
                  <select 
                    className="form-select"
                    value={state.playgroundSelectedFormat}
                    onChange={(e) => dispatch({ type: 'SET_PLAYGROUND_FORMAT', payload: e.target.value as 'csv' | 'pdf' })}
                  >
                    <option value="csv">CSV (Spreadsheet)</option>
                    <option value="pdf">PDF (Document)</option>
                  </select>
                </div>
              </div>
            </section>

            <button className="btn-cyber-filled w-100" onClick={handleExport}>
              Execute {state.playgroundSelectedFormat.toUpperCase()} Export
            </button>
          </div>

          {/* Höger kolumn: Preview & Engine Info */}
          <div className="col-lg-8">
            <div className="card-dark mb-4">
              <div className="card-dark-header">
                <span className="card-dark-title">Engine Specification: {selectedTool.name}</span>
                <span className="status-badge status-active">{selectedTool.version}</span>
              </div>
              <div className="card-dark-body">
                <div className="arch-note mb-3">
                  {selectedTool.architecturalNotes}
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="small text-cyan mb-1">PROS</div>
                    <ul className="list-unstyled">
                      {selectedTool.pros.map((p, i) => (
                        <li key={i} className="pro-con-item" style={{ fontSize: '11px' }}>
                          <span className="text-success">✓</span> {p.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="small text-danger mb-1">CONS</div>
                    <ul className="list-unstyled">
                      {selectedTool.cons.map((c, i) => (
                        <li key={i} className="pro-con-item" style={{ fontSize: '11px' }}>
                          <span className="text-danger">×</span> {c.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-dark">
              <div className="card-dark-header">
                <span className="card-dark-title">Data Preview (First 5 rows)</span>
              </div>
              <table className="hr-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Dept</th>
                    <th>Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 5).map((emp: Employee) => (
                    <tr key={emp.id}>
                      <td>{emp.firstName} {emp.lastName}</td>
                      <td>{emp.department}</td>
                      <td>{formatCurrency(emp.salary)}</td>
                      <td>
                        <span className={`status-badge status-${emp.status}`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};