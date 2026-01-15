export function generateCEP(formatted: boolean = true): string {
  const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');

  if (formatted) {
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  return digits;
}
