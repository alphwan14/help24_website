# Help24 search architecture

Last reviewed: 12 September 2026. Written against Google Search Central
documentation as it stood on that date.

This is the reference for how help24.co.ke is meant to be found. It records the
decisions, not just the settings — a setting without its reasoning gets undone
by the next person who finds it inconvenient.

---

## 1. The constraint everything else follows from

**Help24 has no marketplace supply yet.** Production, on 12 September 2026:

| Thing | Count |
| --- | --- |
| User accounts | 16 |
| Accounts with a profession set | 4 |
| Verified providers | 0 |
| Posts (mostly test data) | 50 |
| Reviews | 2 |

Launch is 19 October 2026.

Almost every conventional marketplace SEO play depends on supply. "23 plumbers
in Nyali", provider profile pages, aggregate ratings, price ranges from
completed jobs, review-rich category pages — all of them require data that does
not exist, and inventing any of it would be both a lie to users and, in Google's
terms, misrepresentation in structured data.

So the architecture is built on what **is** true and checkable:

- the app's real service catalogue (31 categories, from `post_model.dart`)
- the app's real location registry (479 places, byte-identical to the server's
  `locations` table)
- how the marketplace actually works — free to post, provider quotes, agreed
  price, escrow
- genuine domain knowledge about the trades and the places

When supply arrives, live counts and real reviews become an **addition** to
these pages rather than the thing holding them up. Nothing has to be rebuilt.

---

## 2. Route architecture

```
/                                   homepage
/services                           catalogue hub
/services/<service>                 30 service pages
/services/<service>/<city>          32 service-in-city pages (gated, see §4)
/areas                              coverage hub
/areas/<city>                       6 city pages
/guides                             editorial hub
/guides/<slug>                      3 guides
/how-it-works  /download  /safety  /help  /support
/for-customers  /for-providers  /become-a-provider
/about  /contact
/privacy  /terms  /community-guidelines
```

**89 indexable URLs.**

Slugs come from the app's own registries, never invented for the web. `/areas/mombasa`
carries the same string the database stores, so a web URL and a post's location
can always be joined. Renaming one is a breaking change and needs a 301.

### Why `/areas` and not `/locations` or `/kenya`

Shorter, reads naturally in "areas we cover", and does not imply a country tier
that would only ever have one member. In code the registry's sub-places are
called neighbourhoods to avoid colliding with the URL word.

### Why no neighbourhood tier

Nairobi alone has 69 neighbourhoods in the registry. `/services/<service>/<city>/<neighbourhood>`
would be several thousand URLs whose only difference is a place name. The
neighbourhoods appear as **real names in the copy** of their city's page
instead, which earns the semantic coverage without the URLs.

---

## 3. Indexing policy

Declared once in `lib/routes.ts`, which the sitemap reads and `tests/seo.test.ts`
enforces. Three states:

### INDEX — all 89 routes above

Public, useful, in the sitemap.

### NOINDEX — `/components`, `/auth/continue`

Reachable and **crawlable**, carrying `robots: noindex`.

Crawlable is deliberate and is the part people get wrong. A URL disallowed in
robots.txt can still be indexed from an external link, and Google cannot read a
`noindex` it was never permitted to fetch — producing a bare URL in results with
no description. Crawlable-and-noindexed is the *stronger* control.

### BLOCKED in robots.txt — `/auth/action`, `/api/`

Only where crawling itself is the thing to prevent. `/auth/action` receives
single-use identity credentials in its query string. `/api/` is machine surface.

Nothing else is blocked. No CSS or JS is blocked — Googlebot renders pages and
judges a page it cannot style as the broken thing it appears to be.

### What is not in the app at all

There is no logged-in surface on this website. Dashboards, messaging, jobs and
settings live in the Flutter app, so the usual "noindex the dashboard" work does
not apply here. If a web account area is ever added, it belongs in BLOCKED
behind a single prefix, decided here first.

---

## 4. The scaled-content gate

**The single most important rule in this document.**

