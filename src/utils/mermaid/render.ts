import type { MermaidConfig } from 'mermaid'

type MermaidApi = (typeof import('mermaid'))['default']

/**
 * Mermaid is a heavy dependency (~800 KB gzipped), so it is pulled in through a
 * dynamic import: Vite emits it as its own chunk that only downloads when this
 * page actually renders a diagram. The promise is memoized so subsequent renders
 * reuse the already-loaded module.
 */
let mermaidPromise: Promise<MermaidApi> | null = null

function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => mod.default)
  }
  return mermaidPromise
}

/**
 * Font stack used inside the diagram. Deliberately limited to system fonts: the
 * exported SVG is rasterized in an isolated <img> document that cannot reach the
 * page's web fonts, so a webfont here would silently fall back and make the PNG
 * look different from the preview.
 */
const FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'

function buildConfig(mode: 'light' | 'dark'): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: 'strict',
    // Mermaid otherwise injects its own error graphic into the document body.
    suppressErrorRendering: true,
    theme: mode === 'dark' ? 'dark' : 'default',
    fontFamily: FONT_FAMILY,
    // Labels must be native <text> nodes rather than <foreignObject> HTML:
    // browsers refuse to rasterize foreignObject content when an SVG is drawn
    // onto a canvas, which is exactly what PNG export does. This root-level flag
    // takes precedence over the (deprecated) per-diagram htmlLabels settings.
    htmlLabels: false,
  }
}

let renderCounter = 0

/** Thrown when the diagram source is not valid mermaid syntax. */
export class MermaidSyntaxError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MermaidSyntaxError'
  }
}

/**
 * Renders mermaid source to an SVG string.
 *
 * @throws {MermaidSyntaxError} when the source fails to parse.
 */
export async function renderMermaid(
  code: string,
  mode: 'light' | 'dark'
): Promise<string> {
  const mermaid = await loadMermaid()
  mermaid.initialize(buildConfig(mode))

  try {
    await mermaid.parse(code)
  } catch (error) {
    throw new MermaidSyntaxError(
      error instanceof Error ? error.message : String(error)
    )
  }

  renderCounter += 1
  const { svg } = await mermaid.render(`mermaid-render-${renderCounter}`, code)
  return svg
}
