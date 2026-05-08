# Changelog

## [1.3.3] - 2026-05-08

### Fixed
- Ultimate fix for "could not decode `theme_ntp_background.png`": reduced dark background resolution to **1920×1080** (standard 1080p) and applied `--deleteColorManagementProperties` during `sips` conversion to strip all ICC color profiles, ensuring maximum compatibility with Chrome's image decoder.
- Resolved manifest encoding issues: replaced non-standard characters in `manifest.json` descriptions with plain UTF-8 text to prevent potential parsing errors.

## [1.3.2] - 2026-05-08

### Added
- Added a dedicated light theme icon set (`icons/icon-light*.png` and `icons/icon-light.svg`) matching the dark icon shape with the light theme palette.
- Added the published light theme Chrome Web Store listing to the website install actions, `README.md`, and store publishing docs.

### Changed
- `manifest-light.json` now points to the light icon assets instead of reusing the dark theme icons.

### Fixed
- Fixed incorrect light theme background: `images/theme_ntp_background_light.png` is now correctly generated from the high-quality **1920×1080** `theme_ntp_background_light.webp` source.
- Both dark and light image generation scripts now use `sips` with standardized PNG output settings and a resolution limit (2560px → 1920px).

## [1.3.1] - 2026-05-06

### Fixed
- `theme_ntp_background.png` (dark) was only 256×256 px; Chrome renders it as a tiny centred square on the New Tab page when `ntp_background_repeat` is `no-repeat`.
- Replaced the procedural dark PNG generator with a `sips`-based conversion: the authoritative **3840×2160** `theme_ntp_background.webp` is now re-encoded as PNG so Chrome can load it correctly.
- Replaced the procedural light PNG generator: `images/light.png` (**1920×1080**) is now copied directly to `theme_ntp_background_light.png` as the authoritative light NTP background.
- Both `scripts/generate-ntp-image.mjs` and `scripts/generate-ntp-image-light.mjs` rewritten to use real source assets instead of synthetic generation.

## [1.3.0] - 2026-05-06

### Fixed
- `theme_ntp_background` was referencing `.webp` files that Chrome could not decode; switched both dark and light manifests to use the PNG files produced by the generate scripts
- CI workflow NTP image check updated from `.webp` to `.png` (dark and light)

### Improved
- Added `Accessibility and contrast validation` step to CI workflow (`pnpm run validate:a11y`), ensuring contrast ratios are checked on every push and pull request

## [1.2.0] - 2026-05-01

### Added
- `images/adaptive_assets_diagonal.webp`, `dark.png`, `light.png`, `wallpaper.heic` — adaptive, dark/light mode, and wallpaper assets
- `scripts/generate-ntp-image-light.mjs` — pure Node.js PNG generator for the light NTP background (1920×1080, lavender with terminal prompt motif)
- `manifest-light.json` — Light theme variant with soft lavender palette
- Website: web manifest, sitemap, `robots.txt`, and social meta tags for improved SEO/discoverability

### Changed
- NTP background migrated to a stylized WebP for both dark and light variants
- `package-extension.mjs` updated to package both dark and light variants
- Migrated from npm to pnpm; added `.github/FUNDING.yml`

## [1.1.0] - 2026-05-01

### Added
- Expanded `theme.colors` from 19 to 29 keys, all derived from `santi020k-dark-color-theme.json`:
  - `background_tab` — inactive tab background (`tab.inactiveBackground`, `#0b0712`)
  - `tab_line` — active tab accent line (`tab.activeBorder`, `#752df0`)
  - `tab_background_text_inactive` — inactive tab text in unfocused window (`#8d8896`)
  - `tab_background_text_incognito` / `tab_background_text_incognito_inactive`
  - `frame_incognito` / `frame_incognito_inactive` — darkened frame variants
  - `toolbar_text` — address bar and toolbar label text
- `images/theme_ntp_background.png` — 256×256 vertical gradient (`#110c1d` → `#1c1528`) for the New Tab page
- `scripts/generate-ntp-image.mjs` — pure Node.js PNG generator for the NTP background
- `scripts/sync-from-vscode-theme.mjs` — emits `theme.colors` snippet from the VS Code JSONC source
- `scripts/package-extension.mjs` — cross-platform zip via `archiver`, with dry-run validation and version sync check
- `package.json` with `npm run validate|sync|generate:ntp|package|package:dry`
- `.nvmrc` (Node 20)
- `store/PUBLISHING.md`, `store/listing-en.md`, `store/image-specs.md`
- `PRIVACY.md`

### Changed
- `manifest.json` bumped to `1.1.0`
- CI (`validate.yml`) now runs `npm ci` + package dry-run; adds NTP image presence check

## [1.0.0] - 2026-04-01

### Added
- Initial Chrome theme with 19 color keys covering frame, toolbar, tabs, NTP, and omnibox
- Icons at 16, 48, and 128 px
- `README.md` and `LICENSE`
- GitHub Actions workflow: JSON validity check
