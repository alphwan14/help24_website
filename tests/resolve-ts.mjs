/**
 * Lets `node --test` follow the same import specifiers the application uses.
 *
 * THE MISMATCH. Application code is bundler-resolved: `import { CITIES } from
 * "./generated/places"` with no extension, and `@/lib/...` for the alias. Node's
 * ES module resolver does neither — it wants a real file path with a real
 * extension — so a test that imports lib/places.ts died on its first
 * extensionless import, several modules deep, with a stack that points at the
 * wrong file.
 *
 * WHY A RESOLVER HOOK AND NOT EXTENSIONS IN THE SOURCE. Writing `./generated/places.ts`
 * in lib/ would need `allowImportingTsExtensions`, which relaxes a check the
 * application benefits from, to accommodate the test runner. The runner is the
 * thing that is unusual here, so the accommodation belongs on its side of the
 * line. tsconfig.json already keeps tests out of the application programme for
 * the same reason.
 *
 * Registered by the `test` script in package.json.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(
  "data:text/javascript," +
    encodeURIComponent(`
      import { existsSync } from "node:fs";
      import { fileURLToPath } from "node:url";

      const ROOT = ${JSON.stringify(pathToFileURL(process.cwd() + "/").href)};
      const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

      export async function resolve(specifier, context, next) {
        // The "@/..." alias, same mapping as tsconfig paths.
        if (specifier.startsWith("@/")) {
          specifier = new URL(specifier.slice(2), ROOT).href;
          context = { ...context, parentURL: ROOT };
        }
        try {
          return await next(specifier, context);
        } catch (error) {
          if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
          const base = specifier.startsWith("file:")
            ? specifier
            : new URL(specifier, context.parentURL ?? ROOT).href;
          for (const ext of EXTENSIONS) {
            const candidate = base + ext;
            if (existsSync(fileURLToPath(candidate))) {
              return next(candidate, context);
            }
          }
          throw error;
        }
      }
    `),
  import.meta.url,
);
