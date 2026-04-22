import type { ColumnDef, PdfTheme } from '../types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
import PptxGenJS from 'pptxgenjs';
// import { CellHookData } from 'jspdf-autotable';
import autoTable, { HookData } from 'jspdf-autotable';

// ── Helpers ───────────────────────────────────────────────────────────────────

export const formatCurrency = (n: number): string => '$' + n.toLocaleString();

export const triggerDownload = (content: string | ArrayBuffer, filename: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const buildCSV = <T extends object>(data: T[], columns: ColumnDef<T>[]): string => {
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const raw = row[c.key];
      return escape(c.formatter ? c.formatter(raw) : raw);
    }).join(',')
  );
  return [header, ...rows].join('\n');
};

// ── PDF Themes ────────────────────────────────────────────────────────────────

export const PDF_THEMES: PdfTheme[] = [
  {
    id: 'corporate',
    name: 'Corporate Dark',
    description: 'Dark navy header, clean white body. Classic enterprise look.',
    headerBg: '#0a1929', headerText: '#ffffff', accentColor: '#00d4ff',
    bodyBg: '#ffffff', altRowBg: '#f0f4f8', borderColor: '#cbd5e1',
    hasCoverPage: false,
  },
  {
    id: 'executive',
    name: 'Executive Report',
    description: 'Cover page with metadata summary, then formatted data table.',
    headerBg: '#1e3a5f', headerText: '#ffffff', accentColor: '#f59e0b',
    bodyBg: '#ffffff', altRowBg: '#fafafa', borderColor: '#e2e8f0',
    hasCoverPage: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Generous whitespace, light borders, monochrome palette.',
    headerBg: '#f8fafc', headerText: '#0f172a', accentColor: '#64748b',
    bodyBg: '#ffffff', altRowBg: '#f8fafc', borderColor: '#e2e8f0',
    hasCoverPage: false,
  },
  {
    id: 'branded',
    name: 'Lidstroem Branded',
    description: 'Cyan accent, dark background — matches the app aesthetic.',
    headerBg: '#04101e', headerText: '#00d4ff', accentColor: '#00d4ff',
    bodyBg: '#0a1929', altRowBg: '#0d2137', borderColor: 'rgba(0,212,255,0.2)',
    hasCoverPage: true,
  },
];

// ── hex → [r,g,b] ─────────────────────────────────────────────────────────────
const hexToRgb = (h: string): [number, number, number] => {
  const clean = h.replace('#', '').slice(0, 6);
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

// ── PDF export (jsPDF + autotable) ────────────────────────────────────────────

export interface PdfExportOptions<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  subtitle?: string;
  preparedBy?: string;
  theme: PdfTheme;
}

export const exportToPDF = async <T extends object>(opts: PdfExportOptions<T>): Promise<void> => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const t = opts.theme;
  const [hR, hG, hB] = hexToRgb(t.headerBg);
  const [aR, aG, aB] = hexToRgb(t.accentColor);
  const isLight = ['#ffffff', '#fafafa', '#f8fafc'].includes(t.bodyBg);

  if (t.hasCoverPage) {
    doc.setFillColor(hR, hG, hB);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setFillColor(aR, aG, aB);
    doc.rect(0, 0, 8, 210, 'F');
    const [htR, htG, htB] = hexToRgb(t.headerText);
    doc.setTextColor(htR, htG, htB);
    doc.setFontSize(32); doc.setFont('helvetica', 'bold');
    doc.text(opts.title, 24, 80);
    doc.setFontSize(14); doc.setFont('helvetica', 'normal');
    if (opts.subtitle) doc.text(opts.subtitle, 24, 96);
    doc.setFontSize(10);
    doc.text(`Prepared by: ${opts.preparedBy ?? 'Lidstroem HR'}`, 24, 130);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 24, 140);
    doc.text(`Records: ${opts.data.length}`, 24, 150);
    doc.addPage();
  }

  const headers = opts.columns.map(c => c.label);
  const rows = opts.data.map(row =>
    opts.columns.map(c => {
      const raw = row[c.key];
      return c.formatter ? c.formatter(raw) : (raw == null ? '' : String(raw));
    })
  );

  const [bodyR, bodyG, bodyB] = isLight ? [255, 255, 255] : hexToRgb(t.bodyBg);
  const [altR, altG, altB] = hexToRgb(t.altRowBg);
  const textColor: [number, number, number] = isLight ? [30, 30, 30] : [220, 230, 244];

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: t.hasCoverPage ? 20 : 28,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor,
      fillColor: [bodyR, bodyG, bodyB],
    },
    headStyles: {
      fillColor: [hR, hG, hB],
      textColor: hexToRgb(t.headerText),
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [altR, altG, altB],
    },
    didDrawPage: (data: HookData) => {
      // Page header bar
      doc.setFillColor(hR, hG, hB);
      doc.rect(0, 0, 297, 14, 'F');
      const [htR, htG, htB] = hexToRgb(t.headerText);
      doc.setTextColor(htR, htG, htB);
      doc.setFontSize(8);
      doc.text(opts.title, 10, 9);
      doc.text(`Lidstroem HR · Confidential · ${new Date().getFullYear()}`, 220, 9);
      // Page footer
      doc.setFillColor(hR, hG, hB);
      doc.rect(0, 203, 297, 7, 'F');
      doc.setFontSize(7);
      doc.text(`Page ${data.pageNumber}`, 143, 207, { align: 'center' });
    },
  });

  doc.save(`${opts.title.replace(/\s+/g, '_').toLowerCase()}_${t.id}.pdf`);
};

// ── PPTX export (pptxgenjs) ───────────────────────────────────────────────────

