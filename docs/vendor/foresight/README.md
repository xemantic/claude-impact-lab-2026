# Foresight Institute design system (vendored)

`foresight.css` is the compiled Tailwind v4 stylesheet of the foresight.org WordPress theme,
the design system documented at <https://foresight.org/demo/>.
It is Foresight Institute's work, vendored here for the Claude Impact Lab website they co-hosted,
so the page uses their tokens, type scale, buttons, tags, tiles, header and footer directly.
Tailwind itself is MIT licensed; the theme's design belongs to Foresight Institute.

## What is in the file

Concatenated from `https://foresight.org/wp-content/themes/foresight/dist/`, theme version 0.1.4, retrieved 2026-11-09:

| Section | Source file | Contents |
|---|---|---|
| tailwind | `Cq8MEfkG.css` | tokens (`--color-*`, `--font-*`, `--radius-*`), preflight, `text-d1..d10`, `text-h1..h6`, `text-b1..b3`, `text-menu`, `text-tag`, `text-meta`, `button*`, `gradient*`, utilities |
| block-header | `2rId5gB-.css` | `.block-header__menu`, pill menu items, slide-out sub-menu, `-bullet` items |
| block-footer | `BvG2Y8JL.css` | `.block-footer__menu-inline`, `.block-footer__menu-vertical` |
| component-background | `dmFDHtLV.css` | `.component-background`, the `gradient-dynamic` hover |
| component-group | `KdpcHI3B.css` | `.component-group` ordering |
| block-tile | `DkloXbBh.css` | `.block-tile` variants |

The utilities are whatever foresight.org itself uses (Tailwind purges the rest),
so a class that exists in Tailwind may still be missing here.
Check before using one; `index.html` keeps a short custom block for the few layouts the build lacks.

## Fonts

The `@font-face` rules were removed.
The system is set in ABC Arizona Text and Neue Haas Unica Pro,
which are licensed to foresight.org and served there without CORS headers,
so they can be neither redistributed nor loaded cross-origin.
`index.html` overrides `--font-serif` and `--font-sans` with Newsreader and Inter from Google Fonts.

## Refreshing

The `dist/` file names are content hashes and change with every theme build.
To refresh, open <https://foresight.org/demo/>, read the `<link id="…-style-css">` tags to map ids to the current file names,
download the files listed above, strip `@font-face{…}` from the Tailwind one, and concatenate in the same order.
