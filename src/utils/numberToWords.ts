const units = [
  '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis',
  'dezessete', 'dezoito', 'dezenove'
];

const tens = [
  '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta',
  'setenta', 'oitenta', 'noventa'
];

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 20) return units[num];
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 ? ' e ' + units[num % 10] : '');
  }
  return num.toString();
}

export function formatInstallationDays(days: number): string {
  const numberInWords = numberToWords(days);
  return `${numberInWords} ${days === 1 ? 'dia útil' : 'dias úteis'}`;
}