/**
 * Seeds the categories/subcategories that the already-imported product
 * catalog (scripts/seed-products.mjs) relies on — without these, products
 * already in Firestore would reference category/subCategory slugs that
 * don't exist in the new admin-managed categories/subcategories collections.
 *
 * Safe to run more than once: it skips any category/subcategory whose slug
 * already exists.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-categories.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const CATEGORIES = [
  { name: "Limpeza", slug: "limpeza" },
  { name: "Expediente", slug: "expediente" },
];

const SUBCATEGORIES = [
  { name: "Papel Higiênico / Papel Toalha", slug: "papel", categorySlug: "limpeza" },
  { name: "Químicos", slug: "quimicos", categorySlug: "limpeza" },
  { name: "Higiênicos", slug: "higienicos", categorySlug: "limpeza" },
  { name: "Utensílios", slug: "utensilios", categorySlug: "limpeza" },
  { name: "Luvas", slug: "luvas", categorySlug: "limpeza" },
  { name: "Dispensers", slug: "dispensers", categorySlug: "expediente" },
  { name: "Utensílios", slug: "utensilios", categorySlug: "expediente" },
];

async function initFirebase() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    console.error("Missing FIREBASE_STORAGE_BUCKET env var. See scripts/SEED-SETUP.md.");
    process.exit(1);
  }

  const { initializeApp, cert, applicationDefault } = await import("firebase-admin/app");
  const keyPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT, "serviceAccountKey.json");
  const credential = fs.existsSync(keyPath)
    ? cert(JSON.parse(fs.readFileSync(keyPath, "utf8")))
    : applicationDefault();

  initializeApp({ credential, storageBucket: bucketName });
}

async function main() {
  await initFirebase();
  const { getFirestore } = await import("firebase-admin/firestore");
  const db = getFirestore();

  let categoriesCreated = 0;
  for (const [i, category] of CATEGORIES.entries()) {
    const existing = await db
      .collection("categories")
      .where("slug", "==", category.slug)
      .limit(1)
      .get();
    if (!existing.empty) {
      console.log(`- categoria "${category.name}" já existe, pulando.`);
      continue;
    }
    await db.collection("categories").add({
      name: category.name,
      slug: category.slug,
      active: true,
      order: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    categoriesCreated++;
    console.log(`+ categoria "${category.name}" criada.`);
  }

  let subCategoriesCreated = 0;
  for (const [i, sub] of SUBCATEGORIES.entries()) {
    const existing = await db
      .collection("subcategories")
      .where("categorySlug", "==", sub.categorySlug)
      .where("slug", "==", sub.slug)
      .limit(1)
      .get();
    if (!existing.empty) {
      console.log(`- subcategoria "${sub.name}" (${sub.categorySlug}) já existe, pulando.`);
      continue;
    }
    await db.collection("subcategories").add({
      name: sub.name,
      slug: sub.slug,
      categorySlug: sub.categorySlug,
      active: true,
      order: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    subCategoriesCreated++;
    console.log(`+ subcategoria "${sub.name}" (${sub.categorySlug}) criada.`);
  }

  console.log(
    `\nDone. ${categoriesCreated} categorias e ${subCategoriesCreated} subcategorias criadas.`
  );
}

main();
