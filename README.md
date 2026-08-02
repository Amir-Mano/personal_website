# Amir Mano — Personal Website

Personal portfolio site for Amir Mano, PhD candidate in neuroscience (music learning & neuroplasticity) and trombone musician.

Built with [Eleventy](https://www.11ty.dev/) — plain HTML/CSS/JS, no client-side framework.

## Development

```bash
npm install
npm run dev     # local dev server with live reload at http://localhost:8080
npm run build   # build the production site into _site/
```

## Structure

- `src/_includes/base.njk` — shared page layout (header, nav, footer) — written once, used by every page
- `src/*.njk` — page content (home, research, music, contact)
- `src/css/styles.css` — all styling
- `src/js/main.js` — mobile nav toggle + image lightbox
- `src/images/` — site images and favicon
- `src/CV_AmirMano.pdf` — downloadable CV

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repo's Settings → Pages, the source must be set to **GitHub Actions** for this to work.
