import { useMemo, useState, useRef, useEffect } from 'react'
import { PageTitle } from '@/components/Common/PageTitle'
import { CopyButton } from '@/components/Common/CopyButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { executeRegex } from '@/utils/regex/regexEngine'
import { commonPatterns } from '@/utils/regex/commonPatterns'
import type { RegexMatch } from '@/utils/regex/regexEngine'
import { Regex, ChevronDown, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ALL_FLAGS = ['g', 'i', 'm', 's', 'u'] as const

function buildHighlightedSegments(text: string, matches: RegexMatch[]) {
  if (matches.length === 0) return [text]

  const segments: (string | { text: string; index: number })[] = []
  let cursor = 0

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if (match.index > cursor) {
      segments.push(text.slice(cursor, match.index))
    }
    if (match.endIndex > cursor) {
      segments.push({ text: text.slice(match.index, match.endIndex), index: i })
      cursor = match.endIndex
    }
  }

  if (cursor < text.length) {
    segments.push(text.slice(cursor))
  }

  return segments
}

export function RegexTools() {
  const [pattern, setPattern] = useLocalStorage('regex-pattern', '')
  const [testString, setTestString] = useLocalStorage('regex-test-string', '')
  const [flags, setFlags] = useLocalStorage('regex-flags', 'g')
  const [showPatterns, setShowPatterns] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPatterns(false)
      }
    }
    if (showPatterns) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPatterns])

  const result = useMemo(
    () => executeRegex(pattern, flags, testString),
    [pattern, flags, testString]
  )

  const segments = useMemo(
    () => buildHighlightedSegments(testString, result.matches),
    [testString, result.matches]
  )

  const toggleFlag = (flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, '') : prev + flag))
  }

  const handleClear = () => {
    setPattern('')
    setTestString('')
    setFlags('g')
  }

  const loadPattern = (p: (typeof commonPatterns)[number]) => {
    setPattern(p.pattern)
    setFlags(p.flags)
    setTestString(p.example)
    setShowPatterns(false)
  }

  const matchSummary = result.matches
    .map((m, i) => `Match ${i + 1}: "${m.fullMatch}" (index ${m.index})`)
    .join('\n')

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <PageTitle description="Test and validate regular expressions with real-time match highlighting.">
        Regex Tools
      </PageTitle>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left pane - Input */}
        <div className="flex w-1/2 flex-col gap-3 overflow-hidden">
          {/* Pattern input */}
          <div className="space-y-2">
            <div className="flex flex-row flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-foreground">Pattern</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClear}
                className="gap-2"
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-sm">/</span>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="flex-1 font-mono text-sm"
              />
              <span className="text-muted-foreground font-mono text-sm">/</span>
              <div className="flex gap-1">
                {ALL_FLAGS.map((flag) => (
                  <Button
                    key={flag}
                    variant={flags.includes(flag) ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0 font-mono text-xs"
                    onClick={() => toggleFlag(flag)}
                  >
                    {flag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Validation error */}
          {result.error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {result.error}
            </div>
          )}

          {/* Common patterns */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setShowPatterns(!showPatterns)}
            >
              <ChevronDown
                className={cn('size-4 transition-transform', showPatterns && 'rotate-180')}
              />
              Common Patterns
            </Button>
            {showPatterns && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-64 w-80 overflow-auto rounded-lg border border-border bg-card p-1 shadow-lg">
                {commonPatterns.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className="flex w-full flex-col gap-0.5 rounded px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                    onClick={() => loadPattern(p)}
                  >
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Test string */}
          <div className="flex flex-1 flex-col gap-2 overflow-hidden">
            <h3 className="text-base font-semibold text-foreground">Test String</h3>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against the pattern..."
              className="flex-1 resize-none font-mono text-sm focus-visible:ring-0 focus-visible:border-border"
            />
          </div>
        </div>

        {/* Right pane - Results */}
        <div className="flex w-1/2 flex-col overflow-hidden rounded-lg border border-border bg-muted/40">
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Match Results</span>
              {result.matches.length > 0 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">
                  {result.matches.length} match{result.matches.length !== 1 && 'es'}
                </span>
              )}
            </div>
            {matchSummary && <CopyButton text={matchSummary} />}
          </div>

          <div className="flex-1 overflow-auto">
            {testString && pattern && !result.error ? (
              <div className="flex flex-col gap-0 divide-y divide-border">
                {/* Highlighted text */}
                <div className="p-4">
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Highlighted Matches
                  </h4>
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">
                    {segments.map((seg, i) =>
                      typeof seg === 'string' ? (
                        <span key={i}>{seg}</span>
                      ) : (
                        <mark
                          key={i}
                          className="rounded-sm bg-yellow-300/40 px-0.5 dark:bg-yellow-500/30"
                        >
                          {seg.text}
                        </mark>
                      )
                    )}
                  </pre>
                </div>

                {/* Match details */}
                {result.matches.length > 0 && (
                  <div className="p-4">
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Match Details
                    </h4>
                    <div className="space-y-2">
                      {result.matches.map((match, i) => (
                        <div
                          key={i}
                          className="rounded-md border border-border bg-card p-3 text-sm"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-medium text-foreground">
                              Match {i + 1}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              index {match.index}–{match.endIndex}
                            </span>
                          </div>
                          <code className="mt-1 block font-mono text-sm text-foreground">
                            "{match.fullMatch}"
                          </code>
                          {match.captures.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <span className="text-xs text-muted-foreground">Groups:</span>
                              {match.captures.map((cap, j) => (
                                <div key={j} className="ml-2 font-mono text-xs text-muted-foreground">
                                  ${j + 1}: "{cap ?? ''}"
                                </div>
                              ))}
                            </div>
                          )}
                          {Object.keys(match.groups).length > 0 && (
                            <div className="mt-2 space-y-1">
                              <span className="text-xs text-muted-foreground">Named Groups:</span>
                              {Object.entries(match.groups).map(([name, val]) => (
                                <div key={name} className="ml-2 font-mono text-xs text-muted-foreground">
                                  {name}: "{val ?? ''}"
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex size-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
                <div>
                  <Regex className="mx-auto mb-3 size-12 opacity-20" />
                  <p>Enter a pattern and test string</p>
                  <p className="mt-1 text-xs">Matches will be highlighted in real time</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
