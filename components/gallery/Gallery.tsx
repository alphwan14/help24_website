/**
 * Parity harness for the design system.
 *
 * Every atom the marketplace modules are built from, rendered in isolation and
 * at the app's own sizes, so it can be held next to a phone running Discover
 * and compared. It is not a marketing page and is excluded from the sitemap
 * and from indexing.
 */
"use client";

import { useState } from "react";
import {
  CATEGORIES,
  COPY,
  PALETTE,
  POST_TYPES,
  RADIUS,
  STATUS_COLOR_CONFLICT,
  TYPE,
  URGENCY,
  cardMoneyLabel,
  type PaletteKey,
} from "@/lib/tokens";
import { POSTS } from "@/lib/demo/seed";
import { Avatar } from "@/components/ds/Avatar";
import { Badge, PostTypeBadge, UrgencyBadge } from "@/components/ds/Badge";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { DemoChip } from "@/components/ds/DemoChip";
import { FilterPillRow } from "@/components/ds/FilterPill";
import { SearchField } from "@/components/ds/SearchField";
import { ApplicantList, PostCard } from "@/components/ds/PostCard";

function Block({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h4 font-semibold text-text-primary">{title}</h2>
      {note ? <p className="mt-1 max-w-prose text-body-sm text-text-secondary">{note}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const request = POSTS.find((p) => p.type === "request" && (p.applicants?.length ?? 0) > 2)!;
  const offer = POSTS.find((p) => p.type === "offer")!;
  const noBudget = POSTS.find((p) => p.price === 0)!;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <header>
        <p className="text-label-md font-medium uppercase tracking-wider text-primary-bright">
          Internal
        </p>
        <h1 className="mt-2 text-h2 font-semibold text-text-primary">Component parity</h1>
        <p className="mt-3 max-w-prose text-body text-text-secondary">
          Every value on this page is read from <code className="text-primary-bright">lib/tokens.ts</code>,
          which was extracted from the Flutter app. Nothing here is a screenshot.
        </p>
      </header>

      <Block
        title="Palette"
        note="Token name, the CSS custom property it becomes, and the hex it resolves to."
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(PALETTE) as PaletteKey[]).map((k) => (
            <li
              key={k}
              className="flex items-center gap-3 rounded-badge border border-border bg-card p-2.5"
            >
              <span
                className="h-9 w-9 shrink-0 rounded-tag border border-border"
                style={{ background: `var(--${k})` }}
              />
              <span className="min-w-0">
                <span className="block truncate text-body-sm font-medium text-text-primary">--{k}</span>
                <span className="block font-mono text-label-sm uppercase text-text-secondary">
                  {PALETTE[k]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        title="Two definitions of red, amber and green"
        note="The app declares each of these twice and renders both. Urgency chips use the right-hand column; escrow, status and money use the left. Neither was picked over the other."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(STATUS_COLOR_CONFLICT).map(([role, pair]) => (
            <div key={role} className="rounded-card border border-border bg-card p-4">
              <p className="text-body-sm font-medium capitalize text-text-primary">{role}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-tag" style={{ background: pair.theme }} />
                  <code className="text-label-md text-text-secondary">AppTheme {pair.theme}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-tag" style={{ background: pair.urgency }} />
                  <code className="text-label-md text-text-secondary">urgencyColor {pair.urgency}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Radius scale" note={`Poppins, weights ${TYPE.weights.join(" / ")}.`}>
        <div className="flex flex-wrap gap-4">
          {Object.entries(RADIUS).map(([name, px]) => (
            <div key={name} className="text-center">
              <div
                className="h-16 w-16 border border-border bg-card"
                style={{ borderRadius: Math.min(px, 32) }}
              />
              <p className="mt-2 text-label-md text-text-secondary">
                {name} · {px}px
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Avatar" note="Initials fallback, 40% of the diameter, weight 600.">
        <div className="flex items-end gap-4">
          {[24, 28, 32, 40, 56].map((s) => (
            <div key={s} className="text-center">
              <Avatar name="Amina Yusuf" size={s} />
              <p className="mt-2 text-label-sm text-text-secondary">{s}px</p>
            </div>
          ))}
          <div className="text-center">
            <Avatar name="" size={32} />
            <p className="mt-2 text-label-sm text-text-secondary">empty</p>
          </div>
        </div>
      </Block>

      <Block title="Badge — post type" note="15% fill, 50% border, 11px semibold.">
        <div className="flex flex-wrap gap-2">
          {POST_TYPES.map((t) => (
            <PostTypeBadge key={t.key} type={t.key} />
          ))}
        </div>
      </Block>

      <Block title="Badge — urgency" note="12% fill, no border, 10.5px semibold. Requests only.">
        <div className="flex flex-wrap gap-2">
          {URGENCY.map((u) => (
            <UrgencyBadge key={u.key} value={u.key} />
          ))}
        </div>
      </Block>

      <Block title="Badge — tag variants" note="The chips a card composes from category answers and state.">
        <div className="flex flex-wrap gap-2">
          <Badge token="primary">Today</Badge>
          <Badge token="primary" icon="people">
            3 applied
          </Badge>
          <Badge token="money">Same day</Badge>
          <Badge token="money" icon="wallet">
            M-Pesa
          </Badge>
          <Badge token="warning" icon="lock">
            {COPY.paymentProtected}
          </Badge>
          <Badge token="urgency-urgent" icon="timer">
            12 min left
          </Badge>
        </div>
      </Block>

      <Block title="CategoryChip — all 32" note="The full Category.all list, in the app's order.">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <CategoryChip key={c.name} name={c.name} />
          ))}
        </div>
      </Block>

      <Block title="CategoryChip — selectable" note="The composer's variant. Uses primary-bright so the label clears AA.">
        <div className="flex flex-wrap gap-2">
          <CategoryChip name="Plumbing" selectable selected />
          <CategoryChip name="Electrical" selectable />
          <CategoryChip name="House Cleaning" selectable />
        </div>
      </Block>

      <Block title="FilterPill" note="42px tall, 24px radius, 10px gap. Independent pills, not a segmented track.">
        <FilterPillRow
          label="Demo filter"
          options={COPY.filters}
          value={filter}
          onChange={setFilter}
        />
      </Block>

      <Block title="SearchField" note="The app's inputDecorationTheme: card fill, 12px radius, 1px border, primary on focus.">
        <div className="max-w-md space-y-4">
          <SearchField
            label="Demo search"
            value={query}
            onChange={setQuery}
            placeholder={COPY.searchHint.all}
          />
          <SearchField
            label="Demo search large"
            value={query}
            onChange={setQuery}
            placeholder="What do you need done?"
            size="lg"
          />
        </div>
      </Block>

      <Block title="DemoChip" note="Goes on every module that renders seed data.">
        <DemoChip />
      </Block>

      <Block
        title="PostCard — Request"
        note="Visitor sees Offer Service. The author sees Applications (n). Click the title to expand in place."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-label-md uppercase tracking-wider text-text-secondary">visitor</p>
            <PostCard
              post={request}
              expanded={expanded}
              onToggle={() => setExpanded((v) => !v)}
            >
              <ApplicantList applicants={request.applicants ?? []} />
            </PostCard>
          </div>
          <div>
            <p className="mb-2 text-label-md uppercase tracking-wider text-text-secondary">owner</p>
            <PostCard post={request} viewer="owner" />
          </div>
        </div>
      </Block>

      <Block title="PostCard — Offer" note="No urgency chip on an offer; availability and M-Pesa instead.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-label-md uppercase tracking-wider text-text-secondary">visitor</p>
            <PostCard post={offer} />
          </div>
          <div>
            <p className="mb-2 text-label-md uppercase tracking-wider text-text-secondary">owner</p>
            <PostCard post={offer} viewer="owner" />
          </div>
        </div>
      </Block>

      <Block
        title="PostCard — no budget"
        note={`cardMoneyLabel returns "${cardMoneyLabel("request", 0)}" when a request has no price.`}
      >
        <div className="max-w-md">
          <PostCard post={noBudget} />
        </div>
      </Block>

      <Block title="Money labels" note="cardMoneyLabel, per post type and pricing period.">
        <ul className="space-y-1 font-mono text-body-sm text-money">
          <li>{cardMoneyLabel("request", 1000)}</li>
          <li>{cardMoneyLabel("request", 0)}</li>
          <li>{cardMoneyLabel("offer", 300)}</li>
          <li>{cardMoneyLabel("offer", 900, "hour")}</li>
          <li>{cardMoneyLabel("job", 25000, "month")}</li>
        </ul>
      </Block>
    </main>
  );
}
