# Mermaid Resizable Split + Fullscreen Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users drag the boundary between the Mermaid code editor and diagram preview to resize either pane, and let them view the diagram preview in fullscreen.

**Architecture:** Both features are implemented entirely inside the existing single-file page component `src/pages/MermaidDiagrams/index.tsx`, reusing the pointer-capture drag pattern already used there for diagram panning. No new components, no new dependencies.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS 4, lucide-react icons, the project's own `useLocalStorage` hook and `useLanguage`/`t()` i18n hook.

## Global Constraints

- No new npm dependencies — implement the divider drag with native Pointer Events, matching the existing pan handlers in this file.
- This repo has **no automated test framework** (`package.json` only defines `dev`, `build`, `lint`, `preview` — confirmed, no vitest/jest/testing-library installed). Verification for every task is: `npm run build` (TypeScript project build + Vite build, catches type errors) + `npm run lint`, followed by manual verification in the browser via `npm run dev`, per this project's own CLAUDE.md guidance for UI changes. This replaces the usual write-test/run-test steps in this plan's tasks.
- Resizable split only applies at the `lg` breakpoint (`min-width: 1024px`) — detect it with `window.matchMedia('(min-width: 1024px)')`, kept in sync with a `change` listener. Below that width, layout is untouched (stacked, as today).
- Split ratio persists via the existing `useLocalStorage` hook (key: `mermaid-split-ratio`), clamped to `[20, 80]`. Fullscreen state is plain `useState`, never persisted.
- All new user-facing strings go in **both** `src/i18n/locales/en.ts` and `src/i18n/locales/pt.ts`, under the existing `mermaid` key — follow the existing key style there (short camelCase, present-tense action labels).
- Follow existing code conventions in the file: `React.PointerEvent<HTMLDivElement>` handler types, `cn()` from `@/lib/utils` for conditional classNames, `t('mermaid.xxx')` for all copy.

---

### Task 1: Resizable split between editor and preview

**Files:**
- Modify: `src/pages/MermaidDiagrams/index.tsx`
- Modify: `src/i18n/locales/en.ts:279-298` (type block), `src/i18n/locales/en.ts:601-620` (value block)
- Modify: `src/i18n/locales/pt.ts:311-329` (value block)

**Interfaces:**
- Produces: `splitRatio: number` (0-100, % width of the editor pane), `isDesktop: boolean`, `splitContainerRef: React.RefObject<HTMLDivElement>`, `clampSplit(value: number): number`, constants `MIN_SPLIT`, `MAX_SPLIT`, `DEFAULT_SPLIT`, `DESKTOP_QUERY`. Task 2 reads `isDesktop` and reuses the same container/pane JSX structure.

- [ ] **Step 1: Add split constants and clamp helper**

In `src/pages/MermaidDiagrams/index.tsx`, right after the existing zoom constants:

```tsx
const RENDER_DEBOUNCE_MS = 400
const MIN_ZOOM = 0.2
const MAX_ZOOM = 5
const ZOOM_STEP = 1.25
const MIN_SPLIT = 20
const MAX_SPLIT = 80
const DEFAULT_SPLIT = 50
const DESKTOP_QUERY = '(min-width: 1024px)'
```

And right after the existing `clampZoom` function:

```tsx
function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

function clampSplit(value: number): number {
  return Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, value))
}
```

- [ ] **Step 2: Add split state and refs**

Right after the existing `exportError` state declaration (`const [exportError, setExportError] = useState<string | null>(null)`), add:

```tsx
  const [splitRatio, setSplitRatio] = useLocalStorage('mermaid-split-ratio', DEFAULT_SPLIT)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)
```

Right after the existing `diagramRef` declaration (`const diagramRef = useRef<HTMLDivElement>(null)`), add:

```tsx
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const splitDragPointerId = useRef<number | null>(null)
```

- [ ] **Step 3: Track the desktop breakpoint**

Right after the existing render `useEffect` (the one that calls `renderMermaid`) and before the `// ── Zoom & pan ──` comment, add:

```tsx
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])
```

- [ ] **Step 4: Add divider drag handlers**

Right after the existing `resetView` function (`const resetView = () => setView(INITIAL_VIEW)`) and before the `// ── Actions ──` comment, add:

```tsx
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
```

- [ ] **Step 5: Wire the split into the JSX**

Replace:

```tsx
      <div className="flex flex-1 flex-col gap-6 overflow-hidden lg:flex-row">
        {/* Editor */}
        <div className="flex flex-col gap-3 overflow-hidden lg:w-1/2">
```

