export function generateCPF(formatted: boolean = true): string {
  // Gera 9 dígitos aleatórios
  const randomDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += randomDigits[i] * (10 - i);
  }
  const firstDigit = (sum * 10) % 11;
  const digit1 = firstDigit === 10 ? 0 : firstDigit;

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += randomDigits[i] * (11 - i);
  }
  sum += digit1 * 2;
  const secondDigit = (sum * 10) % 11;
  const digit2 = secondDigit === 10 ? 0 : secondDigit;

  const cpfArray = [...randomDigits, digit1, digit2];
  const cpf = cpfArray.join('');

  if (formatted) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return cpf;
}
