const SVG_NS = 'http://www.w3.org/2000/svg'

/** Browsers cap canvas dimensions; going past this yields a blank image. */
const MAX_CANVAS_DIMENSION = 16384

interface ViewBox {
  minX: number
  minY: number
  width: number
  height: number
}

function parseViewBox(svg: SVGSVGElement): ViewBox | null {
  const raw = svg.getAttribute('viewBox')
  if (!raw) return null

  const parts = raw.trim().split(/[\s,]+/).map(Number)
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null

  const [minX, minY, width, height] = parts
  if (width <= 0 || height <= 0) return null

  return { minX, minY, width, height }
}

/**
 * Intrinsic size of the diagram in SVG user units.
 *
 * The viewBox is the only trustworthy source here: the live element sits inside a
 * CSS-transformed zoom/pan wrapper, so `getBoundingClientRect()` would report the
 * on-screen size rather than the diagram's own dimensions.
 */
export function getSvgSize(svg: SVGSVGElement): { width: number; height: number } {
  const viewBox = parseViewBox(svg)
  if (viewBox) return { width: viewBox.width, height: viewBox.height }

  const width = Number.parseFloat(svg.getAttribute('width') ?? '')
  const height = Number.parseFloat(svg.getAttribute('height') ?? '')
  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return { width, height }
  }

  return { width: 800, height: 600 }
}

interface CloneOptions {
  /** Solid backdrop painted behind the diagram; omit for a transparent export. */
  background?: string
}

function prepareClone(svg: SVGSVGElement, options: CloneOptions = {}): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const { width, height } = getSvgSize(svg)

  clone.setAttribute('xmlns', SVG_NS)
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))
  if (!clone.getAttribute('viewBox')) {
    clone.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }
  // Mermaid pins an inline `max-width` so the diagram shrinks into its container;
  // left in place it clips the exported image.
  clone.style.removeProperty('max-width')

  if (options.background) {
    const viewBox = parseViewBox(clone)
    const backdrop = document.createElementNS(SVG_NS, 'rect')
    backdrop.setAttribute('x', String(viewBox?.minX ?? 0))
    backdrop.setAttribute('y', String(viewBox?.minY ?? 0))
    backdrop.setAttribute('width', String(viewBox?.width ?? width))
    backdrop.setAttribute('height', String(viewBox?.height ?? height))
    backdrop.setAttribute('fill', options.background)
    clone.insertBefore(backdrop, clone.firstChild)
  }

  return clone
}

/** Serializes a rendered diagram into a standalone SVG document string. */
export function serializeSvg(svg: SVGSVGElement, options: CloneOptions = {}): string {
  const clone = prepareClone(svg, options)
  const markup = new XMLSerializer().serializeToString(clone)
  return `<?xml version="1.0" encoding="UTF-8"?>\n${markup}`
}

export function svgToSvgBlob(svg: SVGSVGElement, options: CloneOptions = {}): Blob {
  return new Blob([serializeSvg(svg, options)], {
    type: 'image/svg+xml;charset=utf-8',
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not rasterize the diagram SVG'))
    image.src = src
  })
}

export interface SvgToPngOptions extends CloneOptions {
  /** Pixel-density multiplier applied to the intrinsic size. Defaults to 2. */
  scale?: number
}

/**
 * Rasterizes a rendered diagram into a PNG blob.
 *
 * The SVG is serialized to a data URI and drawn onto a canvas. Data URIs count as
 * same-origin, so the canvas stays untainted and `toBlob` is allowed to read it.
 */
export async function svgToPngBlob(
  svg: SVGSVGElement,
  options: SvgToPngOptions = {}
): Promise<Blob> {
  const { scale = 2, background } = options
  const { width, height } = getSvgSize(svg)

  // Keep the requested density unless it would blow past the canvas limit.
  const cap = MAX_CANVAS_DIMENSION / Math.max(width, height)
  const effectiveScale = Math.max(1, Math.min(scale, cap))

  // The background is painted on the canvas, so it must not be baked into the
  // serialized SVG as well.
  const markup = serializeSvg(svg)
  const image = await loadImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  )

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * effectiveScale))
  canvas.height = Math.max(1, Math.round(height * effectiveScale))

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D context is unavailable')

  if (background) {
    context.fillStyle = background
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  )
  if (!blob) throw new Error('Could not encode the diagram as PNG')

  return blob
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Revoking synchronously can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
