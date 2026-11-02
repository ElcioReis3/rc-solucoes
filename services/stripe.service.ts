import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

/** Lazy, same reasoning as services/firebase/admin.ts: keeps `next build` working without secrets set. */
function getStripeClient(): Stripe {
  if (client) return client;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable. See SETUP.md.");
  }
  client = new Stripe(secretKey);
  return client;
}

/** Creates a Checkout Session to buy one slot-pack (+25 product slots). */
export async function createSlotPackCheckoutSession(params: {
  adminEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const priceId = process.env.STRIPE_PRICE_ID_SLOT_PACK;
  if (!priceId) {
    throw new Error("Missing STRIPE_PRICE_ID_SLOT_PACK environment variable. See SETUP.md.");
  }

  const session = await getStripeClient().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: params.adminEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { purpose: "product_slot_pack" },
  });

  return session;
}

export function constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable. See SETUP.md.");
  }
  return getStripeClient().webhooks.constructEvent(payload, signature, webhookSecret);
}
