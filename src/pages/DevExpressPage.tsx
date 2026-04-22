import { useRef, useState } from 'react';
import DataGrid, {
  Column, Export as DxExport, FilterRow, HeaderFilter,
  Grouping, GroupPanel, Sorting, Paging,
  ColumnChooser, Summary, TotalItem,
  type DataGridRef,
} from 'devextreme-react/data-grid';
import type { ExportingEvent } from 'devextreme/ui/data_grid';
import { exportDataGrid as exportToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportToPdfDx } from 'devextreme/pdf_exporter';
import type { Cell as PdfCell } from 'devextreme/common/export/pdf';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';import { EMPLOYEES, DEPT_STATS } from '../data/mockData';
import { useApp } from '../hooks/useApp';
import 'devextreme/dist/css/dx.dark.css';

const CODE = `import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import { exportDataGrid as exportToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportToPDF } from 'devextreme/pdf_exporter';
import type { ExportingEvent } from 'devextreme/ui/data_grid';
import type { PdfDataGridCell } from 'devextreme/pdf_exporter';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

const onExporting = async (e: ExportingEvent) => {
  if (e.format === 'xlsx') {
    e.cancel = true;
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Employees');

    await exportToExcel({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
      customizeCell: ({ gridCell, excelCell }) => {
        // Salary column: currency format + blue text
        if (gridCell?.column?.dataField === 'salary') {
          excelCell.numFmt = '$#,##0';
          excelCell.font = { bold: true, color: { argb: 'FF0a5e8a' } };
        }
        // Header row: dark background with cyan text
        if (gridCell?.rowType === 'header') {
          excelCell.fill = { type: 'pattern', pattern: 'solid',
            fgColor: { argb: 'FF0A1929' } };
          excelCell.font = { bold: true, color: { argb: 'FF00D4FF' }, size: 10 };
        }
        // Alternate row shading
        if (gridCell?.rowType === 'data' && (gridCell?.data?.index ?? 0) % 2 === 1) {
          excelCell.fill = { type: 'pattern', pattern: 'solid',
            fgColor: { argb: 'FFF0F4F8' } };
        }
      },
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Lidstroem_employees.xlsx');
  }

  if (e.format === 'pdf') {
    e.cancel = true;
    const doc = new jsPDF({ orientation: 'landscape' });

    await exportToPDF({
      jsPDFDocument: doc,
      component: e.component,
      customizeCell: ({ gridCell, pdfCell }) => {
        const cell = pdfCell as PdfDataGridCell | undefined;
        if (!cell) return;
        if (gridCell?.rowType === 'header') {
          cell.backgroundColor = '#0a1929';
          cell.textColor = '#00d4ff';
          cell.font = { style: 'bold' };
        }
      },
    });
    doc.save('Lidstroem_employees.pdf');
  }
};

<DataGrid dataSource={employees} onExporting={onExporting}>
  <Export enabled={true} formats={['xlsx', 'pdf']} />
  <Column dataField="firstName" caption="First Name" />
  <Column dataField="salary" caption="Salary" format="currency" />
</DataGrid>`;

