type CsvCell = string | number | boolean | null | undefined;

type ExportCsvArgs = {
  headers: string[];
  rows: CsvCell[][];
  fileName: string;
};

function escapeCsvCell(value: CsvCell): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function exportCsv({ headers, rows, fileName }: ExportCsvArgs) {
  const csv = [headers.join(','), ...rows.map((row) => row.map(escapeCsvCell).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
