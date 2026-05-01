# Santi020k Theme (Chrome)

Chrome browser theme matching the palette of **[santi020k VS Code theme](https://github.com/santi020k/santi020k-theme)** — deep violet chrome (`#0b0712`, `#1c1528`), editor-like surfaces (`#110c1d`), and violet accents (`#945df4`). This repo is separate from the VS Code extension so releases and [Chrome Web Store](https://chrome.google.com/webstore/category/themes) listings stay independent.

## Try locally (unpacked)

1. Open Chrome → **Extensions** (`chrome://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and choose this folder (`santi020k-chrome-theme`).

Pin or adjust colors in [`manifest.json`](manifest.json) under `theme.colors` if something looks off on your OS — Chrome applies themes slightly differently across platforms.

## Pack for upload

Zip the **contents** of this directory (not the parent folder), including `manifest.json` and `icons/`:

```bash
cd santi020k-chrome-theme && zip -r ../santi020k-chrome-theme.zip manifest.json icons LICENSE README.md
```

Upload the zip in [Chrome Web Developer Dashboard](https://chrome.google.com/webstore/devconsole) as a **theme** item.

## Palette source (santi020k dark)

| Role | Hex | VS Code reference |
| --- | --- | --- |
| Frame | `#0b0712` | `titleBar.activeBackground`, `activityBar.background` |
| Toolbar / tabs strip | `#1c1528` | `sideBar.background` |
| NTP / omnibox surface | `#110c1d` | `editor.background` |
| Separators / controls | `#231d30` | `activityBar.border`, `sideBar.border` |
| Primary text | `#dfdde3` | `foreground` |
| Muted text | `#b6b2bd`–`#a19da8` | `icon.foreground`, line numbers |
| Links / accents | `#945df4`, `#b48df7` | `textLink.foreground`, strings |

A **light** Chrome variant can follow `santi020k-light-color-theme.json` in the VS Code repo (`titleBar` / `sideBar` / `editor.background`) if you want parity later.

## License

MIT — see [LICENSE](LICENSE).
