# Santi020k Theme (Chrome)

Chrome browser theme matching the palette of **[santi020k VS Code theme](https://github.com/santi020k/santi020k-theme)** — deep violet chrome (`#0b0712`, `#1c1528`), editor-like surfaces (`#110c1d`), and violet accents (`#752df0` / `#945df4`). This repo is separate from the VS Code extension so releases and [Chrome Web Store](https://chrome.google.com/webstore/category/themes) listings stay independent.

## Try locally (unpacked)

1. Open Chrome → **Extensions** (`chrome://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and choose this folder (`santi020k-chrome-theme`).

## Pack for the Web Store

```bash
node scripts/package-extension.mjs --dry-run   # validate
node scripts/package-extension.mjs             # writes dist/santi020k-chrome-theme.zip
```

Upload `dist/santi020k-chrome-theme.zip` in the [Chrome Web Developer Dashboard](https://chrome.google.com/webstore/devconsole). See [`store/PUBLISHING.md`](store/PUBLISHING.md) for the full submission checklist and dashboard field values.

## Palette (santi020k dark)

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

## Sync from VS Code theme

When the VS Code theme palette changes, run:

```bash
node scripts/sync-from-vscode-theme.mjs
```

This reads `../santi020k-theme/themes/santi020k-dark-color-theme.json` (assumes sibling checkout) and emits a `theme.colors` snippet to diff against `manifest.json`. Set `SOURCE_THEME=/path/to/file.json` to override the source path.

## Privacy

This extension changes browser appearance only. It collects no data and uses no permissions or remote code. See [`PRIVACY.md`](PRIVACY.md) for the full policy (also hosted at `theme.santi020k.com/privacy` for the Web Store privacy URL field).

## Publishing docs

- [`store/PUBLISHING.md`](store/PUBLISHING.md) — step-by-step submission checklist + dashboard field values
- [`store/listing-en.md`](store/listing-en.md) — copy-paste listing text (summary + long description)
- [`store/image-specs.md`](store/image-specs.md) — screenshot and promo tile specs with capture tips

## License

MIT — see [LICENSE](LICENSE).
