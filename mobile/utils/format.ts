export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value);
}

export function maskPhone(phone?: string | null) {
  if (!phone) return '';
  return phone.replace(/(\+?\d{2})(\d{3})(\d{2})(\d+)/, (_, c, a, b, d) => `${c} ${a}** ${b} ${d}`);
}
