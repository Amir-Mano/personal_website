# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Amir Mano's personal portfolio website — a PhD candidate in neuroscience (music learning & neuroplasticity, trombonist).

## Running it

There's no build/lint/test step. Open any `.html` file directly in a browser, or serve the folder locally (e.g. `python -m http.server`) if testing things that need a server context (none currently do).

## Structure

Four pages — [index.html](index.html), [research.html](research.html), [music.html](music.html), [contact.html](contact.html) — each independently duplicates the same `<header>`, `<nav>`, and `<footer>` markup rather than sharing a template/include. **When changing the header, nav, or footer, update all four files identically.**

All pages link a single stylesheet, [styles.css](styles.css). There is no CSS framework.

## Git-ignored but locally present files

[.gitignore](.gitignore) excludes several files/folders that are still used and referenced by the site — don't treat their absence from `git status`/history as accidental or try to "restore" them:
- `images/` — all image assets referenced by the HTML (photos, logos)
- `TASKS.txt` — informal personal to-do list
- `ORIGINAL.txt` — reference/original draft content
- `styles_n.css` — an old superseded stylesheet draft (no longer linked from any page; do not reintroduce)
- `__pycache__/`, `.pytest_cache/` — leftovers from an unrelated Python script, not part of the site
- `ideas_from_web/` — reference/inspiration HTML saved from other sites, not part of the live site

`CV_AmirMano.pdf`, linked from [index.html](index.html), is tracked in git (not ignored).
