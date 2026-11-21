// LUMARIS — "The Poster for a Place That Isn't There" (make.fun)
// Writes one image, assets/poster.png, to /output/entry.png.
// Standard library only, no network.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "assets", "poster.png");
const outDir = "/output";
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Gate check: the entry must be a whole PNG of at most 1 MiB.
const bytes = readFileSync(target);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG");
}
if (statSync(target).size > MAX_BYTES) {
  throw new Error(`entry.png exceeds ${MAX_BYTES} bytes`);
}
console.log(`wrote ${target} (${bytes.length} bytes)`);
