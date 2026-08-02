# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Amir Mano's personal portfolio website — a PhD candidate in neuroscience (music learning & neuroplasticity, trombonist). Built with [Eleventy](https://www.11ty.dev/) (an npm-based static site generator using Nunjucks templates). No client framework — just templated HTML, plain CSS, and a small vanilla JS file.

## Commands

```bash
npm install
npm run dev     # local dev server with live reload, http://localhost:8080
npm run build   # builds production output into _site/
```

There is no lint/test suite.

## Architecture

- `src/_includes/base.njk` is the single shared layout — header, nav, footer, and `<head>` are written once here. Every page's front matter (`layout: base.njk`) pulls it in. **When changing the header, nav, or footer, this is the only file to touch.**
- `src/index.njk`, `src/research.njk`, `src/music.njk`, `src/contact.njk` are page content only (no repeated boilerplate). Front matter sets `title`, `description`, and `nav` (used by the layout to highlight the active nav link).
- `eleventy.config.js` sets `src` as the input dir and `_site` as the output dir, and passthrough-copies `src/css`, `src/js`, `src/images`, and `src/CV_AmirMano.pdf` unprocessed.
- `src/css/styles.css` uses CSS custom properties (defined in `:root`) for the color/spacing/shadow system — change tokens there rather than hardcoding values in rules.
- `src/js/main.js` handles two things: the mobile nav hamburger toggle, and a lightbox for any `<img data-lightbox>` (the lightbox markup itself lives once in `base.njk`).
- Deployment is via `.github/workflows/deploy.yml`: on push to `main`, GitHub Actions runs `npm run build` and publishes `_site/` to GitHub Pages. The repo's Settings → Pages source must be **GitHub Actions** (not "Deploy from a branch") for this to work.

## Content notes

- `TASKS.txt` (gitignored, local-only) is Amir's informal backlog.
- `ORIGINAL.txt` and `ideas_from_web/` (gitignored) are reference/inspiration material, not part of the live site.
- `__pycache__/` and `.pytest_cache/` are leftovers from an unrelated Python script and are gitignored.