with:

```tsx
      <div
        ref={splitContainerRef}
        className="flex flex-1 flex-col gap-6 overflow-hidden lg:flex-row lg:gap-0"
      >
        {/* Editor */}
        <div
          className="flex flex-col gap-3 overflow-hidden"
          style={isDesktop ? { width: `${splitRatio}%` } : undefined}
        >
```

Then replace:

```tsx
        {/* Preview */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-muted/40 lg:w-1/2">
```

with:

```tsx
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
```

- [ ] **Step 6: Add the `resizeSplit` translation key**

In `src/i18n/locales/en.ts`, in the `Translations` type's `mermaid` block, after `emptyStateHint: string`:

```ts
    emptyState: string
    emptyStateHint: string
    resizeSplit: string
  }
```

In the same file's `export const en` value block, after `emptyStateHint: 'Pick an example above to get started',`:

```ts
    emptyState: 'Write a diagram to see it rendered',
    emptyStateHint: 'Pick an example above to get started',
    resizeSplit: 'Drag to resize',
  },
```

In `src/i18n/locales/pt.ts`, after `emptyStateHint: 'Escolha um exemplo acima para começar',`:

```ts
    emptyState: 'Escreva um diagrama para ver a renderização',
    emptyStateHint: 'Escolha um exemplo acima para começar',
    resizeSplit: 'Arraste para redimensionar',
  },
```

- [ ] **Step 7: Type-check and lint**

Run: `npm run build && npm run lint`
Expected: both succeed with no errors.

- [ ] **Step 8: Manually verify in the browser**

Run: `npm run dev`, open the Mermaid Diagrams page.
- Confirm the page still renders and a diagram still shows (load an example).
- At a desktop window width (≥1024px), hover the thin gap between editor and preview — cursor should become a column-resize cursor, and a subtle line should be visible.
- Drag it left and right — both panes should resize live, staying within roughly 20%-80% of the available width.
- Double-click the divider — split should snap back to 50/50.
- Reload the page — the split ratio you left it at should be restored.
- Shrink the window below 1024px (or use responsive device mode) — layout should stack vertically with no divider visible, same as before this change.

- [ ] **Step 9: Commit**

```bash
git add src/pages/MermaidDiagrams/index.tsx src/i18n/locales/en.ts src/i18n/locales/pt.ts
git commit -m "feat: add draggable split between Mermaid editor and preview"
```

---

### Task 2: Fullscreen toggle for the diagram preview

**Files:**
- Modify: `src/pages/MermaidDiagrams/index.tsx`
- Modify: `src/i18n/locales/en.ts` (type block, after `resizeSplit: string` from Task 1), `src/i18n/locales/en.ts` (value block, after `resizeSplit: 'Drag to resize',`)
- Modify: `src/i18n/locales/pt.ts` (value block, after `resizeSplit: 'Arraste para redimensionar',`)

**Interfaces:**
- Consumes: `isDesktop` and `splitRatio` from Task 1 (to skip inline split widths while fullscreen).
- Produces: `isFullscreen: boolean`, `toggleFullscreen(): void`. Nothing downstream depends on these — this is the last task.

- [ ] **Step 1: Import the fullscreen icons**

Replace:

```tsx
import {
  FileImage,
  FileCode2,
  Loader2,
  Minus,
  Plus,
  Trash2,
  Maximize2,
} from 'lucide-react'
```

with:

```tsx
import {
  FileImage,
  FileCode2,
  Loader2,
  Maximize,
  Maximize2,
  Minimize,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react'
```

- [ ] **Step 2: Add fullscreen state and toggle**

Right after the `isDesktop` state added in Task 1, add:

```tsx
  const [isFullscreen, setIsFullscreen] = useState(false)
```

Right after the `resetSplit` function added in Task 1, add:

```tsx
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev)
```

- [ ] **Step 3: Exit fullscreen on Escape**

Right after the `useEffect` that tracks `isDesktop` (added in Task 1), add:

```tsx
  useEffect(() => {
    if (!isFullscreen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])
```

- [ ] **Step 4: Hide the editor and divider while fullscreen**

Replace the editor pane's opening tag:

```tsx
        {/* Editor */}
        <div
          className="flex flex-col gap-3 overflow-hidden"
          style={isDesktop ? { width: `${splitRatio}%` } : undefined}
        >
```

with:

```tsx
        {!isFullscreen && (
        <div
          className="flex flex-col gap-3 overflow-hidden"
          style={isDesktop ? { width: `${splitRatio}%` } : undefined}
        >
```

