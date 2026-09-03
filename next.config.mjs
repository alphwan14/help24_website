/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * DEV AND PRODUCTION GET SEPARATE BUILD DIRECTORIES.
   *
   * THE BUG THIS FIXES. `next build` and `next dev` both wrote to `.next`,
   * and they write incompatible things into it: a production build emits
   * hashed chunks, the dev server emits its own and expects a manifest that
   * matches. Run one after the other and the second finds the first's
   * leftovers — which surfaces as
   *
   *     Error: Cannot find module './948.js'
   *     Require stack: .next/server/webpack-runtime.js
   *
   * on a page that is perfectly fine. The usual advice is "delete .next", but
   * that is a workaround somebody has to remember every single time they
   * switch, and forgetting it looks exactly like a broken application.
   *
   * Giving each mode its own directory makes the situation impossible instead
   * of recoverable. `next dev` sets NODE_ENV=development before it reads this
   * file; `next build` and `next start` set production. So dev owns
   * `.next-dev` and the production pipeline keeps `.next` — which also means
   * Vercel, which only ever runs `next build`, is completely unaffected.
   *
   * Both are gitignored.
   */
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",

  async headers() {
    return [
      {
        /**
         * The identity action handler.
         *
         * `no-referrer` is the load-bearing one. The page is reached with a
         * single-use code in the query string, and although the handler strips
         * it from the URL before any network call, the document still contains
         * links (Continue, Back to Help24, the support mailto). A default
         * referrer policy would attach the originating URL to those
         * navigations, which is the one path by which a live reset credential
         * could still walk off the page.
         *
         * `no-store` keeps the response — and any future variant of it — out of
         * shared caches, and `noindex` is belt-and-braces alongside the route's
         * own metadata.
         */
        source: "/auth/action",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        // The post-action landing page. Its middleware already strips the
        // query before anything renders, so this is defence in depth rather
        // than the primary control.
        source: "/auth/continue",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
