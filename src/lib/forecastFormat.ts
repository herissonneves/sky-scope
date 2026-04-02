/**
 * Formatting helpers for One Call `daily` entries (timezone-aware day labels).
 */

/**
 * Short weekday + date in the API’s IANA timezone (e.g. `America/Sao_Paulo`).
 */
export function formatForecastDayLabel(dtUnixSeconds: number, ianaTimeZone: string): string {
  const date = new Date(dtUnixSeconds * 1000);
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: ianaTimeZone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  }
}
