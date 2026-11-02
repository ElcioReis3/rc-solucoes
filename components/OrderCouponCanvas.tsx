import { forwardRef } from "react";
import type { CartItem } from "@/contexts/CartContext";

type Props = {
  cart: CartItem[];
  phone: string;
};

/**
 * Off-screen "order coupon" rendered to a PNG (via html-to-image) so the customer can save a
 * picture of their cart and send it over WhatsApp as an alternative to the text message.
 * Kept deliberately plain/high-contrast so it stays legible once exported as an image.
 */
export const OrderCouponCanvas = forwardRef<HTMLDivElement, Props>(function OrderCouponCanvas(
  { cart, phone },
  ref
) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const now = new Date();

  return (
    <div
      ref={ref}
      className="w-[380px] bg-white text-gray-900 p-6"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/logo-tipo-light.png"
          alt="RC Soluções"
          className="h-10 mx-auto mb-2 object-contain"
        />
        <p className="text-sm font-bold uppercase tracking-wide">Cupom de Pedido</p>
        <p className="text-xs text-gray-500">
          {now.toLocaleDateString("pt-BR")} às {now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="space-y-2.5 mb-4">
        {cart.map((item, i) => {
          const wholesaleApplies =
            item.minWholesaleQty !== undefined && item.quantity >= item.minWholesaleQty;
          return (
            <div key={item.id} className="text-sm">
              <div className="flex justify-between gap-3">
                <span className="flex-1">
                  {i + 1}. {item.title}
                </span>
                <span className="font-bold shrink-0">{item.quantity}un</span>
              </div>
              {wholesaleApplies && (
                <p className="text-xs text-amber-700 pl-4">
                  ★ Atacado aplicado — {item.wholesaleDiscountPercent}% de desconto
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-4 flex justify-between text-sm font-bold">
        <span>Total de itens</span>
        <span>{itemCount}</span>
      </div>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Envie esta imagem pelo WhatsApp para a RC Soluções para finalizar seu pedido.</p>
        <p className="font-semibold text-gray-700">{phone}</p>
      </div>
    </div>
  );
});
