# PurrrrrFocus Blog i18n Structure

This folder organizes blog content by language:

- `en/` English
- `zh/` Chinese
- `da/` Danish
- `tr/` Turkish
- `fr/` French

Each locale folder contains the same slugs:

- `best-pomodoro-timer.html`
- `focus-for-adhd.html`
- `study-focus-guide.html`
- `how-to-build-focus-habit.html`

Routing rule:

- Canonical articles live only under `blog/{lang}/`. Root-level duplicate English slugs (e.g. `../best-pomodoro-timer.html`) were removed to avoid duplicate content; use `blog/en/{slug}.html` for English.
- Homepages link to `blog/{lang}/{slug}.html` so users open the same language version by default.
- Each blog page has a top-right language switcher that maps to the same slug in another locale.
- “Continue Reading” (related guides) stays inside the current locale folder.
