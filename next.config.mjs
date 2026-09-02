/** @type {import('next').NextConfig} */
const nextConfig = {
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
