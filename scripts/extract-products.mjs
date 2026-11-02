// Utility (dev-only, not shipped to prod) to convert data/product.ts into
// a plain JSON file the seed script can consume without a TS runtime.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.join(__dirname, "..", "data", "product.ts");
const outPath = path.join(__dirname, "data", "products-seed.json");

const src = fs.readFileSync(srcPath, "utf8");

const start = src.indexOf("export const ListProducts");
const arrayStart = src.indexOf("[", start);
const arrayEnd = src.lastIndexOf("];");
const arrayLiteral = src.slice(arrayStart, arrayEnd + 1);

// The array literal is valid JS (unquoted keys, trailing commas), so it can
// be evaluated directly in an isolated VM context — no TS types are needed
// since `as const`/type annotations don't appear inside the literal itself.
const sandbox = {};
vm.createContext(sandbox);
const result = vm.runInContext(`(${arrayLiteral})`, sandbox);

// De-duplicate ids (the source data has a couple of repeated ids) and assign
// clean, stable, sequential ids so nothing collides as a Firestore doc id.
const seen = new Set();
let next = result.length + 1;
const products = result.map((p) => {
  let id = p.id;
  while (seen.has(id)) id = `p${next++}`;
  seen.add(id);
  return { ...p, id };
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log(`Wrote ${products.length} products to ${outPath}`);
