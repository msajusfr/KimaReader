# KimaReader

KimaReader is a lightweight, mobile-first Greek reader for immersive language learning. It runs entirely in the browser with React, TypeScript, Vite, Tailwind CSS, local JSON books, local storage, Web Speech API, and PWA support.

## Features

- Local JSON book library with a simple structured content format.
- Native React reader with chapters and selectable paragraphs.
- Reader preferences for dark/light theme, font size, and reading width.
- Text-selection translation flow with a replaceable mocked LLM service.
- Greek speech playback through the browser Web Speech API.
- Personal vocabulary list with local persistence and search.
- PWA manifest and generated service worker via `vite-plugin-pwa`.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Architecture

```text
src/
  components/
  data/
  hooks/
  pages/
  services/
  types/
  utils/
```

Book content lives in `src/data/books/*.json` and is loaded through `src/services/bookService.ts`. The translation service supports mock mode and OpenAI mode from `src/services/translationService.ts`.
