// Rule of three (regra de três) — pure solver for a simple proportion.
//
// Layout of the classic cross:
//
//   A  →  B
//   C  →  X
//
// Direct proportion  (A/B = C/X):   X = (B · C) / A
// Inverse proportion (A·B = C·X):   X = (A · B) / C

export type ProportionType = 'direct' | 'inverse'

export interface RuleOfThreeInput {
  a: number
  b: number
  c: number
  type: ProportionType
}

export type RuleOfThreeError = 'divByZero'

export type RuleOfThreeResult =
  | { ok: true; x: number }
  | { ok: false; error: RuleOfThreeError }

export function solveRuleOfThree({ a, b, c, type }: RuleOfThreeInput): RuleOfThreeResult {
  if (type === 'direct') {
    // A/B = C/X  →  X = (B · C) / A
    if (a === 0) return { ok: false, error: 'divByZero' }
    return { ok: true, x: (b * c) / a }
  }

  // Inverse: A · B = C · X  →  X = (A · B) / C
  if (c === 0) return { ok: false, error: 'divByZero' }
  return { ok: true, x: (a * b) / c }
}
