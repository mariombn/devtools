export type PhoneType = 'mobile' | 'landline';

export interface PhoneOptions {
  type?: PhoneType;
  withDDD?: boolean;
  formatted?: boolean;
}

export function generatePhone(options: PhoneOptions = {}): string {
  const { type = 'mobile', withDDD = true, formatted = true } = options;

  // DDD aleatório (11 a 99)
  const ddd = Math.floor(Math.random() * 89) + 11;

  let number: string;
  if (type === 'mobile') {
    // Celular: 9XXXX-XXXX
    const firstDigit = 9;
    const remainingDigits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
    number = `${firstDigit}${remainingDigits}`;
  } else {
    // Fixo: 2-5XXX-XXXX
    const firstDigit = Math.floor(Math.random() * 4) + 2; // 2, 3, 4 ou 5
    const remainingDigits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
    number = `${firstDigit}${remainingDigits}`;
  }

  if (!withDDD) {
    if (formatted && type === 'mobile') {
      return number.replace(/(\d{5})(\d{4})/, '$1-$2');
    }
    if (formatted && type === 'landline') {
      return number.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    return number;
  }

  const fullNumber = `${ddd}${number}`;

  if (formatted) {
    if (type === 'mobile') {
      return fullNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return fullNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return fullNumber;
}
