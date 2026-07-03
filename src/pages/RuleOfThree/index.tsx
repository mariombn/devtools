import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { PageTitle } from '@/components/Common/PageTitle'
import { CopyButton } from '@/components/Common/CopyButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLanguage } from '@/i18n/LanguageContext'
import { solveRuleOfThree } from '@/utils/math/ruleOfThree'
import type { ProportionType } from '@/utils/math/ruleOfThree'

function parseValue(v: string): number | null {
  if (v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function formatNumber(n: number): string {
  // Trim floating-point artifacts (e.g. 0.30000000000000004 → 0.3)
  const rounded = Math.round(n * 1e10) / 1e10
  return String(rounded)
}

interface NumberFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function NumberField({ id, label, value, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function RuleOfThree() {
  const { t } = useLanguage()

  const [type, setType] = useState<ProportionType>('direct')
  const [a, setA] = useState('2')
  const [b, setB] = useState('10')
  const [c, setC] = useState('3')

  const na = parseValue(a)
  const nb = parseValue(b)
  const nc = parseValue(c)
  const complete = na !== null && nb !== null && nc !== null

  const result = useMemo(() => {
    if (na === null || nb === null || nc === null) return null
    return solveRuleOfThree({ a: na, b: nb, c: nc, type })
  }, [na, nb, nc, type])

  const xString = result?.ok ? formatNumber(result.x) : ''

  const xDisplay = !complete
    ? '?'
    : result?.ok
      ? xString
      : '—'

  const formula = useMemo(() => {
    if (!result?.ok || na === null || nb === null || nc === null) return ''
    const expr =
      type === 'direct'
        ? `(${formatNumber(nb)} × ${formatNumber(nc)}) ÷ ${formatNumber(na)}`
        : `(${formatNumber(na)} × ${formatNumber(nb)}) ÷ ${formatNumber(nc)}`
    return `X = ${expr} = ${xString}`
  }, [result, na, nb, nc, type, xString])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageTitle description={t('ruleOfThree.description')}>
        {t('ruleOfThree.title')}
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('ruleOfThree.inputTitle')}</CardTitle>
            <CardDescription>{t('ruleOfThree.inputDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <ToggleGroup
                value={type}
                onValueChange={(v) => setType(v as ProportionType)}
                className="w-fit"
              >
                <ToggleGroupItem value="direct">
                  {t('ruleOfThree.direct')}
                </ToggleGroupItem>
                <ToggleGroupItem value="inverse">
                  {t('ruleOfThree.inverse')}
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-sm text-muted-foreground">
                {type === 'direct'
                  ? t('ruleOfThree.directHint')
                  : t('ruleOfThree.inverseHint')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                <NumberField
                  id="rot-a"
                  label={t('ruleOfThree.valueA')}
                  value={a}
                  onChange={setA}
                />
                <ArrowRight className="mb-2.5 size-4 shrink-0 text-muted-foreground" />
                <NumberField
                  id="rot-b"
                  label={t('ruleOfThree.valueB')}
                  value={b}
                  onChange={setB}
                />
              </div>

              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <span className="h-px flex-1 bg-border" aria-hidden />
                {t('ruleOfThree.justAs')}
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                <NumberField
                  id="rot-c"
                  label={t('ruleOfThree.valueC')}
                  value={c}
                  onChange={setC}
                />
                <ArrowRight className="mb-2.5 size-4 shrink-0 text-muted-foreground" />
                <div className="space-y-2">
                  <Label>{t('ruleOfThree.unknown')}</Label>
                  <div className="flex h-9 items-center rounded-md border border-primary/40 bg-primary/5 px-3 text-sm font-semibold tabular-nums">
                    {xDisplay}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('ruleOfThree.resultTitle')}</CardTitle>
            <CardDescription>{t('ruleOfThree.resultDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!complete ? (
              <div className="space-y-1 py-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('ruleOfThree.emptyState')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('ruleOfThree.emptyStateHint')}
                </p>
              </div>
            ) : result && !result.ok ? (
              <div className="text-sm font-medium text-destructive">
                {t('ruleOfThree.errorDivByZero')}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      {t('ruleOfThree.valueOfX')}
                    </Label>
                    <CopyButton text={xString} />
                  </div>
                  <div className="rounded-md bg-secondary p-4 text-3xl font-bold tabular-nums">
                    {xString}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    {t('ruleOfThree.calculation')}
                  </Label>
                  <div className="rounded-md bg-secondary p-3 font-mono text-sm break-all">
                    {formula}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
