import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FileImage,
  FileCode2,
  Loader2,
  Minus,
  Plus,
  Trash2,
  Maximize2,
} from 'lucide-react'
import { PageTitle } from '@/components/Common/PageTitle'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLanguage } from '@/i18n/LanguageContext'
import { useTheme } from '@/theme/ThemeProvider'
import { cn } from '@/lib/utils'
import { defaultMermaidCode, mermaidExamples } from '@/utils/mermaid/examples'
import { renderMermaid } from '@/utils/mermaid/render'
import { downloadBlob, svgToPngBlob, svgToSvgBlob } from '@/utils/mermaid/svgExport'

const RENDER_DEBOUNCE_MS = 400
const MIN_ZOOM = 0.2
const MAX_ZOOM = 5
const ZOOM_STEP = 1.25
const MIN_SPLIT = 20
const MAX_SPLIT = 80
const DEFAULT_SPLIT = 50
const DESKTOP_QUERY = '(min-width: 1024px)'

/** Concrete backdrop colors — a canvas fill cannot resolve CSS variables. */
const BACKGROUND_COLORS = { light: '#ffffff', dark: '#0a0a0a' } as const

interface ViewState {
  zoom: number
  x: number
  y: number
}

const INITIAL_VIEW: ViewState = { zoom: 1, x: 0, y: 0 }

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

function clampSplit(value: number): number {
  return Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, value))
}

