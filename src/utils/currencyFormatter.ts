// ─── Currency Formatter ─────────────────────────────────────────────────────
// Formats numbers as QAR currency strings.

export function formatCurrency(amount: number, currency: string = 'QAR'): string {
  return new Intl.NumberFormat('en-QA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `QAR ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `QAR ${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}
