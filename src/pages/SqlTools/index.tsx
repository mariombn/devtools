import { useState } from 'react'
import { format } from 'sql-formatter'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PageTitle } from '@/components/Common/PageTitle'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Textarea } from '@/components/ui/textarea'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Wand2, Trash2 } from 'lucide-react'
import { CopyButton } from '@/components/Common/CopyButton'

const defaultSQL = `select u.id, u.name, u.email, o.order_date, o.total from users u inner join orders o on u.id = o.user_id where o.status = 'completed' order by o.order_date desc;`

export function SqlTools() {
  const [inputSQL, setInputSQL] = useLocalStorage('sql-input', defaultSQL)
  const [formattedSQL, setFormattedSQL] = useState('')
  const [error, setError] = useState('')
  const isDark = document.documentElement.classList.contains('dark')

  const handleFormat = () => {
    try {
      setError('')
      const formatted = format(inputSQL, {
        language: 'sql',
        tabWidth: 2,
        keywordCase: 'lower',
        linesBetweenQueries: 2,
      })
      setFormattedSQL(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error formatting SQL')
      setFormattedSQL('')
    }
  }

  const handleClear = () => {
    setInputSQL('')
    setFormattedSQL('')
    setError('')
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <PageTitle description="Format and beautify SQL queries with proper indentation and syntax.">SQL Tools</PageTitle>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Input */}
        <div className="flex w-1/2 flex-col gap-3 overflow-hidden">
          <div className="flex flex-row flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">SQL Input</h3>
            <ButtonGroup aria-label="SQL actions">
              <Button variant="outline" size="sm" onClick={handleFormat} className="gap-2">
                <Wand2 className="size-4" />
                Format
              </Button>
              <ButtonGroupSeparator />
              <Button variant="destructive" size="sm" onClick={handleClear} className="gap-2">
                <Trash2 className="size-4" />
                Clear
              </Button>
            </ButtonGroup>
          </div>

          <Textarea
            value={inputSQL}
            onChange={(e) => setInputSQL(e.target.value)}
            placeholder="Paste your SQL here to format..."
            className="flex-1 resize-none font-mono text-sm focus-visible:ring-0 focus-visible:border-border"
          />

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex w-1/2 flex-col overflow-hidden rounded-lg border border-border bg-muted/40">
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-medium text-muted-foreground">Formatted SQL</span>
            {formattedSQL && <CopyButton text={formattedSQL} />}
          </div>

          <div className="flex-1 overflow-auto">
            {formattedSQL ? (
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={(isDark ? vscDarkPlus : vs) as any}
                language="sql"
                PreTag="div"
                customStyle={{
                  margin: 0,
                  height: '100%',
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                  background: 'transparent',
                }}
                showLineNumbers
              >
                {formattedSQL}
              </SyntaxHighlighter>
            ) : (
              <div className="flex size-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
                <div>
                  <Wand2 className="mx-auto mb-3 size-12 opacity-20" />
                  <p>Paste your SQL and click "Format"</p>
                  <p className="mt-1 text-xs">The formatted output will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
