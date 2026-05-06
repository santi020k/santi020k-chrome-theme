# Chrome Web Store — Image Specifications

> [!NOTE]
> **Current Assets:** The latest generated assets matching these specs can be found in [`store/assets/`](assets/). Unsuffixed assets are for the dark listing; `*-light.png` assets are for the light listing.

## Extension icon (already in repo)

| Size | File | Notes |
|------|------|-------|
| Vector | `icons/icon.svg` | SVG source |
| 512×512 px | `icons/icon512.png` | High-res PNG |
| 128×128 px | `icons/icon128.png` | Used on the store listing tile |
| 48×48 px | `icons/icon48.png` | Extension management page |
| 16×16 px | `icons/icon16.png` | Browser favicon/tab |

## Screenshots (1–5 required)

| Spec | Value |
|------|-------|
| Icon (SVG) | `icons/icon.svg` |
| Icon (PNG) | `icons/icon128.png` (plus 512, 48, 16) |
| Preferred size | **1280×800 px** |
| Minimum size | 640×400 px |
| Format | PNG or JPEG |
| Corners | Square (no rounded corners, no drop shadows) |
| Count | 1 minimum, 5 maximum |

**What to capture (recommended sequence):**

1. **Toolbar + tabs** — several open tabs showing active vs inactive distinction and the purple `tab_line` accent. Include the omnibox with text typed.
2. **New Tab page** — NTP showing the dark `#110c1d` background with links and section headers.
3. **Incognito window** — slightly darker frame variant.
4. **Side-by-side with VS Code** — optional, shows palette alignment.
5. **Multiple tabs + bookmarks bar** — shows `bookmark_text` color and tab strip at scale.

**Capture tips (macOS):**
- Set Chrome window to exactly 1280×800 before screenshotting: drag to size or use `System Preferences › Displays` at 1280×800.
- Use `Shift+Cmd+4` then `Space` to capture a single window without the desktop background.
- Crop out the macOS window shadow in Preview (`Tools › Crop`) before upload.
- Do **not** add device frames or drop shadows — the dashboard renders these itself.

## Small promo tile (required for submission)

| Spec | Value |
|------|-------|
| Size | **440×280 px** |
| Format | PNG or JPEG |
| Content | Theme name + palette swatches on a `#0b0712` background |

Design guide:
- Background: `#0b0712` (frame color)
- Wordmark: "Santi020k" in `#dfdde3`, small "Theme" subtitle in `#b6b2bd`
- Accent bar or dot row in `#752df0` / `#945df4` / `#b48df7`
- No white borders — Chrome adds padding in the listing card

## Marquee banner (optional — improves featuring odds)

| Spec | Value |
|------|-------|
| Size | **1400×560 px** |
| Format | PNG or JPEG |
| Content | Same visual language as promo tile, wider composition |

Use a horizontal gradient from `#0b0712` → `#1c1528` as the base.

## Light theme assets

Run `pnpm run sync:store-assets:light` to generate the light-specific store assets without overwriting the existing dark assets:

| Asset | Size | Notes |
|-------|------|-------|
| `store/assets/promo-tile-light.png` | 440×280 px | Required small promo tile for the light listing |
| `store/assets/marquee-banner-light.png` | 1400×560 px | Optional marquee banner for the light listing |
| `store/assets/screenshot-main-light.png` | 1280×800 px | Main browser chrome screenshot |
| `store/assets/screenshot-ntp-light.png` | 1280×800 px | New Tab page screenshot |
| `store/assets/screenshot-incognito-light.png` | 1280×800 px | Incognito frame screenshot |
