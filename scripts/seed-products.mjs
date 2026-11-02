/**
 * Seeds the existing static product catalog (data/product.ts) into
 * Firebase: each product's image is uploaded to Cloud Storage and the
 * product document (with the resulting image URL) is written to the
 * "products" collection in Firestore.
 *
 * Usage:
 *   node scripts/seed-products.mjs            # seed everything
 *   node scripts/seed-products.mjs --dry-run  # show what would happen, no writes
 *
 * Requires (see scripts/SEED-SETUP.md for the full walkthrough):
 *   - `npm install firebase-admin` (not a runtime dependency of the app,
 *     only needed to run this one-off script)
 *   - A Firebase service account key, pointed to via GOOGLE_APPLICATION_CREDENTIALS
 *   - FIREBASE_STORAGE_BUCKET env var (e.g. "rc-solucoes.appspot.com")
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
// firebase-admin is only imported when actually writing (not on --dry-run),
// so the dry run works even before `npm install firebase-admin` is run.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const SEED_FILE = path.join(__dirname, "data", "products-seed.json");

const DRY_RUN = process.argv.includes("--dry-run");

async function initFirebase() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    console.error(
      "Missing FIREBASE_STORAGE_BUCKET env var. See scripts/SEED-SETUP.md."
    );
    process.exit(1);
  }

  const { initializeApp, cert, applicationDefault } = await import(
    "firebase-admin/app"
  );

  const keyPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(ROOT, "serviceAccountKey.json");

  const credential = fs.existsSync(keyPath)
    ? cert(JSON.parse(fs.readFileSync(keyPath, "utf8")))
    : applicationDefault();

  initializeApp({ credential, storageBucket: bucketName });
}

function loadSeedProducts() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error(
      `Seed data not found at ${SEED_FILE}.\n` +
        "Run `node scripts/extract-products.mjs` first to regenerate it from data/product.ts."
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
}

/**
 * Uploads one product's local image and returns it in the same shape the
 * app itself stores (models/product.ts' ProductImage: { url, path }), so
 * products seeded here are indistinguishable from ones created later in the
 * admin panel — including being deletable/reorderable there.
 */
async function uploadProductImage(bucket, product) {
  const localPath = path.join(PUBLIC_DIR, product.imageUrl.replace(/^\//, ""));
  if (!fs.existsSync(localPath)) {
    console.warn(`  ! image not found, skipping upload: ${localPath}`);
    return null;
  }

  const ext = path.extname(localPath);
  const destination = `products/${product.id}/image-1${ext}`;
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
    bucket = getStorage().bucket();
  }

  let ok = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] ${product.id} - ${product.title}`);

    try {
      const image = await uploadProductImage(bucket, product);

      const doc = {
        title: product.title,
        description: product.description,
        images: image ? [image] : [],
        category: product.category,
        subCategory: product.subCategory,
        active: true,
        order: i,
        // Firestore's admin SDK converts a JS Date into its own Timestamp type.
        createdAt: DRY_RUN ? null : new Date(),
        updatedAt: DRY_RUN ? null : new Date(),
      };

      if (DRY_RUN) {
        console.log("  (dry-run) would write Firestore doc:", doc);
      } else {
        // merge:true makes the script safe to re-run (it won't duplicate docs).
        await db.collection("products").doc(product.id).set(doc, { merge: true });
      }

      ok++;
    } catch (err) {
      failed++;
      console.error(`  ! failed: ${err.message}`);
    }
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
