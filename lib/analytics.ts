/**
 * Download analytics — the event contract, and the ~700 bytes of script that
 * emits it.
 *
 * WHY THERE IS NO REACT HERE
 * --------------------------
 * Tracking three interactions does not justify shipping a client component
 * tree, a hydration pass and a `useEffect` to every visitor of a page whose
 * headline requirement is that it loads instantly. Instead one inline script
 * delegates from `document`, reading `data-track` attributes off ordinary
 * server-rendered anchors. The page stays a Server Component end to end and
 * the whole feature costs less than a single React import.
 *
 * WHY IT WRITES TO `dataLayer`
 * ----------------------------
 * No analytics vendor is installed yet, and picking one now would be a guess.
 * `window.dataLayer` is the shape GTM, GA4 and most others already consume, so
 * events queue up in an array from day one and whichever tool is added later
 * finds a backlog waiting rather than a blank slate. Nothing is sent anywhere
 * until that tool exists — this is instrumentation, not collection.
 *
 * WHAT IS DELIBERATELY NOT HERE
 * -----------------------------
 * `country`. Deriving it in the browser means either an IP lookup on every
 * page load (a blocking third-party request, on the one page that must not
 * have one) or making the route dynamic to read Vercel's `x-vercel-ip-country`
 * header — which would give up static generation and the instant load with it.
 * Every analytics provider already resolves country from the request IP server
 * side, for free. This is the correct place to do nothing.
 */

/** The events this page emits. Kept small on purpose. */
export type DownloadEvent =
  /** The user asked for an artifact. Carries which platform. */
  | "download_click"
  /** The page was opened from a scanned QR code. */
  | "qr_scan"
  /** Someone copied the SHA-256 — a signal that verification matters to users. */
  | "checksum_copy";

/**
 * Attribute name read by the delegated listener. Put it on any element that
 * should report a click:
 *
 *   <a data-track="download_click" data-track-platform="android_apk" …>
 */
export const TRACK_ATTR = "data-track";

/**
 * The inline tracker.
 *
 * Runs once, at the end of the document. Everything it records is derived from
 * the user agent and the URL — no cookies, no identifiers, no network calls.
 *
 * `platform` and `browser` are coarse buckets rather than parsed versions: the
 * question this page has to answer is "did Android users succeed and desktop
 * users reach for the QR", and a full UA parser would be a dependency bought
 * to answer a question nobody asked.
 */
export const TRACKER_SCRIPT = `
(function () {
  var ua = navigator.userAgent;
  function platform() {
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    return 'desktop';
  }
  function browser() {
    if (/Edg\\//.test(ua)) return 'edge';
    if (/OPR\\/|Opera/.test(ua)) return 'opera';
    if (/Chrome\\//.test(ua)) return 'chrome';
    if (/Firefox\\//.test(ua)) return 'firefox';
    if (/Safari\\//.test(ua)) return 'safari';
    return 'other';
  }
  var base = { platform: platform(), browser: browser(), app_version: '__VERSION__' };
  window.dataLayer = window.dataLayer || [];
  window.help24Track = function (event, props) {
    var payload = { event: event }, k;
    for (k in base) payload[k] = base[k];
    for (k in props || {}) payload[k] = props[k];
    window.dataLayer.push(payload);
  };
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[${TRACK_ATTR}]');
    if (!el) return;
    window.help24Track(el.getAttribute('${TRACK_ATTR}'), {
      platform_id: el.getAttribute('${TRACK_ATTR}-platform') || undefined
    });
  });
  if (/(^|[?&])src=qr(&|$)/.test(location.search)) window.help24Track('qr_scan');
})();
`;

/** The tracker with the shipped version baked in, ready to inline. */
export function trackerScript(appVersion: string): string {
  return TRACKER_SCRIPT.replace("__VERSION__", appVersion);
}

/**
 * Copy-to-clipboard for the checksum, wired to `data-copy` targets.
 *
 * Separate from the tracker because it is a feature, not measurement, and
 * because a browser without `navigator.clipboard` (or a page served over
 * plain HTTP) must degrade to the checksum simply being selectable text —
 * which is why the value is rendered in full rather than behind the button.
 */
export const COPY_SCRIPT = `
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('[data-copy]');
    if (!btn) return;
    var value = btn.getAttribute('data-copy');
    var done = btn.querySelector('[data-copy-done]');
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(value).then(function () {
      if (window.help24Track) window.help24Track('checksum_copy');
      if (!done) return;
      done.hidden = false;
      btn.setAttribute('aria-label', 'Checksum copied');
      setTimeout(function () {
        done.hidden = true;
        btn.setAttribute('aria-label', 'Copy checksum');
      }, 2000);
    });
  });
})();
`;
