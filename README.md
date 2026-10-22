# Pesquise isto

A minimal, dark, single-page site for Brazilian Portuguese audiences. It shows a short list of terms; each one opens a Google search (in Portuguese, restricted to Brazil) in a new tab. One term can be highlighted.

No build step and no dependencies: plain HTML, CSS and JavaScript.

## Structure

```
index.html                    page markup
css/style.css                 all styles (1 column on phones, 2 on wide screens)
js/terms.js                   the terms and texts. This is the file you edit.
js/main.js                    rendering, "opened" tracking, share button
.github/workflows/pages.yml   optional GitHub Pages deploy
```

## Editing the terms

Open `js/terms.js`:

```js
const TERMS = [
  { q: "first term", tease: "Short line shown under it.", featured: true },
  { q: "second term", tease: "" }
];
```

- `q`: the exact text people will search on Google
- `tease`: optional short line under the term (`""` for none)
- `featured`: `true` highlights the term (use it on one term)

`INTRO` and `SHARE_TEXT` in the same file control the intro paragraph and the share message.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deploy on GitHub Pages

1. Push to a GitHub repository on the `main` branch.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow publishes the site on every push to `main`.

Alternative without Actions: set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and delete the `.github/` folder.

## Notes

- Which terms a visitor has opened is remembered only in their own browser (`localStorage`). Nothing is sent anywhere, and the site has no analytics.
- Fonts (Instrument Serif, DM Sans) load from Google Fonts, with fallback fonts if they fail.
- Search results come from Google and change over time. Check each term before sharing the page.
- If the page is political or campaign-related, check Brazilian electoral rules (TSE) on identifying who produced it.
