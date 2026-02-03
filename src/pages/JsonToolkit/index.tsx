import { useState, useMemo } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { PageTitle } from '@/components/Common/PageTitle'
import { CopyButton } from '@/components/Common/CopyButton'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateJson, prettifyJson, minifyJson } from '@/utils/formatters/jsonFormatter'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/lib/utils'

export function JsonToolkit() {
  const [input, setInput] = useLocalStorage('json-input', '')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const hasContent = input.trim().length > 0
  const inputValidation = useMemo(
    () => (hasContent ? validateJson(input) : null),
    [input, hasContent]
  )

  const handleValidate = () => {
    const result = validateJson(input)
    if (result.valid) {
      setError('')
      setOutput('')
      setSuccess('✓ Valid JSON')
    } else {
      setError(result.error ?? 'Invalid JSON')
      setOutput('')
      setSuccess('')
    }
  }

  const handlePrettify = () => {
    try {
      const formatted = prettifyJson(input, 2)
      setOutput(formatted)
      setError('')
      setSuccess('')
    } catch {
      setError('Invalid JSON - cannot prettify')
      setOutput('')
      setSuccess('')
    }
  }

  const handleMinify = () => {
    try {
      const minified = minifyJson(input)
      setOutput(minified)
      setError('')
      setSuccess('')
    } catch {
      setError('Invalid JSON - cannot minify')
      setOutput('')
      setSuccess('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setSuccess('')
  }

  return (
    <div>
      <PageTitle description="Validate, format, and minify JSON with a single click.">JSON Toolkit</PageTitle>

      <div className="space-y-6">
        <div className="space-y-2">
            <div className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
              <h2 className="text-lg font-semibold text-foreground">Input</h2>
              <ButtonGroup aria-label="JSON actions">
                <Button variant="outline" size="sm" onClick={handleValidate}>
                  Validate
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrettify}>
                  Prettify
                </Button>
                <Button variant="outline" size="sm" onClick={handleMinify}>
                  Minify
                </Button>
                <ButtonGroupSeparator />
                <Button variant="destructive" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </ButtonGroup>
            </div>
            <div className="relative">
              <Textarea
                className={cn(
                  'min-h-[280px] font-mono text-sm pr-10',
                  'placeholder:text-muted-foreground focus-visible:ring-2'
                )}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Paste or type JSON here... e.g., {"name": "John", "age": 30}'
              />
              {hasContent && inputValidation !== null && (
                <span
                  className={cn(
                    'absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full',
                    inputValidation.valid
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/15 text-destructive'
                  )}
                  title={inputValidation.valid ? 'JSON válido' : inputValidation.error}
                  aria-label={inputValidation.valid ? 'JSON válido' : 'JSON inválido'}
                >
                  {inputValidation.valid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
        </div>

        {error && (
          <Alert variant="destructive" className="flex items-center justify-between">
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              aria-label="Fechar"
              className="hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setError('')}
            >
              ×
            </Button>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="flex items-center justify-between">
            <AlertDescription>{success}</AlertDescription>
            <Button
              variant="ghost"
              aria-label="Fechar"
              className="hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400"
              onClick={() => setSuccess('')}
            >
              ×
            </Button>
          </Alert>
        )}

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h2 className="text-base font-semibold text-foreground">Output</h2>
              <CopyButton text={output} size="icon" />
            </CardHeader>
            <CardContent>
              <Textarea
                className={cn(
                  'min-h-[280px] font-mono text-sm resize-none',
                  'bg-muted/30 read-only:opacity-100'
                )}
                value={output}
                readOnly
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