Then replace the editor pane's closing tag together with the divider's guard (the exact text added by Task 1, Step 5 — appears once in the file):

```tsx
        </div>

        {isDesktop && (
```

with:

```tsx
        </div>
        )}

        {!isFullscreen && isDesktop && (
```

- [ ] **Step 5: Make the preview panel a fullscreen overlay when active**

Replace:

```tsx
        {/* Preview */}
        <div
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-muted/40"
          style={isDesktop ? { width: `${100 - splitRatio}%` } : undefined}
        >
```

with:

```tsx
        {/* Preview */}
        <div
          className={cn(
            'flex flex-col overflow-hidden bg-muted/40',
            isFullscreen ? 'fixed inset-0 z-[60]' : 'rounded-lg border border-border'
          )}
          style={!isFullscreen && isDesktop ? { width: `${100 - splitRatio}%` } : undefined}
        >
```

- [ ] **Step 6: Add the fullscreen toggle button**

In the preview panel's toolbar, replace:

```tsx
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
```

with:

```tsx
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
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? t('mermaid.exitFullscreen') : t('mermaid.enterFullscreen')}
                title={isFullscreen ? t('mermaid.exitFullscreen') : t('mermaid.enterFullscreen')}
              >
                {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
              </Button>
            </div>
```

- [ ] **Step 7: Add the `enterFullscreen`/`exitFullscreen` translation keys**

In `src/i18n/locales/en.ts`, in the `Translations` type's `mermaid` block, after `resizeSplit: string` (added in Task 1):

```ts
    resizeSplit: string
    enterFullscreen: string
    exitFullscreen: string
  }
```

In the same file's `export const en` value block, after `resizeSplit: 'Drag to resize',`:

```ts
    resizeSplit: 'Drag to resize',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
  },
```

In `src/i18n/locales/pt.ts`, after `resizeSplit: 'Arraste para redimensionar',`:

```ts
    resizeSplit: 'Arraste para redimensionar',
    enterFullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
  },
```

- [ ] **Step 8: Type-check and lint**

Run: `npm run build && npm run lint`
Expected: both succeed with no errors.

- [ ] **Step 9: Manually verify in the browser**

Run: `npm run dev`, open the Mermaid Diagrams page, load an example diagram.
- Click the new fullscreen button (next to the reset-view button) — the preview should expand to cover the entire viewport, including over the sidebar and top bar.
- Confirm zoom in/out/reset, pan, the export scale/transparency controls and PNG/SVG download buttons all still work while fullscreen.
- Press `Escape` — should exit fullscreen back to the normal layout.
- Re-enter fullscreen and click the toggle button again (now showing the "exit" icon) — should also exit.
- Confirm the editor and the resize divider are not visible/usable while fullscreen, and reappear correctly after exiting.
- Toggle dark/light theme while fullscreen and while collapsed — confirm no visual regressions in either mode.

- [ ] **Step 10: Commit**

```bash
git add src/pages/MermaidDiagrams/index.tsx src/i18n/locales/en.ts src/i18n/locales/pt.ts
git commit -m "feat: add fullscreen toggle for Mermaid diagram preview"
```

---

### Task 3: Combined verification pass

**Files:** none (manual verification only, no code changes expected).

**Interfaces:** none — this task only exercises what Tasks 1 and 2 produced together.

- [ ] **Step 1: Run the full checks one more time**

Run: `npm run build && npm run lint`
Expected: both succeed with no errors.

- [ ] **Step 2: Exercise both features together in the browser**

Run: `npm run dev`, open the Mermaid Diagrams page.
- Drag the split to a custom ratio, then enter fullscreen, then exit — confirm the split ratio is exactly as you left it (fullscreen must not reset or corrupt `splitRatio`).
- Reload the page after exiting fullscreen — confirm the app opens back in the normal (non-fullscreen) split view with the persisted ratio, since fullscreen is never persisted.
- Resize the browser window across the 1024px breakpoint while the diagram is showing — confirm the divider appears/disappears at the right point and nothing breaks.
- Confirm keyboard focus/tab order isn't trapped in an unusable state after exiting fullscreen (click into the code editor and type — should work normally).

- [ ] **Step 3: Commit (only if Step 2 surfaced fixes)**

If Step 2 required any code changes, stage and commit them with a message describing the specific fix, e.g.:

```bash
git add src/pages/MermaidDiagrams/index.tsx
git commit -m "fix: <specific issue found during combined verification>"
```

If no changes were needed, skip this step — there is nothing to commit.
