export const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export const number = new Intl.NumberFormat('pt-BR');

export function formatDate(date: string | Date): string {
  const parsed = typeof date === 'string' ? new Date(`${date.slice(0, 10)}T12:00:00`) : date;
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('pt-BR');
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
