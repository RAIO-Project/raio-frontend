export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatPoint(value: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(value)}P`
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