export const DevExpressPage = () => {
  const { notify } = useApp();
  const gridRef = useRef<DataGridRef>(null);
  const [view, setView] = useState<'employees' | 'departments'>('employees');
  const [showCode, setShowCode] = useState(false);

  const onExporting = async (e: ExportingEvent) => {
    const label = view === 'employees' ? 'Employee Directory' : 'Department Statistics';

    if (e.format === 'xlsx') {
      e.cancel = true;
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(view === 'employees' ? 'Employees' : 'Departments');

      await exportToExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
        customizeCell: ({ gridCell, excelCell }) => {
          const isSalaryField =
            gridCell?.column?.dataField === 'salary' ||
            gridCell?.column?.dataField === 'avgSalary' ||
            gridCell?.column?.dataField === 'totalPayroll';

          if (isSalaryField && gridCell?.rowType === 'data') {
            excelCell.numFmt = '$#,##0';
            excelCell.font = { ...excelCell.font, color: { argb: 'FF0a5e8a' } };
          }
          if (gridCell?.rowType === 'header') {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A1929' } };
            excelCell.font = { bold: true, color: { argb: 'FF00D4FF' }, size: 10 };
          }
        },
      });

      // Prepend a branded title row above the exported data
      worksheet.insertRow(1, []);
      worksheet.insertRow(1, [`Lidstroem HR — ${label}`]);
      const titleCell = worksheet.getCell('A1');
      titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF7200' } };
      titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
      worksheet.getRow(1).height = 28;

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `Lidstroem_${view}_devexpress.xlsx`
      );
      notify(`Excel export complete — ExcelJS with custom cell formatting`, 'success');
    }

    if (e.format === 'pdf') {
      e.cancel = true;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Branded header bar
      doc.setFillColor(10, 25, 41);
      doc.rect(0, 0, 297, 14, 'F');
      doc.setTextColor(0, 212, 255);
      doc.setFontSize(8);
      doc.text(`Lidstroem HR — ${label}`, 10, 9);
      doc.text(`DevExpress DataGrid Export · ${new Date().toLocaleDateString()}`, 200, 9);

      await exportToPdfDx({
        jsPDFDocument: doc,
        component: e.component,
        topLeft: { x: 5, y: 18 },
        customizeCell: ({ gridCell, pdfCell }) => {
          const cell = pdfCell as PdfCell | undefined;
          if (!cell) return;
          if (gridCell?.rowType === 'header') {
            cell.backgroundColor = '#0a1929';
            cell.textColor = '#00d4ff';
            cell.font = { style: 'bold' };
          }
        },
      });
      doc.save(`Lidstroem_${view}_devexpress.pdf`);
      notify('PDF export complete — jsPDF with DevExtreme grid cell callbacks', 'success');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow" style={{ color: '#FF7200' }}>Component Suite · Live Demo</div>
        <h1 className="page-title">DevExpress <em>DataGrid</em></h1>
        <p className="page-subtitle">
          Real <code>devextreme-react</code> DataGrid with grouping, column chooser, and multi-column sorting.
          Excel export uses ExcelJS with cell-level formatting callbacks. PDF uses jsPDF.
          Click the Export button inside the grid toolbar.
        </p>
      </div>

      <div className="page-body">
        {/* Controls */}
        <div className="card-dark mb-4">
          <div className="card-dark-header">
            <span className="card-dark-title">Dataset & Controls</span>
          </div>
          <div className="card-dark-body">
            <div className="d-flex gap-3 align-items-center flex-wrap">
              <div style={{ display: 'flex', gap: 8 }}>
                {(['employees', 'departments'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} style={{
                    padding: '7px 16px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    background: view === v ? '#FF7200' : 'transparent',
                    border: `1px solid ${view === v ? '#FF7200' : 'var(--border)'}`,
                    color: view === v ? '#fff' : 'var(--text-secondary)',
                  }}>
                    {v === 'employees' ? `Employees (${EMPLOYEES.length})` : `Departments (${DEPT_STATS.length})`}
                  </button>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                Use the grid toolbar → Export → choose Excel or PDF
              </div>
              <button onClick={() => setShowCode(s => !s)} className="btn-cyber" style={{ marginLeft: 'auto' }}>
                {showCode ? '▲ Hide Code' : '{ } TypeScript Code'}
              </button>
            </div>
          </div>
        </div>

        {showCode && (
          <div className="card-dark mb-4">
            <div className="card-dark-header">
              <span className="card-dark-title">TypeScript Integration Code</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#FF7200' }}>devextreme-react v24.x</span>
            </div>
            <div className="card-dark-body" style={{ padding: 0 }}>
              <pre style={{
                margin: 0, padding: 20,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-secondary)', lineHeight: 1.7,
                overflowX: 'auto', whiteSpace: 'pre-wrap',
                background: 'rgba(2,8,15,0.6)',
              }}>
                {CODE}
              </pre>
            </div>
          </div>
        )}

        {/* Live Grid */}
        <div className="card-dark">
          <div className="card-dark-header">
            <span className="card-dark-title">
              Live DataGrid — {view === 'employees' ? `${EMPLOYEES.length} employees` : `${DEPT_STATS.length} departments`}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--cyan)' }}>
              devextreme-react v24.x
            </span>
          </div>
          <div style={{ padding: 16 }}>
            {view === 'employees' ? (
              <DataGrid
                ref={gridRef}
                dataSource={EMPLOYEES}
                showBorders={false}
                rowAlternationEnabled={true}
                allowColumnReordering={true}
                allowColumnResizing={true}
                onExporting={onExporting}
                style={{ fontSize: 12 }}
              >
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <GroupPanel visible={true} emptyPanelText="Drag a column header here to group rows" />
                <Grouping autoExpandAll={false} />
                <Sorting mode="multiple" />
                <ColumnChooser enabled={true} mode="select" />
                <Paging defaultPageSize={8} />
                <DxExport enabled={true} allowExportSelectedData={true} formats={['xlsx', 'pdf']} />
                <Column dataField="id" caption="ID" width={80} />
                <Column dataField="firstName" caption="First Name" width={110} />
                <Column dataField="lastName" caption="Last Name" width={110} />
                <Column dataField="department" caption="Department" width={130} groupIndex={0} />
                <Column dataField="role" caption="Role" width={200} />
                <Column dataField="salary" caption="Salary" dataType="number" format="currency" width={110} />
                <Column dataField="seniorityLevel" caption="Level" width={90} />
                <Column dataField="status" caption="Status" width={100} />
                <Column dataField="performanceScore" caption="Score" dataType="number" format="#0.0" width={80} />
                <Summary>
                  <TotalItem column="salary" summaryType="sum" valueFormat="currency" displayFormat="Total: {0}" />
                  <TotalItem column="id" summaryType="count" displayFormat="{0} employees" />
                </Summary>
              </DataGrid>
            ) : (
              <DataGrid
                ref={gridRef}
                dataSource={DEPT_STATS}
                showBorders={false}
                rowAlternationEnabled={true}
                onExporting={onExporting}
                style={{ fontSize: 12 }}
              >
                <FilterRow visible={true} />
                <Sorting mode="multiple" />
                <DxExport enabled={true} formats={['xlsx', 'pdf']} />
                <Column dataField="department" caption="Department" width={140} />
                <Column dataField="headCount" caption="Headcount" dataType="number" width={110} />
                <Column dataField="avgSalary" caption="Avg Salary" dataType="number" format="currency" width={130} />
                <Column dataField="totalPayroll" caption="Total Payroll" dataType="number" format="currency" width={140} />
                <Column dataField="avgPerformanceScore" caption="Avg Score" dataType="number" format="#0.0" width={110} />
                <Column dataField="turnoverRate" caption="Turnover %" dataType="number" format="#0.0" width={110} />
                <Summary>
                  <TotalItem column="totalPayroll" summaryType="sum" valueFormat="currency" displayFormat="Total: {0}" />
                  <TotalItem column="headCount" summaryType="sum" displayFormat="Total: {0}" />
                </Summary>
              </DataGrid>
            )}
          </div>
        </div>

        {/* Benchmarks */}
        <div className="row g-3 mt-3">
          {[
            { label: 'Performance', val: '9 / 10' },
            { label: 'Excel Formatting', val: '10 / 10' },
            { label: 'Bundle (gzip)', val: '340 KB' },
            { label: 'HR Score', val: '8.0 / 10' },
          ].map(m => (
            <div key={m.label} className="col-6 col-md-3">
              <div className="metric-card" style={{ borderTop: '2px solid #FF7200' }}>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={{ fontSize: 22 }}>{m.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