export function MermaidDiagrams() {
  const { t } = useLanguage()
  const { mode } = useTheme()

  const [code, setCode] = useLocalStorage('mermaid-input', defaultMermaidCode)
  const [svg, setSvg] = useState('')
  const [renderError, setRenderError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)

  const [view, setView] = useState<ViewState>(INITIAL_VIEW)
  const [isPanning, setIsPanning] = useState(false)

  const [pngScale, setPngScale] = useState('2')
  const [transparent, setTransparent] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [splitRatio, setSplitRatio] = useLocalStorage('mermaid-split-ratio', DEFAULT_SPLIT)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)

  const viewportRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const splitDragPointerId = useRef<number | null>(null)

  // ── Rendering ────────────────────────────────────────────────────────────

  useEffect(() => {
    const source = code.trim()
    if (!source) {
      setSvg('')
      setRenderError(null)
      setIsRendering(false)
      return
    }

    let cancelled = false
    setIsRendering(true)

    const timer = setTimeout(() => {
      renderMermaid(source, mode)
        .then((result) => {
          if (cancelled) return
          setSvg(result)
          setRenderError(null)
        })
        .catch((error: unknown) => {
          if (cancelled) return
          // The previous diagram stays on screen so a typo mid-edit does not
          // blank out the preview.
          setRenderError(error instanceof Error ? error.message : String(error))
        })
        .finally(() => {
          if (!cancelled) setIsRendering(false)
        })
    }, RENDER_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [code, mode])

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // ── Zoom & pan ───────────────────────────────────────────────────────────

  // Registered natively because React's synthetic wheel listener is passive,
  // which forbids preventDefault().
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      if (event.ctrlKey || event.metaKey) {
        const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
        setView((prev) => ({ ...prev, zoom: clampZoom(prev.zoom * factor) }))
        return
      }

      setView((prev) => ({
        ...prev,
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }))
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [])

  const panOrigin = useRef<{
    pointerId: number
    startX: number
    startY: number
    viewX: number
    viewY: number
  } | null>(null)

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !svg) return
    panOrigin.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      viewX: view.x,
      viewY: view.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsPanning(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const origin = panOrigin.current
    if (!origin || origin.pointerId !== event.pointerId) return
    setView((prev) => ({
      ...prev,
      x: origin.viewX + (event.clientX - origin.startX),
      y: origin.viewY + (event.clientY - origin.startY),
    }))
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (panOrigin.current?.pointerId !== event.pointerId) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    panOrigin.current = null
    setIsPanning(false)
  }

  const zoomBy = (factor: number) =>
    setView((prev) => ({ ...prev, zoom: clampZoom(prev.zoom * factor) }))

  const resetView = () => setView(INITIAL_VIEW)

  const handleSplitPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    splitDragPointerId.current = event.pointerId
  }

  const handleSplitPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (splitDragPointerId.current !== event.pointerId) return
    const rect = splitContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    const ratio = ((event.clientX - rect.left) / rect.width) * 100
    setSplitRatio(clampSplit(ratio))
  }

  const handleSplitPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (splitDragPointerId.current !== event.pointerId) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    splitDragPointerId.current = null
  }

  const resetSplit = () => setSplitRatio(DEFAULT_SPLIT)

  // ── Actions ──────────────────────────────────────────────────────────────

  const loadExample = (source: string) => {
    setCode(source)
    resetView()
    setExportError(null)
  }

  const clearCode = () => {
    setCode('')
    resetView()
    setExportError(null)
  }

  const exportDiagram = useCallback(
    async (format: 'png' | 'svg') => {
      const element = diagramRef.current?.querySelector('svg')
      if (!element) return

      const background = transparent ? undefined : BACKGROUND_COLORS[mode]

      setIsExporting(true)
      setExportError(null)
      try {
        const blob =
          format === 'png'
            ? await svgToPngBlob(element, { scale: Number(pngScale), background })
            : svgToSvgBlob(element, { background })
        downloadBlob(blob, `diagram.${format}`)
      } catch (error: unknown) {
        setExportError(error instanceof Error ? error.message : String(error))
      } finally {
        setIsExporting(false)
      }
    },
    [mode, pngScale, transparent]
  )

  const hasDiagram = Boolean(svg)

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <PageTitle description={t('mermaid.description')}>{t('mermaid.title')}</PageTitle>

      <div
        ref={splitContainerRef}
        className="flex flex-1 flex-col gap-6 overflow-hidden lg:flex-row lg:gap-0"
      >
        {/* Editor */}
        <div
          className="flex flex-col gap-3 overflow-hidden"
          style={isDesktop ? { width: `${splitRatio}%` } : undefined}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {t('mermaid.editorTitle')}
            </h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCode}
              disabled={!code}
              className="gap-2"
            >
              <Trash2 className="size-4" />
              {t('common.clear')}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('mermaid.examples')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {mermaidExamples.map((example) => (
                <Button
                  key={example.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example.code)}
                >
                  {example.label}
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={t('mermaid.placeholder')}
            spellCheck={false}
            className="min-h-64 flex-1 resize-none font-mono text-sm focus-visible:border-border focus-visible:ring-0"
          />
        </div>

        {isDesktop && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={t('mermaid.resizeSplit')}
            title={t('mermaid.resizeSplit')}
            onPointerDown={handleSplitPointerDown}
            onPointerMove={handleSplitPointerMove}
            onPointerUp={handleSplitPointerUp}
            onPointerCancel={handleSplitPointerUp}
            onDoubleClick={resetSplit}
            className="group relative flex w-3 shrink-0 cursor-col-resize touch-none items-center justify-center"
          >
            <div className="h-full w-px bg-border transition-colors group-hover:bg-primary/60 group-active:bg-primary" />
          </div>
        )}

        {/* Preview */}
        <div
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-muted/40"
          style={isDesktop ? { width: `${100 - splitRatio}%` } : undefined}
        >
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t('mermaid.previewTitle')}
              </span>
              {isRendering && (
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => zoomBy(1 / ZOOM_STEP)}
                disabled={!hasDiagram}
                aria-label={t('mermaid.zoomOut')}
                title={t('mermaid.zoomOut')}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-12 text-center text-xs font-medium tabular-nums text-muted-foreground">
                {Math.round(view.zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => zoomBy(ZOOM_STEP)}
                disabled={!hasDiagram}
                aria-label={t('mermaid.zoomIn')}
                title={t('mermaid.zoomIn')}
              >
                <Plus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={resetView}
                disabled={!hasDiagram}
                aria-label={t('mermaid.resetView')}
                title={t('mermaid.resetView')}
              >
                <Maximize2 className="size-4" />
              </Button>
            </div>
          </div>

          {renderError && (
            <div className="shrink-0 border-b border-destructive/40 bg-destructive/10 px-4 py-2">
              <p className="text-xs font-medium text-destructive">
                {t('mermaid.syntaxError')}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap break-words font-mono text-xs text-destructive/80">
                {renderError}
              </p>
            </div>
          )}

          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              'relative flex flex-1 items-center justify-center overflow-hidden touch-none',
              hasDiagram && (isPanning ? 'cursor-grabbing' : 'cursor-grab')
            )}
          >
            {hasDiagram ? (
              <div
                ref={diagramRef}
                className="max-w-none"
                style={{
                  transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                }}
                // Mermaid sanitizes its own output (securityLevel: 'strict') and the
                // source is the user's own text, processed entirely in the browser.
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <div className="px-6 text-center">
                <p className="text-sm font-medium text-foreground">
                  {t('mermaid.emptyState')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('mermaid.emptyStateHint')}
                </p>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground">{t('mermaid.viewHint')}</p>

            {exportError && (
              <p className="text-xs text-destructive">
                {t('mermaid.exportError')} {exportError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t('mermaid.exportScale')}
                  </span>
                  <ToggleGroup value={pngScale} onValueChange={setPngScale}>
                    {['1', '2', '3'].map((value) => (
                      <ToggleGroupItem
                        key={value}
                        value={value}
                        className="px-2 py-1 text-xs"
                      >
                        {value}x
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={transparent}
                    onCheckedChange={(checked) => setTransparent(checked === true)}
                  />
                  {t('mermaid.transparentBackground')}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportDiagram('svg')}
                  disabled={!hasDiagram || isExporting}
                  className="gap-2"
                >
                  <FileCode2 className="size-4" />
                  {t('mermaid.downloadSvg')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => exportDiagram('png')}
                  disabled={!hasDiagram || isExporting}
                  className="gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileImage className="size-4" />
                  )}
                  {t('mermaid.downloadPng')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
