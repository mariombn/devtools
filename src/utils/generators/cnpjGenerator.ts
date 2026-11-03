const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

function checkDigit(value: string, weights: number[]): number {
  const sum = [...value].reduce(
    (total, character, index) =>
      total + (character.charCodeAt(0) - 48) * weights[index],
    0
  )
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function generateCNPJ(formatted: boolean = true, withLetters: boolean = false): string {
  // Mantém a primeira filial (0001) e garante uma letra no modo alfanumérico.
  const root = Array.from({ length: 8 }, () =>
    ALPHANUMERIC[Math.floor(Math.random() * (withLetters ? ALPHANUMERIC.length : 10))]
  )
  if (withLetters) {
    root[Math.floor(Math.random() * root.length)] =
      LETTERS[Math.floor(Math.random() * LETTERS.length)]
  }

  const base = root.join('') + '0001'
  const firstDigit = checkDigit(base, WEIGHTS_1)
  const cnpj = base + firstDigit + checkDigit(base + firstDigit, WEIGHTS_2)

  return formatted
    ? cnpj.replace(/(.{2})(.{3})(.{3})(.{4})(\d{2})/, '$1.$2.$3/$4-$5')
    : cnpj
}

export function validateCNPJ(cnpj: string): boolean {
  const clean = cnpj.toUpperCase().replace(/[./-]/g, '')
  if (!/^[A-Z0-9]{12}\d{2}$/.test(clean)) return false
  if (/^(\d)\1{13}$/.test(clean)) return false

  const base = clean.slice(0, 12)
  const firstDigit = checkDigit(base, WEIGHTS_1)
  return clean.slice(12) === `${firstDigit}${checkDigit(base + firstDigit, WEIGHTS_2)}`
}
