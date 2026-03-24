function escapeCsvValue(value: string | number | null | undefined) {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function exportRowsToCsv(
  fileName: string,
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
) {
  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
