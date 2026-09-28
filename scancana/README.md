# Scancana site (louisbuilds.me/scancana)

Static pages for the Scancana product site and App Store legal links.

## URLs (must match App `LegalLinks`)

| Path | File |
| --- | --- |
| `/scancana/` | `index.html` |
| `/scancana/privacy` | `privacy/index.html` |
| `/scancana/terms` | `terms/index.html` |
| `/scancana/support` | `support/index.html` |

## Design

- Structure follows LonelyIsle (sticky header, hero, sectioned features, legal accordion).
- Color / type follow Scancana `docs/DESIGN.md`: warm canvas `#0E0C0A`, gold CTA `#F5C842`, Oxanium for display titles.

## Deploy

Push this folder with the rest of `website/` so GitHub Pages (or your host) serves `scancana/` at the domain root. Then verify:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://louisbuilds.me/scancana/privacy
curl -sS -o /dev/null -w "%{http_code}\n" https://louisbuilds.me/scancana/terms
curl -sS -o /dev/null -w "%{http_code}\n" https://louisbuilds.me/scancana/support
```

App Store badge links to `https://apps.apple.com/app/id6815574419` (same as App).

## Homepage mockups

Feature sections reuse **onboarding copy** (`Copy.Onboarding`) and CSS mini-phone previews in the same spirit as `OnboardingAddHubPreview` / shelf / missing / card detail — not full-device system screenshots (those went stale: wrong tab label, empty Hyperia boxes).
