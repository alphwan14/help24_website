# Help24 Website

**The public website for [Help24](https://help24.co.ke), Kenya's marketplace for local services, with payment held safely in M-Pesa escrow until the job is done.**

[Live site](https://help24.co.ke) · [Download for Android](https://help24.co.ke/download) · [App and platform repository](https://github.com/alphwan14/help24)

> **Status:** pre-launch. Public launch is **19 October 2026** in Mombasa, Nairobi and Kisumu.

---

## Contents

- [Overview](#overview)
- [Engineering principles](#engineering-principles)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Security and privacy](#security-and-privacy)
- [Publishing an Android release](#publishing-an-android-release)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Credits](#credits)

---

## Overview

The site explains Help24, lets visitors try the product before launch, and distributes the Android app. It has 18 routes:

| Area | Routes |
|---|---|
| Home | `/` |
| Product | `/how-it-works`, `/services`, `/for-customers`, `/for-providers`, `/become-a-provider`, `/safety` |
| App | `/download` (version, checksum, QR code, install steps, release notes) |
| Support | `/help`, `/support`, `/contact` |
| Company and legal | `/about`, `/privacy`, `/terms`, `/community-guidelines` |
| Internal | `/auth/action`, `/auth/continue` (identity email handlers), `/components` (design-system parity route; not indexed) |

The homepage shows the product working rather than describing it:

- **Story demo:** an animated, eight-step walkthrough. A request types itself, becomes a card, receives offers, is paid into escrow and completes.
- **Task composer:** visitors describe a job inline, and it renders as the same `PostCard` used on the live board.
- **Escrow scrubber:** a draggable timeline that moves the payment from agreed, to held, to released.
- **Live board and coverage map:** a feed of sample cards, and a Kenya map built from real boundary data.

Every demo is clearly labelled as sample data. Nothing a visitor types is sent anywhere.

---

## Engineering principles

These run through the whole codebase.

1. **Server-first.** Pages are React Server Components by default. Client JavaScript ships only where there is interaction.
2. **One source of truth.** Colours, radii and the type scale live in a single token file. Release facts are generated from the APK itself, not typed by hand.
3. **Honest by construction.** Demos are labelled. The waitlist says so when it isn't connected. Counts are never invented.
4. **Decisions are written down.** Non-obvious choices are explained where they are made, in the file's own comments, including the bug each one fixed.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router), React 18 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3, driven by generated CSS custom properties |
| Fonts | Poppins via `next/font` (self-hosted at build time) |
| Identity | Firebase Auth web SDK, used only on `/auth/*` |
| Social cards | `next/og` on the edge runtime |
| Tooling | ESLint (`next/core-web-vitals`), `sharp`, `qrcode` |
| Hosting | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18.17 or later (the Next.js 14 minimum; verified with Node 22)
- npm

### Run locally

```bash
git clone https://github.com/alphwan14/help24_website.git
cd help24_website
npm ci
npm run dev          # http://localhost:3000
```

### Checks

```bash
npm run lint         # ESLint
npx tsc --noEmit     # type-check
npm run build        # production build
```

Development and production builds write to separate directories (`.next-dev` and `.next`). Switching between `npm run dev` and `npm run build` never leaves stale chunks behind. Both directories are git-ignored.

---

## Scripts

| Command | What it does | When to run it |
|---|---|---|
| `npm run dev` | Development server on port 3000 | Day to day |
| `npm run build` / `npm start` | Production build and server | Before shipping |
| `npm run lint` | ESLint | Before every commit |
| `npm run sync:release` | Reads a GitHub Release and its APK and writes `lib/generated/release-artifact.ts` | Every new Android release |
| `npm run generate:logo` | Renders every raster icon and favicon from the vectors in `brand/` | When the mark changes |
| `npm run generate:og-icon` | Inlines a downscaled app icon for the edge-rendered social card | When the app icon changes |
| `npm run generate:qr` | Renders the `/download` QR code to a static SVG | When the QR target changes |

---

## Environment variables

The site needs no environment variables to run. The only ones it reads belong to the waitlist:

| Variable | Required | Purpose |
|---|---|---|
| `WAITLIST_WEBHOOK_URL` | For the waitlist | POST target that receives `{ email, source, receivedAt }` as JSON |
| `WAITLIST_WEBHOOK_TOKEN` | Optional | Sent as `Authorization: Bearer …` to the webhook |
| `WAITLIST_COUNT_URL` | Optional | GET target returning `{ count: number }` |

If `WAITLIST_WEBHOOK_URL` is not set, `POST /api/waitlist` returns `503` and the form asks visitors to email support. This is deliberate: a form that appears to succeed while discarding the address is worse than one that admits it isn't connected. Without `WAITLIST_COUNT_URL`, no signup count is shown.

For local work, put them in `.env.local`, which is git-ignored. In production, set them in Vercel project settings.

---

## Project structure

```
help24_website/
├── app/                      Routes (App Router)
│   ├── api/waitlist/         Waitlist endpoint (forwards to a configured webhook)
│   ├── auth/action/          Firebase custom action handler (client-only, prerendered)
│   ├── auth/continue/        Identity hand-off landing
│   ├── components/           Design-system parity route (noindex)
│   ├── download/             Android download page and its social card
│   ├── layout.tsx            Root layout, fonts, theme script, metadata base
│   ├── sitemap.ts · robots.ts · manifest.ts
│   └── globals.css · design-system.css
├── components/
│   ├── ds/                   Design-system primitives: PostCard, Badge, FilterPill, SearchField …
│   ├── home/                 Homepage sections: TaskComposer, EscrowScrubber, LiveBoard, Coverage …
│   ├── site/                 Shared site sections, including the story demo
│   ├── download/             Version card, QR panel, install steps, release notes
│   ├── theme/                Theme script and toggle
│   └── Header.tsx · Footer.tsx · Button.tsx · Card.tsx …
├── lib/
│   ├── tokens.ts             The single source of every colour, radius and card metric
│   ├── site.ts               Site config: URL, launch date, navigation, sitemap routes
│   ├── seo.ts                Per-page metadata helper
│   ├── release.ts            Editorial release notes, copy and FAQ
│   ├── generated/            Machine-written files (release artifact, inlined icon); do not edit
│   ├── demo/                 Sample scenarios and seed data for the homepage demos
│   ├── kenya.ts              Simplified Kenya boundary for the coverage map
│   ├── faq.ts                Help Centre content
│   └── analytics.ts          Download event contract and its inline emitter
├── brand/                    Vector masters for the Help24 mark (mirrors the app's branding)
├── public/                   Static assets and app walkthrough screenshots
├── scripts/                  Release sync and asset generation
└── middleware.ts             Strips one-time identity credentials from URLs before render
```

---

## Design system

**Tokens drive everything.** `lib/tokens.ts` is the only file in the project that contains a hex value. `tailwind.config.ts` generates the Tailwind palette and radii from it, and every colour utility compiles to `rgb(var(--token-rgb) / <alpha-value>)`.

- **Two themes, one set of classes.** Light and dark are just different values for the same custom properties. `bg-card` compiles once and resolves per theme, so there are no duplicated `dark:` variants, and opacity modifiers such as `bg-primary/10` keep working.
- **Three theme states.** Visitors can follow the system setting or force light or dark. A roughly 300-byte blocking script in `<head>` applies an explicit choice before first paint, so there is no flash of the wrong theme. It is the only inline script on the site.
- **A shared type scale.** Headings, body and label sizes are defined once in the Tailwind config.
- **Parity with the app.** The primitives in `components/ds/` deliberately mirror the Flutter app's cards, badges and chips. Where one differs from its app counterpart, the component's comments say why. The noindex `/components` route renders them side by side for checking against the phone.

---

## Accessibility

- **Contrast is measured, not assumed.** Every colour pair the site paints was checked against WCAG AA: 4.5:1 for text and 3:1 for control boundaries, in both themes. Three pairs inherited from the app fall short in dark mode. They are documented in `lib/tokens.ts`, and the site never places text on them.
- **Motion is optional.** All animated sections, including the story demo, escrow scrubber, task composer and live board, respect `prefers-reduced-motion`.
- **Keyboard and screen readers.** The mobile menu behaves as a dialog: Escape closes it, the page behind it doesn't scroll, and its links leave the tab order when it's closed. Choice controls use radio-group semantics, and live regions announce demo state changes. Decorative glyphs are hidden from assistive technology, and screenshots carry descriptive alt text.

---

## Performance

- **Server Components by default.** Only interactive islands are client components.
- **Static by default.** Only the waitlist API and the `/auth/continue` hand-off opt into dynamic rendering.
- **No runtime work that can be done at build time.** The QR code is a pre-rendered SVG, so no encoder ships to the browser. The social-card icon is pre-shrunk and inlined. Release facts are generated ahead of time.
- **Lean analytics.** Download events come from a roughly 700-byte delegated script that reads `data-track` attributes from server-rendered links. There is no React on that path.
- **Fonts via `next/font`,** self-hosted at build time with no third-party request at runtime.

---

## Security and privacy

**Identity email links** (email verification, password reset) are handled by Help24 itself instead of a generic hosted page.

- **`/auth/action`** is statically prerendered and reads nothing on the server. Its one-time code is handled in the browser only, so it can never be rendered, logged or cached server-side.
- **`middleware.ts`** handles `/auth/continue`. It strips one-time credentials from the query string with a real HTTP 307 before anything renders, and the page keeps its own redirect as a backstop.
- **Response headers** on both routes: `Referrer-Policy: no-referrer` stops the originating URL from leaking through outbound links, and `X-Robots-Tag: noindex` keeps them out of search. `/auth/action` is also served `Cache-Control: no-store`.

**Other notes:**
- The Firebase web configuration in `app/auth/action/firebase.ts` is public client configuration by design. Access is enforced by Firebase Auth and project restrictions, not by keeping it secret.
- No secrets belong in this repository. Server-only values go in `.env.local` locally and in Vercel settings in production.
- **Release integrity:** the download page publishes the APK's SHA-256 checksum, generated from the artifact itself. Help24 should only ever be installed from [help24.co.ke/download](https://help24.co.ke/download) or the [official GitHub releases](https://github.com/alphwan14/help24/releases).

---

## Publishing an Android release

Release facts (version, version code, size, checksum, minimum Android version and supported ABIs) are never typed by hand. They are read from the published artifact. This was introduced after a re-published APK left the page advertising the previous file's checksum.

1. Publish the release and APK in [`alphwan14/help24`](https://github.com/alphwan14/help24/releases).
2. On a machine with the GitHub CLI (authenticated with `gh auth login`) and the Android SDK (`aapt2`), run:

   ```bash
   npm run sync:release                        # newest published release
   npm run sync:release -- --tag v1.0.1        # a specific tag
   npm run sync:release -- --apk path/to.apk   # use a local file, skip the download
   ```

3. Update the editorial release notes in `lib/release.ts` if needed.
4. Commit the regenerated `lib/generated/release-artifact.ts` and deploy.

The output is committed rather than generated during the build because Vercel's build machines have neither `gh` nor `aapt2`. The QR code points at the download page, not at a versioned file, so new releases never require a new QR code.

---

## Deployment

The site deploys to **Vercel** and is served at the canonical domain **[help24.co.ke](https://help24.co.ke)**. `metadataBase`, canonical URLs and the sitemap all use that domain, never the hosting provider's.

- **Search engines:** `sitemap.ts` is generated from `SITEMAP_ROUTES` in `lib/site.ts`; `robots.ts` allows all crawlers; `manifest.ts` defines the web app manifest.
- **Before merging:** `npm run lint` and `npx tsc --noEmit` must pass.

---

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(download): …`, `fix(auth): …`, `refactor(home): …`, `build: …`.
- **Explain the why.** When a choice isn't obvious, document it in a block comment at the top of the file or next to the code. State what the choice prevents, and the bug that prompted it if there was one.
- **Never edit `lib/generated/`.** Regenerate it with the matching script.
- **Hex values live only in `lib/tokens.ts`.** Add a colour there, never in a component or the Tailwind config.
- **Demo content stays labelled.** Any sample people, prices or offers must be marked as sample data on the page.

---

## Credits

- Kenya boundary data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, available under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/), via [georgique/world-geojson](https://github.com/georgique/world-geojson). Simplified for display.
- [Poppins](https://fonts.google.com/specimen/Poppins) by Indian Type Foundry, under the SIL Open Font License.

## Team

Built in Kenya by Help24's co-founders:

- **Lincoln Waniala** — Co-founder, engineering · [GitHub](https://github.com/alphwan14) · [LinkedIn](https://www.linkedin.com/in/lincoln-waniala/)
  
---

© 2026 Help24. All rights reserved.
