export function formatCompactNumber(value = 0) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}천`
  return String(value)
}

export function formatPoint(value = 0) {
  return `${Number(value || 0).toLocaleString()}P`
}

export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
