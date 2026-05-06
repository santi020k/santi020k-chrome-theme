# Chrome Web Store — Publishing Checklist

## Pre-submission

- [ ] One-time $5 developer registration fee paid at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] `manifest.json` version bumped (semver)
- [ ] `node scripts/package-extension.mjs --dry-run` passes
- [ ] `node scripts/package-extension.mjs` produces `dist/santi020k-chrome-theme.zip`
- [ ] Zip verified: unzip and confirm only `manifest.json`, `icons/`, and `LICENSE` are present (no `store/`, `scripts/`, or `README.md` unless intentional)
- [ ] Screencaptures taken per `store/image-specs.md` (at least 1 screenshot; use `*-light.png` files for the light listing)
- [ ] Small promo tile (440×280 px PNG) ready (`promo-tile-light.png` for the light listing)

## Dashboard fields

Log in at <https://chrome.google.com/webstore/devconsole> and fill in:

| Field | Value |
|-------|-------|
| **Name** | Santi020k Theme |
| **Summary** | Deep violet browser theme matching the Santi020k VS Code color scheme — dark surfaces, muted lavender, violet accents. |
| **Category** | Themes |
| **Language** | English (United States) |
| **Homepage URL** | https://theme.santi020k.com |
| **Description** | Paste from `store/listing-en.md` "Long description" section |
| **Privacy policy URL** | https://theme.santi020k.com/privacy **or** raw GitHub URL pointing to `PRIVACY.md` |

### Privacy questionnaire answers

These answers must stay aligned with `PRIVACY.md`:

| Question | Answer |
|----------|--------|
| Does your item collect or use user data? | **No** |
| What data do your item collect? | *(leave all unchecked)* |
| Are you using remote code? | **No** |
| What is the single purpose of your item? | Change browser appearance to match the Santi020k VS Code color theme |

## Upload

1. Click **New Item** → upload `dist/santi020k-chrome-theme.zip`
2. Fill in all fields above
3. Upload icon (128×128), at least one screenshot, and the promo tile
4. Set visibility to **Public**
5. Click **Submit for review**

Review typically takes 1–3 business days for themes.

## Privacy policy hosting options (pick one)

- **First-party (preferred):** Add `/privacy` route to `theme.santi020k.com` serving the content of `PRIVACY.md`
- **GitHub raw:** `https://raw.githubusercontent.com/santi020k/santi020k-chrome-theme/main/PRIVACY.md` — works but looks unpolished
- **GitHub Pages:** Enable Pages on the repo and link `PRIVACY.md` directly

## Post-publish

**Dark theme listing:** <https://chromewebstore.google.com/detail/cljcifjjgolaplmemjcnjhkjfoneadgj>

- [x] Install from Web Store and smoke-test all tab states (active, inactive, incognito)
- [x] Update `README.md` badge/link once the store listing URL is known
- [x] Tag the release in git: `git push --tags`
- [ ] Publish light theme listing when ready

## Light Theme Listing Assets

Generate the light listing artwork with:

```sh
pnpm run sync:store-assets:light
```

Upload the generated `store/assets/*-light.png` files to the light theme Chrome Web Store listing. The existing unsuffixed files remain the dark listing assets.
