import { generateCPF } from './cpfGenerator'

export type InternationalCountryCode =
  | 'AR' | 'BO' | 'BR' | 'CL' | 'CO' | 'CR' | 'CU' | 'DO' | 'EC' | 'GT'
  | 'HN' | 'HT' | 'MX' | 'NI' | 'PA' | 'PE' | 'PR' | 'PY' | 'SG' | 'SV'
  | 'UY' | 'VE'

export interface InternationalDocument {
  id: string
  label: string
}

export interface InternationalCountry {
  code: InternationalCountryCode
  name: string
  callingCode: string
  phoneDigits: number
  postalDigits: number
  documents: InternationalDocument[]
}

export const INTERNATIONAL_COUNTRIES: InternationalCountry[] = [
  { code: 'AR', name: 'Argentina', callingCode: '54', phoneDigits: 10, postalDigits: 4, documents: [{ id: 'dni', label: 'DNI' }] },
  { code: 'BO', name: 'Bolívia', callingCode: '591', phoneDigits: 8, postalDigits: 4, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'BR', name: 'Brasil', callingCode: '55', phoneDigits: 11, postalDigits: 8, documents: [{ id: 'cpf', label: 'CPF' }] },
  { code: 'CL', name: 'Chile', callingCode: '56', phoneDigits: 9, postalDigits: 6, documents: [{ id: 'run', label: 'RUN' }] },
  { code: 'CO', name: 'Colômbia', callingCode: '57', phoneDigits: 10, postalDigits: 6, documents: [{ id: 'cc', label: 'CC' }, { id: 'ti', label: 'TI' }, { id: 'nit', label: 'NIT' }, { id: 'rc', label: 'RC' }] },
  { code: 'CR', name: 'Costa Rica', callingCode: '506', phoneDigits: 8, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'CU', name: 'Cuba', callingCode: '53', phoneDigits: 8, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'DO', name: 'República Dominicana', callingCode: '1', phoneDigits: 10, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'EC', name: 'Equador', callingCode: '593', phoneDigits: 9, postalDigits: 6, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'SV', name: 'El Salvador', callingCode: '503', phoneDigits: 8, postalDigits: 4, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'GT', name: 'Guatemala', callingCode: '502', phoneDigits: 8, postalDigits: 5, documents: [{ id: 'dpi', label: 'DPI' }] },
  { code: 'HT', name: 'Haiti', callingCode: '509', phoneDigits: 8, postalDigits: 4, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'HN', name: 'Honduras', callingCode: '504', phoneDigits: 8, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'MX', name: 'México', callingCode: '52', phoneDigits: 10, postalDigits: 5, documents: [{ id: 'curp', label: 'CURP' }, { id: 'ine', label: 'INE' }] },
  { code: 'NI', name: 'Nicarágua', callingCode: '505', phoneDigits: 8, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'PA', name: 'Panamá', callingCode: '507', phoneDigits: 8, postalDigits: 4, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'PY', name: 'Paraguai', callingCode: '595', phoneDigits: 9, postalDigits: 4, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'PE', name: 'Peru', callingCode: '51', phoneDigits: 9, postalDigits: 5, documents: [{ id: 'dni', label: 'DNI' }] },
  { code: 'PR', name: 'Porto Rico', callingCode: '1', phoneDigits: 10, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'UY', name: 'Uruguai', callingCode: '598', phoneDigits: 8, postalDigits: 5, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'VE', name: 'Venezuela', callingCode: '58', phoneDigits: 10, postalDigits: 4, documents: [{ id: 'ci', label: 'CI' }] },
  { code: 'SG', name: 'Singapura', callingCode: '65', phoneDigits: 8, postalDigits: 6, documents: [{ id: 'nric', label: 'NRIC' }] },
]

const digits = (length: number, firstNonZero = false) =>
  Array.from({ length }, (_, index) =>
    String(Math.floor(Math.random() * (index === 0 && firstNonZero ? 9 : 10)) + (index === 0 && firstNonZero ? 1 : 0))
  ).join('')

