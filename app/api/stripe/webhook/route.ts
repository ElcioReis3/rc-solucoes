import { NextResponse } from "next/server";
import { constructWebhookEvent } from "@/services/stripe.service";
import {
  incrementProductLimit,
  markStripeEventProcessed,
  wasStripeEventProcessed,
} from "@/services/plan.service";

/**
 * Stripe calls this directly (no admin session involved) after a payment.
 * Authentication here is the webhook signature, not the admin cookie.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    // Loga o motivo real (chave errada, segredo desatualizado, etc.) no terminal — o Stripe só
    // recebe "Assinatura inválida.", sem detalhe nenhum.
    console.error(
      "Falha ao validar o webhook do Stripe:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    if (await wasStripeEventProcessed(event.id)) {
      // Stripe retried a webhook we already handled — acknowledge without reapplying it.
      return NextResponse.json({ received: true });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.metadata?.purpose === "product_slot_pack" && session.payment_status === "paid") {
        await incrementProductLimit();
      }
    }

    await markStripeEventProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (err) {
    // A assinatura já foi validada aqui — o erro é no processamento em si (Firestore, etc.).
    // Loga o motivo real; devolve 500 pro Stripe tentar reentregar o evento depois.
    console.error(
      "Falha ao processar o webhook do Stripe:",
      err instanceof Error ? (err.stack ?? err.message) : err
    );
    return NextResponse.json({ error: "Falha ao processar o evento." }, { status: 500 });
  }
}
