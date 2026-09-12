/**
 * Renders structured data into the document.
 *
 * WHY THIS IS SEPARATE FROM lib/jsonld.ts. The builders are plain data
 * functions and nothing else, which is what lets `node --test` import and
 * assert on every block this site emits — Node can strip TypeScript types but
 * it cannot transform JSX, so one `<script>` tag in that module would have put
 * the whole schema layer beyond the reach of the tests. Data in lib, rendering
 * in components, and the split is load-bearing rather than tidy.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          /*
           * The payload is built from module constants and the catalogues in
           * lib/ — never from a request, a query string or user input — and
           * JSON.stringify escapes the rest. tests/seo.test.ts asserts no block
           * can contain a closing script tag.
           */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
