# Finta - AI finder

## Overview
Finta is an AI finder application. Originally a grounded NotebookLM RAG prompt builder for TIAFT 2026.

## Recent Changes
- 2026-02-28: Rebranded to "Finta - AI finder", added favicon from logo zip
- 2026-02-24: Initial Replit setup - configured Next.js for port 5000 with host proxy support

## Project Architecture
- **Framework**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS v4, inline styles
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Package Manager**: pnpm
- **Port**: 5000 (dev and production)

## Structure
```
app/              - Next.js App Router pages
  layout.tsx      - Root layout
  page.tsx        - Main application (client component)
  globals.css     - Global styles
components/       - UI components (shadcn/ui)
  ui/             - Reusable UI primitives
  theme-provider.tsx
hooks/            - Custom React hooks
lib/              - Utility functions
styles/           - Additional styles
```

## Running
- Dev: `pnpm dev` (binds to 0.0.0.0:5000)
- Build: `pnpm build`
- Start: `pnpm start` (binds to 0.0.0.0:5000)
