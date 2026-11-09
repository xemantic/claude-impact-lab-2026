# CLAUDE.md

This file captures only what cannot be inferred from the codebase itself.

## Rules for editing this file

Both developers and AI agents are expected to add entries as they encounter surprises.

- **Add an entry** when you encounter something unexpected: a build quirk, a non-obvious constraint, a dependency gotcha, or any behavior that would surprise the next agent or developer.
- **Add an entry** when a developer flags an anti-pattern produced by AI — describe the anti-pattern and the preferred alternative.
- **Do not** add codebase overviews, directory listings, or anything discoverable by reading the source.
- Keep entries concise: the lesson and its non-obvious *why*, grouped under a heading if a theme emerges.
  Name a symbol or test as a pointer, but don't restate what its source comment already says.

## Conventions

### Markdown authoring

Markdown files use [semantic line breaks](https://sembr.org/):
break a line after a sentence,
and optionally at clause boundaries within a long sentence,
so that diffs stay meaningful and reviewable.

There is no column width limit —
never reflow or hard-wrap a paragraph to fit some character count.
Modern editors soft-wrap Markdown visually.

### Working with AI agents

- In Claude Code "auto mode", never commit on your own — leave the changes in the working tree so the developer can review the diff first, and commit only when explicitly asked.

## Website (`docs/`)

- The page is styled with Foresight Institute's compiled Tailwind build, vendored in `docs/vendor/foresight/` (provenance and refresh steps in its README).
  Its utilities are purged to what foresight.org uses, so check that a class exists in `foresight.css` before using it;
  the inline `<style>` in `index.html` is only for what the build lacks.
- Their fonts (ABC Arizona Text, Neue Haas Unica Pro) cannot be used: licensed to foresight.org and served without CORS.
  Do not hotlink `foresight.org/wp-content/themes/foresight/dist/*` either, the file names are content hashes that change on every theme build.
- Tailwind v4 puts everything in `@layer`, so any unlayered rule in the inline `<style>` beats every utility on the same element, whatever its specificity.
  Avoid `.group` as a custom class name: it is Tailwind's `group-hover` marker.
- Newsreader sits about 2px higher in its line box than the font Foresight's pills were tuned for, so text centred with symmetric padding looks too high.
  The nav pills need asymmetric padding; this regressed once already when the nav was restyled.

## Anti-patterns to avoid

- Do not add content to this file that is already discoverable by reading the source or build scripts — that inflates context without adding signal, reducing AI agent task success rates (see [arxiv 2602.11988](https://arxiv.org/abs/2602.11988)).
