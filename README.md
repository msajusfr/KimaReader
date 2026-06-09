# KimaReader

KimaReader is a lightweight, mobile-first Greek EPUB reader for immersive language learning. It runs entirely in the browser with React, TypeScript, Vite, Tailwind CSS, EPUB.js, local storage, Web Speech API, and PWA support.

## Features

- Local EPUB import and library persistence.
- Real EPUB.js reader with paginated navigation.
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

The translation service is intentionally mocked in `src/services/translationService.ts` so it can later be replaced with OpenAI, Claude, Gemini, or a local Ollama call without touching the reader UI.
