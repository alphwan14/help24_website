import { Icon } from "@/components/Icon";
import { DOWNLOAD_FAQ } from "@/lib/release";

/**
 * The questions that stop someone completing this page.
 *
 * Not a help centre — /help is that. These are only the objections that arise
 * between reading the button and tapping it: how do I install it, will it
 * update, what will it cost, is it safe, will it run on my phone.
 *
 * Native `<details>` again: opens without JavaScript, is keyboard- and
 * screen-reader-accessible for free, and browser find-in-page reaches the
 * answers while they are collapsed — which matters, because the person with
 * the question will search for their word rather than open five panels.
 *
 * The same content is emitted as FAQPage structured data by the page, so an
 * answer can surface directly in search results.
 */
export function DownloadFaq() {
  return (
    <div className="flex flex-col gap-3">
      {DOWNLOAD_FAQ.map((item) => (
        <details
          key={item.q}
          className="disclosure rounded-card border border-border bg-card"
        >
          <summary className="flex items-center justify-between gap-4 px-5 py-4 text-body-lg font-semibold text-text-primary transition-colors hover:bg-card/60">
            <span>{item.q}</span>
            <Icon
              name="chevron"
              className="disclosure-chevron h-5 w-5 shrink-0 text-text-secondary transition-transform duration-200"
            />
          </summary>
          <p className="border-t border-border px-5 py-4 text-body leading-relaxed text-text-secondary">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
