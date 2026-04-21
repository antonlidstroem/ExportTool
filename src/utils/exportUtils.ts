export const formatCurrency = (n: number): string => '$' + n.toLocaleString();

export const triggerDownload = (content: string, filename: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};


export const buildCSV = <T>(
  data: T[], 
  columns: { key: keyof T; label: string }[]
): string => {
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row => 
    columns.map(c => {
      const value = row[c.key];
      // Vi tvingar värdet till en sträng och hanterar null/undefined
      const stringValue = value === null || value === undefined ? '' : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    }).join(',')
  );
  return [header, ...rows].join('\n');
};