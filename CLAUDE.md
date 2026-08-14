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

- `src/_includes/base.njk` is the single shared layout — header, nav, footer, and `<head>` (meta tags, favicon set, JSON-LD Person schema, canonical link) are written once here. Every page's front matter (`layout: base.njk`) pulls it in. **When changing the header, nav, or footer, this is the only file to touch.**
- `src/index.njk`, `src/research.njk`, `src/music.njk`, `src/contact.njk`, `src/404.njk` are page content only (no repeated boilerplate). Front matter sets `title`, `description`, and `nav` (used by the layout to highlight the active nav link) — `404.njk` omits `nav` since no nav item should be forced active, and sets `permalink: /404.html` + `eleventyExcludeFromCollections: true` (see below).
- `src/_includes/macros.njk` has two Nunjucks macros — `photoGrid(images)` and `videoGrid(sources)` — used by `research.njk` and `music.njk` to avoid re-typing the same gallery/video markup every time a photo or video is added. `photoGrid` takes `{src, alt}` objects; `videoGrid` takes `{src, poster}` objects (the `poster` attribute shows a static frame before playback — every video should have one, generated via `ffmpeg -ss 1 -vframes 1`). When adding a new photo/video gallery, use these rather than hand-rolling the markup again.
- `src/_data/site.js` is Eleventy global data exposing `{{ site.url }}` (the production URL, `https://amir-mano.github.io/personal_website`) — used anywhere a template needs a fully-qualified absolute URL (canonical link, JSON-LD, sitemap, manifest `start_url`) rather than a path-only reference. Unlike the `url` filter, this is a fixed string that's correct regardless of the local-dev-vs-CI path-prefix difference, since it's not path-prefixed itself — it's concatenated with `page.url` (or another root-relative path) instead.
- `src/sitemap.njk`, `src/robots.njk`, `src/manifest.njk` generate `sitemap.xml`, `robots.txt`, and the web app manifest via an explicit `permalink:` front-matter override (Eleventy's default output for a bare `.njk` file would nest it under a slug folder, e.g. `/sitemap/index.html` — wrong for files that must live at an exact path). All three also set `eleventyExcludeFromCollections: true` so they don't pollute `collections.all` (which `sitemap.njk` itself loops over to enumerate pages — without the exclusion flags, the sitemap would list itself, the manifest, and the 404 page).
- `eleventy.config.js` sets `src` as the input dir and `_site` as the output dir, and passthrough-copies `src/css`, `src/js`, `src/images`, `src/videos`, and `src/CV_AmirMano.pdf` unprocessed.
- `src/css/styles.css` uses CSS custom properties (defined in `:root`) for the color/spacing/shadow system — change tokens there rather than hardcoding values in rules. `--color-on-primary` (white) is the token for text/icons placed on a dark/primary-colored background (nav, footer, buttons); a couple of rules intentionally stay literal (`#000` video letterboxing matte, `rgba(255,255,255,0.15)` lightbox overlay) since they're not the same semantic case — each has a comment explaining why. The single `@media (max-width: 720px)` breakpoint is also a literal value on purpose: CSS custom properties can't be referenced inside `@media` feature values in any browser, and this project has no preprocessor to work around that.
- `src/js/main.js` handles two things: the mobile nav (hamburger toggle, Escape-to-close, click-outside-to-close), and a keyboard-accessible lightbox for any `<img data-lightbox>` (focus trap, focus return, body scroll lock — the lightbox markup itself lives once in `base.njk`).
- `src/images/icons/` holds brand SVGs (WhatsApp, LinkedIn, Instagram, Facebook, X, Bluesky, Gmail, Duolingo) sourced from [Simple Icons](https://simpleicons.org/), used on the Contact page.

## Critical: internal links must use the `url` filter

This site deploys to a **project page** (`https://amir-mano.github.io/personal_website/`), not a domain root, so every internal href/src must go through Eleventy's `url` filter — e.g. `{{ '/images/foo.jpg' | url }}`, not a bare `/images/foo.jpg`. In CI, `npx eleventy --pathprefix="..."` injects the `/personal_website/` prefix via this filter; a hardcoded absolute path silently breaks in production while still looking correct in local dev (`npm run dev` doesn't use a path prefix, so the bug is invisible until deployed). CSS `url(...)` references can't use this filter (CSS isn't templated) — use a relative path instead (e.g. `../images/foo.jpg` from `src/css/styles.css`), which works regardless of prefix.

## CI / Deployment

`.github/workflows/deploy.yml` runs on every push to `main`:
1. `npm run build` (no path prefix) then `npm run check-links` — catches broken internal links/assets before anything deploys. This step intentionally runs against the **unprefixed** build; checking the prefixed build against a local server produces false 404s (see below), since the prefix only means something under GitHub Pages' own routing.
2. `npx eleventy --pathprefix="..."` rebuilds with the real deployment path prefix (read from `configure-pages`'s `base_path` output) and that build is what's actually published.

The repo's Settings → Pages source must be **GitHub Actions** (not "Deploy from a branch"); the workflow's `configure-pages` step has `enablement: true` so it creates the Pages site automatically if it isn't already enabled.

## Content notes

- `TASKS.txt`, `ORIGINAL.txt`, and `archive/` (all gitignored, local-only) are Amir's informal backlog / reference material and retired-but-kept assets — not part of the live site. When an image stops being referenced anywhere (grep both `.njk` files AND CSS `url()` references before assuming — a file can be orphaned from templates but still used as a CSS background), move it to `archive/` rather than deleting it.
- New photos/videos: if sourced from a phone, check EXIF orientation before resizing (`Get-PropertyItem`/`PropertyIdList` in a resize script) — a naive resize with .NET's `System.Drawing` bakes in the wrong rotation permanently since it drops EXIF metadata. Large images (multi-MB phone photos) should be resized/compressed before committing.
- Videos should be compressed before committing (H.264, CRF ~26-28, capped at 1280px width, `-movflags +faststart`) and given a poster JPEG (`ffmpeg -ss 1 -vframes 1`) — raw phone recordings can be 5-10MB+ each. Neither `ffmpeg` nor an SVG rasterizer (`sharp`) is a project dependency; install on demand with `npm install --no-save <package>` for one-off asset generation, verify the binary/module actually resolves before relying on it, and confirm `git diff package-lock.json` is empty afterward.
