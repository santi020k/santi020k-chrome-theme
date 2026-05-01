# Chrome Web Store — Image Specifications

## Extension icon (already in repo)

| Size | File | Notes |
|------|------|-------|
| 128×128 px | `icons/icon128.png` | Used on the store listing tile |

## Screenshots (1–5 required)

| Spec | Value |
|------|-------|
| Preferred size | **1280×800 px** |
| Minimum size | 640×400 px |
| Format | PNG or JPEG |
| Corners | Square (no rounded corners, no drop shadows) |
| Count | 1 minimum, 5 maximum |

**What to capture (recommended sequence):**

1. **Toolbar + tabs** — several open tabs showing active (lighter) vs inactive (very dark) distinction and the purple `tab_line` accent. Include the omnibox with text typed.
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
