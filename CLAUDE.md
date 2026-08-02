# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Amir Mano's personal portfolio website — a PhD candidate in neuroscience (music learning & neuroplasticity, trombonist). Built with [Eleventy](https://www.11ty.dev/) (an npm-based static site generator using Nunjucks templates). No client framework — just templated HTML, plain CSS, and a small vanilla JS file.

## Commands

```bash
npm install
npm run dev          # local dev server with live reload, http://localhost:8080
npm run build        # builds production output into _site/
npm run check-links  # crawls the built _site/ and fails on any broken internal link/asset
```

There is no automated test suite beyond `check-links`.

## Architecture

- `src/_includes/base.njk` is the single shared layout — header, nav, footer, and `<head>` are written once here. Every page's front matter (`layout: base.njk`) pulls it in. **When changing the header, nav, or footer, this is the only file to touch.**
- `src/index.njk`, `src/research.njk`, `src/music.njk`, `src/contact.njk` are page content only (no repeated boilerplate). Front matter sets `title`, `description`, and `nav` (used by the layout to highlight the active nav link).
- `src/_includes/macros.njk` has two Nunjucks macros — `photoGrid(images)` and `videoGrid(sources)` — used by `research.njk` and `music.njk` to avoid re-typing the same gallery/video markup (with `loading="lazy"`, `data-lightbox`, etc.) every time a photo or video is added. When adding a new photo/video gallery, use these rather than hand-rolling the markup again.
- `eleventy.config.js` sets `src` as the input dir and `_site` as the output dir, and passthrough-copies `src/css`, `src/js`, `src/images`, `src/videos`, and `src/CV_AmirMano.pdf` unprocessed.
- `src/css/styles.css` uses CSS custom properties (defined in `:root`) for the color/spacing/shadow system — change tokens there rather than hardcoding values in rules.
- `src/js/main.js` handles two things: the mobile nav hamburger toggle, and a lightbox for any `<img data-lightbox>` (the lightbox markup itself lives once in `base.njk`).
- `src/images/icons/` holds brand SVGs (WhatsApp, LinkedIn, Instagram, Facebook, X, Bluesky, Gmail, Duolingo) sourced from [Simple Icons](https://simpleicons.org/), used on the Contact page.

## Critical: internal links must use the `url` filter

This site deploys to a **project page** (`https://amir-mano.github.io/personal_website/`), not a domain root, so every internal href/src must go through Eleventy's `url` filter — e.g. `{{ '/images/foo.jpg' | url }}`, not a bare `/images/foo.jpg`. In CI, `npx eleventy --pathprefix="..."` injects the `/personal_website/` prefix via this filter; a hardcoded absolute path silently breaks in production while still looking correct in local dev (`npm run dev` doesn't use a path prefix, so the bug is invisible until deployed). CSS `url(...)` references can't use this filter (CSS isn't templated) — use a relative path instead (e.g. `../images/foo.jpg` from `src/css/styles.css`), which works regardless of prefix.

## CI / Deployment

`.github/workflows/deploy.yml` runs on every push to `main`:
1. `npm run build` (no path prefix) then `npm run check-links` — catches broken internal links/assets before anything deploys. This step intentionally runs against the **unprefixed** build; checking the prefixed build against a local server produces false 404s (see below), since the prefix only means something under GitHub Pages' own routing.
2. `npx eleventy --pathprefix="..."` rebuilds with the real deployment path prefix (read from `configure-pages`'s `base_path` output) and that build is what's actually published.

The repo's Settings → Pages source must be **GitHub Actions** (not "Deploy from a branch"); the workflow's `configure-pages` step has `enablement: true` so it creates the Pages site automatically if it isn't already enabled.

## Content notes

- `TASKS.txt` and `ORIGINAL.txt` (gitignored, local-only) are Amir's informal backlog / reference material — not part of the live site.
- New photos/videos: if sourced from a phone, check EXIF orientation before resizing (`Get-PropertyItem`/`PropertyIdList` in a resize script) — a naive resize with .NET's `System.Drawing` bakes in the wrong rotation permanently since it drops EXIF metadata. Large images (multi-MB phone photos) should be resized/compressed before committing.
