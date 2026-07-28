# /download — the Android download page

Everything a visitor needs to install Help24, with one obvious action and no
mention of GitHub.

---

## Shipping a new release

**You do not type any release metadata.** It is read from the APK.

1. Publish the GitHub release with the APK attached.

2. Run the sync:

   ```bash
   npm run sync:release              # newest published release
   npm run sync:release -- --tag v1.0.1
   ```

   This downloads the release asset, hashes it, reads its manifest with
   `aapt2`, and writes `lib/generated/release-artifact.ts`: version,
   versionCode, application id, publication date, asset URL, exact byte count,
   SHA-256, `minSdkVersion`, `targetSdkVersion`, the human name for the minimum
   Android, and the ABIs actually present in the APK.

   It refuses to write if the measured size or digest disagrees with what
   GitHub reports, or if the tag and the manifest's `versionName` disagree.

3. Write the user-facing notes in `ANDROID_RELEASE.releaseNotes` in
   [`lib/release.ts`](../../lib/release.ts). That is the only hand-written part
   of a release, because it is the only part that is a judgement rather than a
   fact.

4. Deploy. The hero, the compatibility row, the version card, the checksum, the
   FAQ, the social card and both blocks of structured data
   (`SoftwareApplication` + `FAQPage`) all re-read from that object.

> **Requires** the Android SDK build-tools (for `aapt2`) and an authenticated
> `gh`. Deliberately not a build step: Vercel's builders have neither, so a
> build that reached for them would fail on the deployment target while passing
> locally. The generated file is committed and reviewed like any other diff.

### Why this is generated and not typed

`apkSizeBytes` and `sha256` used to be pasted in from a terminal. A download
page that states a checksum has no way to notice when the paste goes stale — it
renders confidently either way, and the checksum is the half people actually
verify. v1.0.0's APK was re-published and the page went on advertising the
previous artifact's digest and byte count until someone checked by hand.

### What else lives in that file

| Export | Drives |
|---|---|
| `ANDROID_RELEASE` | Every fact about the build (spread from the generated artifact + the notes) |
| `PLATFORMS` | The platform cards (add stores here) |
| `INSTALL_STEPS` | The three-step guide |
| `compatibility()` | The row under the download button |
| `OFFICIAL_SOURCES` | The "Official download only" notice |
| `DOWNLOAD_FAQ` | The FAQ **and** its `FAQPage` structured data |
| `TRUST_POINTS` | The four safety claims |

### If the app icon changes

```bash
npm run generate:og-icon
```

Re-encodes `public/help24-icon.png` into `lib/generated/app-icon.ts` for the
social card. The card renders on the edge runtime, which has no filesystem, so
the icon has to be compiled in — see the script's header for why.

**You do not need to regenerate the QR code.** It encodes this page, not the
artifact — that is the entire reason it points here.

### Adding Google Play / the App Store / AppGallery

Add an object to `PLATFORMS` in the same file. A channel with `url: null`
renders as an honest "Coming soon" card; set `url` and `available: true` and it
becomes a live link. No component or layout changes.

---

## Regenerating the QR code

Only when `QR_TARGET_URL` or `QR_SCAN_PARAM` changes.

```bash
npm run generate:qr
```

The script refuses to run if its target disagrees with `lib/release.ts`, and it
verifies its own output by rebuilding the module matrix from the SVG it just
wrote and comparing it to the encoder. A QR that has stopped scanning is not
something you find out about from a build log.

---

## Analytics

Events land in `window.dataLayer` in the shape GTM/GA4 already consume. Nothing
is transmitted until a tag manager is installed — this is instrumentation, not
collection.

| Event | Fires when | Extra properties |
|---|---|---|
| `download_click` | Any download link is clicked | `platform_id` (`android_apk`, `google_play`, …) |
| `qr_scan` | Page opened with `?src=qr` | — |
| `checksum_copy` | SHA-256 copied | — |

Every event also carries `platform` (`android` / `ios` / `desktop`), `browser`
and `app_version`.

**`country` is deliberately absent.** Resolving it in the browser means either a
blocking third-party IP lookup or making the route dynamic to read Vercel's
`x-vercel-ip-country` header — which would trade away static generation, and the
instant load with it. Every analytics provider derives country from the request
IP server-side already.

To start collecting: add the GTM/GA4 snippet to `app/layout.tsx`. The queued
`dataLayer` events are picked up on load.

---

## Manual test checklist

Run against a production build (`npm run build && npm run start`), not `dev`.

### The one thing that must work
- [ ] On an Android phone, **Download for Android** downloads
      `app-release.apk` and Android offers to install it.
- [ ] The installed app opens and shows the version matching the page.
- [ ] `sha256sum` of the downloaded file equals the value shown on the page.

### Platform behaviour
- [ ] **Android**: QR panel is hidden; no iOS notice.
- [ ] **Desktop**: QR panel visible; download button still present and working.
- [ ] **iPhone/iPad**: QR hidden; the iOS notice appears above the fold.
- [ ] **JavaScript disabled**: the page renders fully and the download button
      still works. QR panel shows (the honest fallback) — nothing is broken.

### QR code
- [ ] Scanning with the stock Android camera opens `help24.co.ke/download`.
- [ ] Scanning with the iOS camera does the same.
- [ ] Scan from ~40 cm on a laptop screen, and from a phone photo of a printed
      copy — ECC level Q is chosen for exactly this.
- [ ] The landing URL carries `?src=qr` and a `qr_scan` event appears in
      `window.dataLayer`.

### Content correctness
- [ ] Version, release date, size, minimum Android and architectures match the
      published artifact.
- [ ] The checksum on the page matches `gh release view --json assets`
      (`digest`).
- [ ] "What's new" expands and collapses by mouse, by keyboard (Enter/Space),
      and is findable with browser find-in-page while collapsed.
- [ ] Copy button copies the full checksum and shows the ✓ confirmation.
- [ ] Over plain HTTP (or an old browser) the copy button does nothing but the
      checksum is still selectable text.

### Accessibility
- [ ] Tab through the whole page: every interactive element is reachable and has
      a visible focus ring.
- [ ] The download button is reachable and activates with Enter.
- [ ] Screen reader announces the QR image, the copy button, and the disclosure
      state (expanded/collapsed).
- [ ] Zoom to 200% — no horizontal scrolling, nothing clipped.
- [ ] `prefers-reduced-motion` — the chevron does not animate.

### Responsive
- [ ] 320 px (smallest realistic phone) — no horizontal scroll.
- [ ] 390 px, 768 px, 1024 px, 1440 px.
- [ ] The version card's Architecture row wraps rather than overflowing.

### SEO / sharing
- [ ] `/download` title is "Download Help24 for Android · Help24".
- [ ] Paste the URL into WhatsApp and Slack: the social card renders with the
      version and size.
- [ ] `view-source` shows the `SoftwareApplication` JSON-LD.
- [ ] Canonical is `https://help24.co.ke/download`, with no query string.

### After DNS is live
- [ ] `help24.co.ke/download` serves the page over HTTPS.
- [ ] The QR resolves against the real domain, not the Vercel preview URL.
