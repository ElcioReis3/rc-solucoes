import "server-only";
import { getAdminFirestore } from "./firebase/admin";

const SETTINGS_DOC = "settings/plan";
export const DEFAULT_PRODUCT_LIMIT = 39;
export const SLOT_PACK_SIZE = 30;

export class ProductLimitReachedError extends Error {}

async function getProductLimit(): Promise<number> {
  const doc = await getAdminFirestore().doc(SETTINGS_DOC).get();
  if (!doc.exists) return DEFAULT_PRODUCT_LIMIT;
  return (doc.data()?.productLimit as number) ?? DEFAULT_PRODUCT_LIMIT;
}

export async function getProductCount(): Promise<number> {
  const snap = await getAdminFirestore().collection("products").count().get();
  return snap.data().count;
}

export async function getPlanInfo() {
  const [productCount, productLimit] = await Promise.all([
    getProductCount(),
    getProductLimit(),
  ]);
  return { productCount, productLimit, slotPackSize: SLOT_PACK_SIZE };
}

/** Throws ProductLimitReachedError if creating one more product would exceed the plan limit. */
export async function assertCanCreateProduct(): Promise<void> {
  const { productCount, productLimit } = await getPlanInfo();
  if (productCount >= productLimit) {
    throw new ProductLimitReachedError(
      `Limite de ${productLimit} produtos atingido. Compre mais ${SLOT_PACK_SIZE} vagas para continuar cadastrando.`,
    );
  }
}

const PROCESSED_EVENTS_COLLECTION = "processedStripeEvents";

/** Guards against Stripe retrying/redelivering the same webhook event. */
export async function wasStripeEventProcessed(
  eventId: string,
): Promise<boolean> {
  const doc = await getAdminFirestore()
    .collection(PROCESSED_EVENTS_COLLECTION)
    .doc(eventId)
    .get();
  return doc.exists;
}

export async function markStripeEventProcessed(eventId: string): Promise<void> {
  await getAdminFirestore()
    .collection(PROCESSED_EVENTS_COLLECTION)
    .doc(eventId)
    .set({ processedAt: new Date() });
}

/** Called by the Stripe webhook after a slot-pack purchase is confirmed. */
export async function incrementProductLimit(
  by = SLOT_PACK_SIZE,
): Promise<number> {
  const db = getAdminFirestore();
  const ref = db.doc(SETTINGS_DOC);

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = doc.exists
      ? ((doc.data()?.productLimit as number) ?? DEFAULT_PRODUCT_LIMIT)
      : DEFAULT_PRODUCT_LIMIT;
    const next = current + by;
    tx.set(ref, { productLimit: next, updatedAt: new Date() }, { merge: true });
    return next;
  });
}
