# Santi020k Theme (Chrome)

> **Repository note:** Historical standalone Chrome theme repository. **New work** lives in [**santi020k/santi020k-theme**](https://github.com/santi020k/santi020k-theme).
>
> **MOVED** - This repository is no longer actively maintained. The Chrome theme now lives with the main Santi020k theme project so the browser and editor themes can evolve together.

[![Validate](https://github.com/santi020k/santi020k-chrome-theme/actions/workflows/validate.yml/badge.svg)](https://github.com/santi020k/santi020k-chrome-theme/actions/workflows/validate.yml)
[![Version](https://img.shields.io/github/package-json/v/santi020k/santi020k-chrome-theme?color=752df0)](https://github.com/santi020k/santi020k-chrome-theme/releases)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Santi020k Chrome Theme Preview](store/assets/screenshot-main.png)

Chrome browser theme matching the palette of **[santi020k VS Code theme](https://github.com/santi020k/santi020k-theme)** — deep violet chrome (`#0b0712`, `#1c1528`), editor-like surfaces (`#110c1d`), and violet accents (`#752df0` / `#945df4`).

## Install

**From the Chrome Web Store**:

- [Install Santi020k Theme (Dark)](https://chromewebstore.google.com/detail/cljcifjjgolaplmemjcnjhkjfoneadgj)
- [Install Santi020k Theme (Light)](https://chromewebstore.google.com/detail/ekehaoadgcihpkajlnbpkankaginojci?utm_source=item-share-cb)

**Unpacked (developer)**:

1. Open Chrome → **Extensions** (`chrome://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder (`santi020k-chrome-theme`).

## Development

```bash
pnpm install

pnpm run dev          # Preview the marketing website (localhost:4175)
pnpm run build        # Production build of the website
pnpm run validate     # Validate manifest + run dry-run package
pnpm run sync         # Sync colors from VS Code theme + regenerate NTP images
pnpm run package      # Build dist/santi020k-chrome-theme.zip for the Web Store
pnpm run package:dry  # Validate only, no zip written
```

### Sync from VS Code theme

When the VS Code palette changes, run:

```bash
pnpm run sync:themes
```

This reads `../santi020k-theme/themes/santi020k-dark-color-theme.json` (assumes sibling checkout) and updates both `manifest.json` and `manifest-light.json`. Override the source path with `SOURCE_THEME=/path/to/file.json`.

## Palette

| Role | Hex | VS Code token |
|------|-----|---------------|
| Frame (title bar) | `#0b0712` | `titleBar.activeBackground`, `activityBar.background` |
| Toolbar / tab strip | `#1c1528` | `sideBar.background` |
| Inactive tabs | `#0b0712` | `tab.inactiveBackground` |
| Active tab accent line | `#752df0` | `tab.activeBorder` |
| NTP / omnibox surface | `#110c1d` | `editor.background` |
| Separators / controls | `#231d30` | `activityBar.border`, `tab.border` |
| Primary text | `#dfdde3` | `editor.foreground`, `foreground` |
| Muted text (inactive tabs) | `#a19da8` | between `icon.foreground` and line numbers |
| Tab text inactive (unfocused) | `#8d8896` | `tab.inactiveForeground` |
| Links / accents | `#945df4`, `#b48df7` | `textLink.foreground`, `textLink.activeForeground` |
| Incognito frame | `#08060e` | derived from frame, darkened |

## Publishing

Upload `dist/santi020k-chrome-theme.zip` (built via `pnpm run package`) in the [Chrome Web Developer Dashboard](https://chrome.google.com/webstore/devconsole).

Published listings:

- Dark theme: <https://chromewebstore.google.com/detail/cljcifjjgolaplmemjcnjhkjfoneadgj>
- Light theme: <https://chromewebstore.google.com/detail/ekehaoadgcihpkajlnbpkankaginojci?utm_source=item-share-cb>

- [`store/PUBLISHING.md`](store/PUBLISHING.md) — step-by-step submission checklist and dashboard field values
- [`store/listing-en.md`](store/listing-en.md) — copy-paste listing text (summary + long description)
- [`store/image-specs.md`](store/image-specs.md) — screenshot and promo tile specs with capture tips

## Privacy

This extension changes browser appearance only. It collects no data and uses no permissions or remote code. See [`PRIVACY.md`](PRIVACY.md) for the full policy (also hosted at `theme.santi020k.com/privacy` for the Web Store privacy URL field).

## License

MIT — see [LICENSE](LICENSE).
