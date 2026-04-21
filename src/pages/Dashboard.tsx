import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TOOLS, EMPLOYEES } from '../data/mockData';
import { formatCurrency } from '../utils/exportUtils';
import type { Employee, Tool } from '../types';

export const Dashboard = () => {
  const totalPayroll = EMPLOYEES.reduce((sum: number, emp: Employee) => sum + emp.salary, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Overview</div>
        <h1 className="page-title">HR Intelligence <em>Dashboard</em></h1>
      </div>
      <div className="page-body">
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="metric-card cyan">
              <div className="metric-label">Total Payroll</div>
              <div className="metric-value">{formatCurrency(totalPayroll)}</div>
            </div>
          </div>
        </div>
        
        <div className="card-dark">
          <div className="card-dark-header"><span className="card-dark-title">Library Performance</span></div>
          <div className="card-dark-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOOLS}>
                <XAxis dataKey="name" stroke="#4d6680" />
                <YAxis stroke="#4d6680" />
                <Tooltip contentStyle={{ backgroundColor: '#0d2137', border: '1px solid #134060' }} />
                <Bar dataKey="hrUseCaseRating">
                  {TOOLS.map((entry: Tool, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};