export interface PptxExportOptions<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export const exportToPPTX = async <T extends object>(opts: PptxExportOptions<T>): Promise<void> => {
  const prs = new PptxGenJS();
  prs.layout = 'LAYOUT_WIDE';

  const accent = (opts.accentColor ?? '#00d4ff').replace('#', '');
  const dark = '04101e';
  const navyBg = '0a1929';
  const navyAlt = '0d2137';
  const textLight = 'e2eaf4';

  // ── Title slide ──────────────────────────────────────────────────────────
  const titleSlide = prs.addSlide();
  titleSlide.background = { color: dark };
  titleSlide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: accent }, line: { type: 'none' },
  });
  titleSlide.addText(opts.title, {
    x: 0.5, y: 2.2, w: 12, h: 1.2,
    fontSize: 40, bold: true, color: 'FFFFFF', fontFace: 'Arial',
  });
  if (opts.subtitle) {
    titleSlide.addText(opts.subtitle, {
      x: 0.5, y: 3.5, w: 10, h: 0.6,
      fontSize: 18, color: accent, fontFace: 'Arial',
    });
  }
  titleSlide.addText(
    `Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}  ·  ${opts.data.length} records  ·  Lidstroem HR`,
    { x: 0.5, y: 6.5, w: 12, h: 0.4, fontSize: 10, color: '8ba3be', fontFace: 'Arial' }
  );

  // ── Data slides (18 rows per slide) ──────────────────────────────────────
  const ROWS_PER_SLIDE = 18;
  for (let chunkStart = 0; chunkStart < opts.data.length; chunkStart += ROWS_PER_SLIDE) {
    const chunk = opts.data.slice(chunkStart, chunkStart + ROWS_PER_SLIDE);
    const slideNum = Math.floor(chunkStart / ROWS_PER_SLIDE) + 2;

    const slide = prs.addSlide();
    slide.background = { color: dark };

    slide.addShape(prs.ShapeType.rect, {
      x: 0, y: 0, w: 13.33, h: 0.45,
      fill: { color: accent }, line: { type: 'none' },
    });
    slide.addText(`${opts.title}  ·  Page ${slideNum}`, {
      x: 0.15, y: 0.07, w: 10, h: 0.32,
      fontSize: 10, bold: true, color: dark, fontFace: 'Arial',
    });

    // Header row + data rows as a typed table
    type PptxCell = { text: string; options: Record<string, unknown> };
    type PptxRow = PptxCell[];

    const headerRow: PptxRow = opts.columns.map(c => ({
      text: c.label,
      options: { bold: true, fontSize: 9, color: dark, fill: { color: accent }, align: 'left' },
    }));

    const dataRows: PptxRow[] = chunk.map((row, rowIdx) =>
      opts.columns.map(c => {
        const raw = row[c.key];
        return {
          text: c.formatter ? c.formatter(raw) : (raw == null ? '' : String(raw)),
          options: {
            fontSize: 8,
            color: textLight,
            fill: { color: rowIdx % 2 === 0 ? navyAlt : navyBg },
          },
        };
      })
    );

    const colW = 13.0 / opts.columns.length;

    // pptxgenjs addTable accepts rows as { text, options }[][]
    slide.addTable([headerRow, ...dataRows] as Parameters<typeof slide.addTable>[0], {
      x: 0.15, y: 0.6, w: 13.0,
      colW: opts.columns.map(() => colW),
      border: { type: 'solid', pt: 0.5, color: '134060' },
    });
  }

  await prs.writeFile({ fileName: `${opts.title.replace(/\s+/g, '_').toLowerCase()}_report.pptx` });
};

// ── XLSX export (ExcelJS) ─────────────────────────────────────────────────────

export interface XlsxExportOptions<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  sheetName?: string;
  accentColor?: string;
}

export const exportToXLSX = async <T extends object>(opts: XlsxExportOptions<T>): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Lidstroem HR Platform';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(opts.sheetName ?? 'HR Data');
  const accentArgb = `FF${(opts.accentColor ?? '#FF6800').replace('#', '')}`;

  // Title row
  sheet.mergeCells(1, 1, 1, opts.columns.length);
  const titleCell = sheet.getCell('A1');
  titleCell.value = opts.title;
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: accentArgb } };
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  sheet.getRow(1).height = 28;

  // Subtitle row
  sheet.mergeCells(2, 1, 2, opts.columns.length);
  const subCell = sheet.getCell('A2');
  subCell.value = `Generated ${new Date().toLocaleDateString('en-GB')} · ${opts.data.length} records · Lidstroem HR`;
  subCell.font = { italic: true, size: 9, color: { argb: 'FF666666' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
  sheet.getRow(2).height = 16;

  // Column header row
  const headerRow = sheet.getRow(3);
  opts.columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.label;
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A1929' } };
    cell.border = { bottom: { style: 'medium', color: { argb: accentArgb } } };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };
    sheet.getColumn(i + 1).width = col.width ?? 16;
  });
  headerRow.height = 20;

  // Data rows
  opts.data.forEach((row, rowIdx) => {
    const sheetRow = sheet.addRow(
      opts.columns.map(c => {
        const raw = row[c.key];
        return c.formatter ? c.formatter(raw) : (raw == null ? '' : raw);
      })
    );
    sheetRow.height = 16;
    const altFg = rowIdx % 2 === 1 ? 'FFF8FAFC' : 'FFFFFFFF';
    sheetRow.eachCell((cell: ExcelJS.Cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: altFg } };
      cell.font = { size: 9 };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFCBD5E1' } } };
    });
  });

  // Freeze header + autofilter
  sheet.views = [{ state: 'frozen', ySplit: 3 }];
  sheet.autoFilter = {
    from: { row: 3, column: 1 },
    to: { row: 3, column: opts.columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `${opts.title.replace(/\s+/g, '_').toLowerCase()}.xlsx`
  );
};
