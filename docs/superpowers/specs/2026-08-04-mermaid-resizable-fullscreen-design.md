# Mermaid Diagrams: resizable split + fullscreen preview

## Context

The Mermaid Diagrams page (`src/pages/MermaidDiagrams/index.tsx`) shows a code editor
and a live diagram preview side by side on desktop (`lg:flex-row`, each pane fixed at
`lg:w-1/2`) and stacked on smaller screens. Two improvements were requested:

1. Let the user drag the boundary between the editor and the preview to resize either
   pane.
2. Let the user view the diagram preview in fullscreen.

## Goals

- Draggable divider between editor and preview, desktop layout only.
- Fullscreen toggle for the diagram preview panel.
- No new dependencies — reuse the pointer-capture drag pattern already used for
  panning the diagram (`handlePointerDown`/`handlePointerMove`/`handlePointerUp` in
  the existing file).

## Non-goals

- No resizing on mobile/tablet (`<1024px`) — stacked layout is unaffected.
- Fullscreen state is not persisted — it's a transient view mode, always starts
  collapsed on page load/navigation.

## Design

### 1. Resizable split (desktop only)

- New persisted state: `splitRatio` via
  `useLocalStorage('mermaid-split-ratio', 50)` — percentage width (0-100) of the
  editor pane. Clamped to `[20, 80]` so neither pane can be dragged to near-zero
  width.
- New state `isDesktop`, computed from
  `window.matchMedia('(min-width: 1024px)').matches` (mirrors the existing `lg:`
  breakpoint), kept in sync via a `change` listener on the media query in a
  `useEffect`.
- The editor pane and preview panel drop their static `lg:w-1/2` class in favor of
  an inline `style={{ width: '<ratio>%' }}` applied only when `isDesktop` is true
  (so mobile stacking, which doesn't use `width` for sizing, is untouched).
- A new divider element is rendered between the two panes **only when `isDesktop`**:
  a thin vertical bar (`cursor-col-resize`), using the same pointer-capture pattern
  as the diagram pan handler:
  - `onPointerDown`: capture the pointer, record drag start.
  - `onPointerMove`: read the outer container's `getBoundingClientRect()`, compute
    `((clientX - rect.left) / rect.width) * 100`, clamp to `[20, 80]`, and update
    `splitRatio`.
  - `onPointerUp`: release capture, end drag.
  - `onDoubleClick`: reset `splitRatio` to `50`.
- The outer flex container needs a `ref` to compute the bounding rect during drag.

### 2. Fullscreen preview

- New state `isFullscreen` (plain `useState(false)`, not persisted).
- New icon button in the preview panel's header toolbar, next to the existing
  zoom controls: `Maximize` icon when collapsed, `Minimize` icon when expanded
  (distinct from the `Maximize2` icon already used for "reset view", to avoid
  visual ambiguity between the two actions).
- When `isFullscreen` is true, the preview panel wrapper's className switches from
  its normal in-flow styling (`rounded-lg border ...` plus the dynamic split
  `width`) to `fixed inset-0 z-[60] border-0` — `z-[60]` because the app's highest
  existing overlay (the mobile sidebar drawer) uses `z-50`, so this must render
  above it.
- All internal panel functionality (zoom/pan controls, error banner, export
  scale/transparency controls, PNG/SVG download buttons) stays exactly as-is,
  since it's the same JSX subtree — only the outer wrapper's positioning changes.
- The divider and editor pane are simply not rendered while `isFullscreen` is true
  (early-return that portion of the layout), since there's nothing to split
  against when the preview covers the whole viewport.
- `Escape` key exits fullscreen: a `useEffect` keydown listener registered only
  while `isFullscreen` is true.

### i18n

New keys added to both `src/i18n/locales/en.ts` and `src/i18n/locales/pt.ts` under
the existing `mermaid` section:
- `enterFullscreen` — button label/aria-label/title to enter fullscreen.
- `exitFullscreen` — button label/aria-label/title to exit fullscreen.

## Testing

- Manual verification in the browser (dev server):
  - Drag the divider on desktop width, confirm both panes resize live and the
    ratio persists across a page reload.
  - Confirm divider does not appear/act below the `lg` breakpoint.
  - Double-click the divider resets the split to 50/50.
  - Toggle fullscreen: preview covers the full viewport above sidebar/topbar, zoom
    /pan/export still work, `Escape` and the toggle button both exit.
  - Toggle dark/light theme while in each state to confirm no visual regressions.
