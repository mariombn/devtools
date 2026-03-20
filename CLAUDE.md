# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTools is a privacy-focused SPA providing free developer utilities. All processing happens client-side in the browser — there is no backend.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # TypeScript compile + Vite production build (output: dist/)
npm run preview    # Preview production build at port 3000
npm run lint       # Run ESLint
```

Docker deployment:
```bash
./deploy.sh        # Automates: docker build, stop, start containers
```

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui (Radix UI)

**Routing:** React Router 7 — each tool is a separate route defined in `src/App.tsx`:
- `/json` → JSON Toolkit
- `/validators` → Data Validators
- `/generator` → Data Generator
- `/diff` → Text Comparator
- `/bcrypt` → Bcrypt hash generator/verifier
- `/markdown` → Markdown Preview
- `/sql` → SQL Tools
- `/dates` → Date & Time Tools

**Layout system** (`src/components/Layout/`): `MainLayout` wraps all pages with `Sidebar` (collapsible nav) + `TopBar` (header with theme toggle). The sidebar collapses to a drawer on mobile.

**State management:**
- Local `useState` for tool-specific UI state
- `ThemeProvider` context (`src/theme/`) for global dark/light mode
- `useLocalStorage` hook for persisting user inputs between sessions

**Adding a new tool:** Create a page component in `src/pages/YourTool/`, add pure utility functions in `src/utils/` if needed, then register the route in `src/App.tsx` and add a nav link in `src/components/Layout/Sidebar.tsx`.

**Key conventions:**
- Generator/formatter logic lives in `src/utils/` as pure functions (no side effects)
- UI components use shadcn/ui base components from `src/components/ui/`
- Shared cross-tool components (e.g. `PageTitle`, `CopyButton`) live in `src/components/Common/`
- Path alias `@/` maps to `src/`

**PWA:** Service worker configured via `vite-plugin-pwa` in `vite.config.ts` with Workbox cache strategies (cache-first for fonts, static assets cached up to 5MB).
