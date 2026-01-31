import { useState } from 'react'
import { Columns, Rows } from 'lucide-react'
import { PageTitle } from '@/components/Common/PageTitle'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import * as Diff from 'diff'
import { cn } from '@/lib/utils'

type ViewMode = 'split' | 'unified'

export function TextComparator() {
  const [originalText, setOriginalText] = useLocalStorage('diff-original', '')
  const [modifiedText, setModifiedText] = useLocalStorage('diff-modified', '')
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  const getDiff = () => Diff.diffLines(originalText, modifiedText)

  const diffBlockClass = 'rounded border-l-4 px-1 py-0.5 font-mono text-sm whitespace-pre-wrap break-words'

  const renderUnifiedView = () => {
    const diff = getDiff()

    return (
      <Card className="max-h-[600px] overflow-auto">
        <CardContent className="p-4 sm:pt-6 font-mono text-sm">
          {diff.map((part, index) => {
            const isAdded = part.added
            const isRemoved = part.removed
            const bg = isAdded
              ? 'bg-green-500/15 dark:bg-green-500/20'
              : isRemoved
                ? 'bg-red-500/15 dark:bg-red-500/20'
                : 'bg-transparent'
            const border = isAdded
              ? 'border-green-500'
              : isRemoved
                ? 'border-red-500'
                : 'border-transparent'
            const prefix = isAdded ? '+ ' : isRemoved ? '- ' : '  '

            return (
              <div
                key={index}
                className={cn(
                  diffBlockClass,
                  bg,
                  border,
                  isAdded && 'text-green-800 dark:text-green-200',
                  isRemoved && 'text-red-800 dark:text-red-200'
                )}
              >
                {part.value.split('\n').map((line, i) => (
                  <div key={i}>
                    {prefix}
                    {line}
                  </div>
                ))}
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  const renderSplitView = () => {
    const diff = getDiff()

    const originalLines: Array<{ text: string; removed?: boolean }> = []
    const modifiedLines: Array<{ text: string; added?: boolean }> = []

    diff.forEach((part) => {
      const lines = part.value.split('\n').filter((line) => line !== '')

      if (part.removed) {
        lines.forEach((line) => originalLines.push({ text: line, removed: true }))
      } else if (part.added) {
        lines.forEach((line) => modifiedLines.push({ text: line, added: true }))
      } else {
        lines.forEach((line) => {
          originalLines.push({ text: line })
          modifiedLines.push({ text: line })
        })
      }
    })

    const maxLength = Math.max(originalLines.length, modifiedLines.length)
    while (originalLines.length < maxLength) originalLines.push({ text: '' })
    while (modifiedLines.length < maxLength) modifiedLines.push({ text: '' })

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="max-h-[600px] overflow-auto">
          <CardHeader className="py-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Original
            </h3>
          </CardHeader>
          <CardContent className="space-y-0 p-4 pt-0 font-mono text-sm">
            {originalLines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  diffBlockClass,
                  line.removed && 'border-red-500 bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-200'
                )}
              >
                {line.text || '\u00A0'}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="max-h-[600px] overflow-auto">
          <CardHeader className="py-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Modified
            </h3>
          </CardHeader>
          <CardContent className="space-y-0 p-4 pt-0 font-mono text-sm">
            {modifiedLines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  diffBlockClass,
                  line.added &&
                    'border-green-500 bg-green-500/15 text-green-800 dark:bg-green-500/20 dark:text-green-200'
                )}
              >
                {line.text || '\u00A0'}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageTitle description="Compare two texts and see line-by-line differences.">Text Comparator</PageTitle>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as ViewMode)}
        >
          <ToggleGroupItem value="split">
            <Columns className="size-4" />
            Split
          </ToggleGroupItem>
          <ToggleGroupItem value="unified">
            <Rows className="size-4" />
            Unified
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-base font-semibold text-foreground">Original Text</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[240px] font-mono text-sm"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter original text here..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-base font-semibold text-foreground">Modified Text</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[240px] font-mono text-sm"
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                placeholder="Enter modified text here..."
              />
            </CardContent>
          </Card>
        </div>

        {(originalText || modifiedText) && (
          <div>
            <h2 className="mb-4 text-base font-semibold text-foreground">Comparison Result</h2>
            {viewMode === 'split' ? renderSplitView() : renderUnifiedView()}
          </div>
        )}
      </div>
    </div>
  )
}
