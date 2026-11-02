/**
 * Seeds the RC Soluções product photos (scripts/data/products-seed-rc.json,
 * generated from the WhatsApp photo export) into Firebase: each product's
 * image is uploaded to Cloud Storage and the product document is written to
 * the "products" collection in Firestore, in the exact shape the admin
 * panel itself writes (models/product.ts), so these products are fully
 * editable there afterwards — same as anything created by hand.
 *
 * Idempotent: matches existing products by title, so re-running this script
 * never creates duplicates. It only creates — it never overwrites a product
 * you already edited in the admin panel.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-rc-products.mjs            # seed everything
 *   node --env-file=.env scripts/seed-rc-products.mjs --dry-run  # show what would happen, no writes
 *
 * Requires (see scripts/SEED-SETUP.md for the full walkthrough):
 *   - A Firebase service account key, pointed to via GOOGLE_APPLICATION_CREDENTIALS
 *   - FIREBASE_STORAGE_BUCKET env var
 *   - scripts/seed-categories.mjs already run once (products reference the
 *     "limpeza" category and its subcategories)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const SEED_FILE = path.join(__dirname, "data", "products-seed-rc.json");

const DRY_RUN = process.argv.includes("--dry-run");

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

function loadSeedProducts() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error(`Seed data not found at ${SEED_FILE}.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
}

function guessContentType(ext) {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".jpeg":
    case ".jpg":
    default:
      return "image/jpeg";
  }
}

/** Uploads one product's local image and returns it in the same shape the app itself stores
 *  (models/product.ts' ProductImage: { url, path }). */
async function uploadProductImage(bucket, docId, imageUrl) {
  const localPath = path.join(PUBLIC_DIR, imageUrl.replace(/^\//, ""));
  if (!fs.existsSync(localPath)) {
    console.warn(`  ! image not found, skipping upload: ${localPath}`);
    return null;
  }

  const ext = path.extname(localPath);
  const destination = `products/${docId}/image-1${ext}`;
  const token = crypto.randomUUID();

  if (DRY_RUN) {
    console.log(`  (dry-run) would upload ${localPath} -> ${destination}`);
    return { url: `DRY-RUN-URL/${destination}`, path: destination };
  }

  await bucket.upload(localPath, {
    destination,
    metadata: {
      contentType: guessContentType(ext),
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const encodedPath = encodeURIComponent(destination);
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
  return { url, path: destination };
}

async function main() {
  const products = loadSeedProducts();
  console.log(
    `Loaded ${products.length} products from seed file.${
      DRY_RUN ? " (dry run, no writes will happen)" : ""
    }`
  );

  let db = null;
  let bucket = null;

  if (!DRY_RUN) {
    await initFirebase();
    const { getFirestore } = await import("firebase-admin/firestore");
    const { getStorage } = await import("firebase-admin/storage");
    db = getFirestore();
    db.settings({ ignoreUndefinedProperties: true });
    bucket = getStorage().bucket();
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] ${product.title}`);

    try {
      if (!DRY_RUN) {
        const existing = await db
          .collection("products")
          .where("title", "==", product.title)
          .limit(1)
          .get();
        if (!existing.empty) {
          console.log("  - already exists, skipping.");
          skipped++;
          continue;
        }
      }

      const docRef = DRY_RUN ? { id: `dry-${i}` } : db.collection("products").doc();
      const image = await uploadProductImage(bucket, docRef.id, product.imageUrl);

      const doc = {
        title: product.title,
        description: product.description,
        images: image ? [image] : [],
        category: product.category,
        subCategory: product.subCategory,
        active: true,
        order: i,
        showPrice: false,
        showWholesale: false,
        createdAt: DRY_RUN ? null : new Date(),
        updatedAt: DRY_RUN ? null : new Date(),
      };

      if (DRY_RUN) {
        console.log("  (dry-run) would create Firestore doc:", doc);
      } else {
        await docRef.set(doc);
      }

      created++;
    } catch (err) {
      failed++;
      console.error(`  ! failed: ${err.message}`);
    }
  }

  console.log(`\nDone. ${created} criados, ${skipped} já existiam, ${failed} falharam.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
