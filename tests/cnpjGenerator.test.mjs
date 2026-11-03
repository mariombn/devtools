import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/utils/generators/cnpjGenerator.ts', import.meta.url), 'utf8')
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { generateCNPJ, validateCNPJ } = await import(`data:text/javascript,${encodeURIComponent(javascript)}`)

test('accepts the Receita Federal alphanumeric example and rejects altered check digits', () => {
  assert.equal(validateCNPJ('12.ABC.345/01DE-35'), true)
  assert.equal(validateCNPJ('12ABC34501DE35'), true)
  assert.equal(validateCNPJ('12.ABC.345/01DE-36'), false)
  assert.equal(validateCNPJ('12.ABC.345/01DE-3A'), false)
  assert.equal(validateCNPJ('12.ABC.345/01D!-35'), false)
})

test('default generation remains numeric and valid', () => {
  for (let i = 0; i < 100; i++) {
    const cnpj = generateCNPJ()
    assert.match(cnpj, /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/)
    assert.equal(validateCNPJ(cnpj), true)
  }
})

test('letter mode always includes a letter and preserves numeric check digits', () => {
  for (const formatted of [true, false]) {
    for (let i = 0; i < 100; i++) {
      const cnpj = generateCNPJ(formatted, true)
      const raw = cnpj.replace(/[.\/-]/g, '')
      assert.match(raw, /^[A-Z0-9]{8}0001\d{2}$/)
      assert.match(raw.slice(0, 8), /[A-Z]/)
      assert.equal(cnpj.includes('.'), formatted)
      assert.equal(validateCNPJ(cnpj), true)
    }
  }
})
