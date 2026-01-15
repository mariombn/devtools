export function generateCNPJ(formatted: boolean = true): string {
  // Gera 8 dígitos aleatórios + 0001 (filial)
  const randomDigits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
  const branchDigits = [0, 0, 0, 1]; // Primeira filial
  const baseDigits = [...randomDigits, ...branchDigits];

  // Calcula o primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += baseDigits[i] * weights1[i];
  }
  const remainder1 = sum % 11;
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;

  // Calcula o segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += baseDigits[i] * weights2[i];
  }
  sum += digit1 * weights2[12];
  const remainder2 = sum % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

  const cnpjArray = [...baseDigits, digit1, digit2];
  const cnpj = cnpjArray.join('');

  if (formatted) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return cnpj;
}