const letters = (length: number) =>
  Array.from({ length }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join('')

function chileRun(formatted: boolean): string {
  const body = digits(8, true)
  let multiplier = 2
  let sum = 0
  for (let index = body.length - 1; index >= 0; index--) {
    sum += Number(body[index]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const result = 11 - (sum % 11)
  const checkDigit = result === 11 ? '0' : result === 10 ? 'K' : String(result)
  return formatted ? `${body}-${checkDigit}` : `${body}${checkDigit}`
}

function singaporeNric(): string {
  const body = digits(7)
  const weights = [2, 7, 6, 5, 4, 3, 2]
  const sum = body.split('').reduce((total, value, index) => total + Number(value) * weights[index], 0)
  const checkDigit = 'JZIHGFEDCBA'[sum % 11]
  return `S${body}${checkDigit}`
}

function colombiaNit(formatted: boolean): string {
  const body = digits(9, true)
  const weights = [41, 37, 29, 23, 19, 17, 13, 7, 3]
  const sum = body.split('').reduce((total, value, index) => total + Number(value) * weights[index], 0)
  const remainder = sum % 11
  const checkDigit = remainder < 2 ? remainder : 11 - remainder
  return formatted ? `${body}-${checkDigit}` : `${body}${checkDigit}`
}

export function generateInternationalDocument(
  countryCode: InternationalCountryCode,
  documentId: string,
  formatted = true
): string {
  if (countryCode === 'BR' && documentId === 'cpf') return generateCPF(formatted)
  if (countryCode === 'CL' && documentId === 'run') return chileRun(formatted)
  if (countryCode === 'SG' && documentId === 'nric') return singaporeNric()
  if (countryCode === 'CO' && documentId === 'nit') return colombiaNit(formatted)
  if (countryCode === 'CO' && documentId === 'rc') return `${Math.random() < 0.5 ? '1' : letters(2)}${digits(9)}`
  if (countryCode === 'MX' && documentId === 'curp') return `${letters(4)}${digits(6)}${Math.random() < 0.5 ? 'H' : 'M'}${letters(5)}${Math.random() < 0.5 ? letters(1) : digits(1)}${digits(1)}`
  if (countryCode === 'MX' && documentId === 'ine') return `${letters(6)}${digits(8)}${Math.random() < 0.5 ? 'H' : 'M'}${digits(3)}`

  const lengths: Partial<Record<InternationalCountryCode, number>> = {
    AR: 8, BO: 8, CO: documentId === 'ti' ? 10 : 9, CR: 9, CU: 11,
    DO: 11, EC: 10, SV: 9, GT: 10, HT: 8, HN: 8, NI: 8,
    PA: 8, PY: 8, PE: 8, PR: 9, UY: 8, VE: 8,
  }
  const value = digits(lengths[countryCode] ?? 8, true)
  if (!formatted) return value

  if (countryCode === 'AR') return value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3')
  if (countryCode === 'CR') return value.replace(/(\d)(\d{4})(\d{4})/, '$1-$2-$3')
  if (countryCode === 'DO') return value.replace(/(\d{3})(\d{7})(\d)/, '$1-$2-$3')
  if (countryCode === 'SV') return value.replace(/(\d{8})(\d)/, '$1-$2')
  if (countryCode === 'UY') return value.replace(/(\d)(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4')
  return value
}

export function generateInternationalPhone(countryCode: InternationalCountryCode): string {
  const country = INTERNATIONAL_COUNTRIES.find(({ code }) => code === countryCode)
  if (!country) return ''

  let nationalNumber = digits(country.phoneDigits)
  if (countryCode === 'BR') nationalNumber = `${digits(2, true)}9${digits(8)}`
  if (countryCode === 'SG') nationalNumber = `${[3, 6, 8, 9][Math.floor(Math.random() * 4)]}${digits(7)}`
  return `+${country.callingCode}${nationalNumber}`
}

export function generateInternationalPostalCode(
  countryCode: InternationalCountryCode,
  formatted = true
): string {
  const country = INTERNATIONAL_COUNTRIES.find(({ code }) => code === countryCode)
  if (!country) return ''

  if (countryCode === 'AR') {
    const value = `${letters(1)}${digits(4)}`
    return formatted && Math.random() < 0.5 ? `${value}${letters(3)}` : value
  }

  const value = digits(country.postalDigits)
  if (formatted && countryCode === 'BR') return value.replace(/(\d{5})(\d{3})/, '$1-$2')
  return value
}