30 services × 34 cities = 1,020 possible service-in-city URLs. Generating them
from a template is scaled content abuse under Google's current spam policies
("many pages are generated for the primary purpose of manipulating search
rankings and not helping users"), and the consequence is sitewide.

The rule, implemented in `lib/places.ts`:

> A `/services/<service>/<city>` page exists **if and only if** a human has
> written a `LOCAL_NOTES` entry for that exact pair.

`generateStaticParams` returns the keys of that map and nothing else. There is
no product of two arrays anywhere in the route. Adding a page *is* writing the
content; there is no other way in. `dynamicParams = false` makes every
ungated combination a real 404 rather than a rendered thin page —
`/services/plumbing/kakamega` returns 404 today, and should.

Four tests hold it shut:

- every pair has a note, of at least two paragraphs, each at least 120 characters
- no note is reused across cities
- every note names its own city, one of its neighbourhoods, or its county
- notes only reference services flagged `local` and cities that have a page

The third test is the one that catches the failure mode that matters: a note
that would read identically with the place name swapped is not local knowledge,
and the test rejects it. It has already caught one — a Mombasa masonry note that
never said "Mombasa".

### City pages: the same principle

A city gets a page when the **registry knows its neighbourhoods**. That is not
arbitrary: it is the same six places mapped at street level, which is the same
six where the app can position a post precisely, which is the same six where a
page can say something specific. Mombasa, Nairobi, Kisumu, Nakuru, Eldoret,
Thika.

The other 28 cities and 22 county headquarters are **named in plain text** on
`/areas`. A visitor from Nyeri sees Nyeri and learns the app reaches them; they
are not sent to a page with nothing on it.

### Scaling this honestly

In order of value:

1. **Write more local notes.** Each one is a page. The ceiling is 12 local
   services × 6 city pages = 72, and 32 exist.
2. **Map more cities in the app's registry.** A city that gains neighbourhoods
   gains a page automatically, and becomes eligible for service pages.
3. **Add live supply when it exists.** Provider counts, real reviews and
   response times become sections on pages that already stand up without them.

What must never happen: relaxing the gate to a boolean flag or a threshold.

---

## 5. Canonical strategy

- One canonical host: `https://help24.co.ke`. `www` 307s to apex; HTTP 308s to
  HTTPS. Both verified live.
- No trailing slashes. `/services/` 308s to `/services`, and `canonical()` in
  `lib/seo.ts` strips one if given, so a canonical can never point at a URL that
  redirects.
- Every route that renders a page calls `pageMetadata({ path })`, which sets the
  self-canonical.

**The trap this closes:** the root layout declares `alternates: { canonical: "/" }`.
Next's metadata resolution means any page that does not override it *inherits*
it and ships declaring itself a duplicate of the homepage. `/components` did
exactly this for months. Every page now sets its own, including the homepage.

No query parameters are canonical. There are no filtered or faceted URLs on this
site — search and filtering live in the app — so there is no infinite parameter
space to canonicalise away. If web search is ever added, its result URLs are
NOINDEX and the intent gets a curated landing page instead.

---

## 6. Sitemap

One file at `/sitemap.xml`, 89 URLs, generated from `lib/routes.ts`.

- **No `<priority>`, no `<changefreq>`.** Google's documentation states plainly
  that it ignores both. They were bytes inviting somebody to tune them.
- **`<lastmod>` only on the guides.** Google uses `lastmod` where it is
  "consistently and verifiably accurate". Stamping 89 URLs with the build date
  trains it to ignore the field. The guides have real content dates; nothing
  else does. A test enforces this.
- **No sitemap index.** The limit is 50,000 URLs. Splitting into
  pages/services/locations would buy separate Search Console reporting and cost
  an extra file to keep in step — worth it at a few thousand URLs, not at 89.
- Only canonical URLs. No noindexed route, no `/auth`, `/api` or `/components`.
  Tested.

---

## 7. Structured data

| Type | Where | Why |
| --- | --- | --- |
| `Organization` | root layout, `@id`-addressed | Teaches Google that "Help24" is a Kenyan services marketplace and not one of the other things called Help24 |
| `WebSite` | root layout | Publisher link back to the organisation |
| `BreadcrumbList` | every nested page | Google still renders breadcrumb trails; cheapest way to make the hierarchy legible |
| `Service` | service and service-in-city pages | States what the page is about, who provides it and where. No rich result attaches; it is for entity understanding and AI surfaces |
| `Article` | guides | Real `datePublished`/`dateModified`, author is the organisation |

Every value in the markup is **also visible on the page**. That is the standing
rule and the one most often broken.

### Deliberately absent

- **`LocalBusiness`** — requires a physical `address` and asserts a place a
  customer can visit. Help24 has no branches. `LocalBusiness` on
  `/services/plumbing/mombasa` would claim a Help24 premises in Mombasa that
  does not exist. This is the single most common structured-data violation among
  marketplace and directory sites and it is a manual-action risk.
- **`FAQPage`** — Google deprecated FAQ rich results; as of May 2026 the
  documentation is withdrawn and the feature is shown only for government and
  health sites. The questions on these pages are real and stay as ordinary
  headed prose, which is what readers and AI surfaces consume anyway.
- **`AggregateRating` / `Review`** — two reviews exist in production. A rating
  from two reviews is not a rating.
- **`SearchAction`** — the sitelinks searchbox it powered was retired in 2024.
- **`sameAs`** — see §8.

### The `sameAs` removal

The Organization block previously claimed `twitter.com/help24`,
`instagram.com/help24` and `linkedin.com/company/help24`. None belong to this
company; the Instagram handle is a private individual's account, display name
"Kaycie".

`sameAs` is an **identity assertion** — it tells Google those accounts *are*
this entity. Pointing it at strangers both misdirects entity resolution and
hands whatever they post a claim on the Help24 name. The field is now empty and
a test fails if it returns. It comes back when Help24 owns accounts and somebody
can name them.

---

## 8. What a crawler sees that a reader does not

Every page on this site is server-rendered or statically generated. There is no
client-only content, no `fetch` in any page, and no route where the markup
depends on hydration. `/services/plumbing/mombasa` returns 1,078 words of
visible text in the initial HTML response.

That is the good half. The half that needed work:

**The demo modules render fabricated people, ratings and prices into the server
HTML.** "Joseph Mwangi · 4.8 · KES 1,100" is in the bytes Googlebot receives,
deliberately, because the sandbox has to work without JavaScript. A human sees
it inside a module captioned *Demo — these are not real posts or real people*
and understands. A snippet or an AI Overview lifts the sentence away from the
caption, and Help24 then appears to claim a provider called Joseph Mwangi rated
4.8.

Every seed-data subtree now carries **`data-nosnippet`** — Google's documented
control for exactly this. The text stays crawlable and indexable; it cannot be
quoted back. Applied in: `StoryDemo`, `LiveBoard`, `BeforeAfter`, `TwoSided`,
`TaskComposer`, the `Situations` miniature, and the illustration column of each
`Trust` act.

Scoping matters. The attribute is on the seed data only — the `Trust` prose
beside the illustration is a real claim about how escrow works and stays
quotable, and so do the `Situations` category names. `Coverage` is untouched: it
renders real city and category names.

`Section` grew a `nosnippet` prop so future modules can opt in the same way. The
existing `DemoChip` convention is the same honesty aimed at the human audience;
this is its counterpart.

---

## 9. Internal linking

```
                 Homepage
                    │
     ┌──────────────┼──────────────┬────────────┐
     ▼              ▼              ▼            ▼
 /services       /areas        /guides      /download
     │              │              │
     ▼              ▼              │
 /services/X ◄─► /areas/C         │
     │              │              │
     └──────┬───────┘              │
            ▼                      │
  /services/X/C ◄────── related ───┘
```

Concretely:

- **Homepage → depth.** `Explore` is the homepage's one navigational section:
  12 services, 6 cities, both hubs. Before it, the only routes off the homepage
  were the header and footer.
- **Hub → service.** `/services` renders every category as a linked card with a
  sentence of context. It was 31 chips and a dead end.
- **Service → city.** Each service page lists the cities that have a page for
  it, as "Plumbers in Mombasa".
- **Service ↔ service.** Four hand-picked related services per page, chosen
  because they genuinely co-occur (plumbing → masonry, for making good).
- **City ↔ service.** City pages list the services written up for them, then
  every remaining service linked to its national page, honestly labelled.
- **Sideways within a city.** A service-in-city page links to the other trades
  with a page in that same city — the "plumber in Mombasa → electrician in
  Mombasa" path.
- **Guides → services.** Each guide links the services it genuinely applies to.
- **Footer.** Gained *Where we work* and *Guides*. The header stays at four
  items; a fifth costs the bar its quietness.

Anchor text is the service or place name inside a sentence. No keyword blocks,
no "plumber Nairobi | plumber Mombasa | plumber Kisumu" footer strips — those
are what Google's spam policies describe and they look like it too.

---

## 10. Content strategy

Three guides, at `/guides`. The test each had to pass: **does Help24 actually
know this?**

1. **Writing a job request that gets good offers** — direct platform expertise.
2. **Checking a fundi before you hire** — EPRA, NCA, PSRA, NITA explained, plus
   the reference checks that matter more than any certificate. Genuinely
   differentiated: nobody writing "plumbers in Kenya" gets the Kenyan
   credentials right.
3. **What to agree before work starts** — scope, price, materials, timing,
   making good, warranty.

Authorship is the organisation, not an invented person with a stock headshot.

### What was deliberately not written

The obvious play is pricing: "how much does it cost to rewire a house in Kenya",
thirty times. Those pages rank. Help24 cannot write them honestly — every figure
would be invented, and people budget against published figures. The `/guides`
page says this out loud rather than leaving a hole.

Unlocks when there is real completed-job data. Until then, every service page
carries **what moves the price** instead, which is true now and stays true.

### Next, in order

1. More local notes (§4) — each is a page, and the mechanism exists.
2. Pricing guides, once transaction data supports them.
3. Provider profile pages (§11), once there are providers.
4. Seasonal/practical guides where expertise is real: what the long rains do to
   a roof; getting a deposit back at the end of a tenancy.

---

## 11. Provider pages: not yet, and why

Four accounts have a profession set and none is verified. Publishing provider
profiles today would mean four thin pages, zero ratings, and a privacy surface
built before there is anything to put on it.

When they are built:

- `/providers/<slug>` — slug from a display name, never a database id
- name, services offered, service area, genuine verification status, real
  completed-job count and real reviews
- **never**: phone, email, physical address, payment details, internal ids,
  private job details, customer information
- indexable only above a real threshold — verified, a completed job, a filled-in
  profile. Everything below it is `noindex`, exactly the gate in §4 applied to
  people
- `ProfilePage` + `Person`; `AggregateRating` only with a genuine number of
  genuine reviews
- providers must be able to opt out of indexing, and that must be honoured in
  the sitemap

---

## 12. Performance

Measure before optimising. Current state:

- Every new route is statically generated. `/services/<service>` is 229 B of
  route JS on a 102 kB shared First Load.
- The new pages ship **no client components**. No hydration cost beyond the
  shared header.
- Fonts: `next/font` with `display: swap`, self-hosted, subset to latin.
- Design tokens are inlined into `<head>` server-side, so first paint has them.
- No third-party scripts. No analytics, no tag manager, no chat widget. This is
  the largest single Core Web Vitals advantage the site has and it should be
  defended — a tag manager is the usual way a good INP score is lost.
- CLS: the heaviest risk is the animated homepage modules, which use fixed
  heights for exactly that reason.
- Images: the only raster assets are the icon set. The new pages use inline SVG
  glyphs.

Not yet measured: field Core Web Vitals. There is no meaningful traffic to
measure. Check Search Console's Core Web Vitals report once impressions exist —
see the checklist.

---

## 13. Google Search Console

The property is verified: the meta verification token is in the root layout.
Everything else has to be done by a person.

1. Confirm the **domain property** for `help24.co.ke` (DNS TXT), not only the
   URL-prefix property. A domain property covers `www`, HTTP and every
   subdomain.
2. Submit `https://help24.co.ke/sitemap.xml`. Confirm it reports 89 discovered
   URLs.
3. URL-inspect and **Request Indexing** for, in order: `/`, `/services`,
   `/services/plumbing`, `/services/plumbing/mombasa`, `/areas/mombasa`,
   `/guides/checking-a-provider`.
4. On each, use **View Crawled Page → HTML** and confirm the rendered HTML holds
   the body copy, the canonical and the JSON-LD. This is the check that catches
   a rendering problem no browser shows.
5. Run `/services/plumbing/mombasa` through the **Rich Results Test** and the
   **Schema Markup Validator**. Expect BreadcrumbList to be eligible; Service
   and Organization parse without a rich result, which is correct.
6. **Pages** report weekly for the first month. Watch for *Discovered – currently
   not indexed* (normal for a new site with no links) and *Crawled – currently
   not indexed* (a quality signal worth acting on).
7. **Core Web Vitals** and **Mobile Usability** once there are impressions.
   Before that they have no data and mean nothing.
8. **Performance** report: monitor which queries produce impressions. On a new
   site expect brand queries first, then long-tail service+city.
9. Set up **email alerts** for manual actions and coverage drops.

### Google Business Profile

**Do not create one yet, and probably never as a storefront.**

A Business Profile represents a business with a physical location customers
visit, or a service-area business that travels to customers. Help24 is neither —
it is a marketplace whose providers are independent. Listing Help24 with a
fabricated Mombasa address is a guidelines violation and a suspension risk, and
listing every provider as a Help24 location is worse.

If Help24 opens a genuine staffed office that customers can visit, a Business
Profile for *that office* is legitimate. Until then, the entity work in §7 is
the correct equivalent.

---

## 14. Known limitations

Honest, because pretending otherwise wastes somebody's month.

- **Nothing here creates demand or authority.** These pages make Help24
  *eligible* to rank. Ranking additionally needs links, brand signals and
  engagement, none of which are code.
- **Backlinks: zero strategy, zero links.** This is the largest gap and it is
  not a technical one. Kenyan directories, press, and partnerships are the
  realistic routes.
- **Supply is the binding constraint.** The strongest possible plumbing page
  cannot help somebody who posts a job and gets no offers. Provider recruitment
  outranks every remaining SEO task.
- **No reviews, no ratings, no prices.** The three things that most improve a
  marketplace's search performance are all blocked on transactions.
- **Competitors have years of accrued authority.** Sites like bestcare.co.ke
  rank on thin programmatic city pages that Help24's pages beat on quality but
  not yet on age or links.
- **Indexing is Google's decision.** A new domain with no links may take weeks
  to index deeply, and some pages may never be indexed. Requesting indexing
  influences it; it does not control it.
- **32 service-in-city pages is deliberately small.** It will look like
  under-coverage next to a competitor with 900. That is the trade, and it is the
  right one.

---

## 15. Maintenance

- `npm test` — 69 assertions covering the catalogue, the gate, canonicals, the
  sitemap and every JSON-LD block. Run before every deploy.
- `npm run sync:places` — regenerates `lib/generated/places.ts` from the Flutter
  app's registry. Run after a location registry change.
- Adding a service: add to `SERVICES` in `lib/services.ts` with every field
  filled. The test fails until the app has the category too.
- Adding a service-in-city page: write the `LOCAL_NOTES` entry. That is the
  whole procedure.
- Adding a guide: add to `GUIDES` with real dates.
- **Changing a slug is a breaking change.** Add a 301 in `next.config.mjs`
  before shipping it.
