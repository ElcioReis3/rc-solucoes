import { NextResponse } from "next/server";
import { requireAdmin } from "@/services/auth.service";
import { createSlotPackCheckoutSession } from "@/services/stripe.service";

/** Starts a Stripe Checkout session to buy one slot-pack (+25 product slots). */
export async function POST(request: Request) {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await createSlotPackCheckoutSession({
      adminEmail: admin.email ?? "",
      successUrl: `${origin}/admin/products?slot_purchase=success`,
      cancelUrl: `${origin}/admin/products?slot_purchase=cancelled`,
    });

    if (!session.url) throw new Error("Stripe não retornou uma URL de checkout.");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao iniciar o pagamento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
