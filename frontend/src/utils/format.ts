export function formatMoney(value: number | string) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return value;
  }

  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
