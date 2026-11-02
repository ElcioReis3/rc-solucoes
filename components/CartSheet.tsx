"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Minus, Plus, ImageDown, Loader2 } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";
import { useWhats } from "@/hooks/useWhats";
import { OrderCouponCanvas } from "./OrderCouponCanvas";

export function CartSheet() {
  const { cart, remove, setQuantity, clear } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const couponRef = useRef<HTMLDivElement>(null);
  const [generatingCoupon, setGeneratingCoupon] = useState(false);

  const phone = useWhats();
  const buildMessage = () => {
    let msg = "Olá, gostaria de solicitar os seguintes produtos:%0A%0A";
    cart.forEach((item, i) => {
      const wholesaleApplies =
        item.minWholesaleQty !== undefined && item.quantity >= item.minWholesaleQty;
      msg += `${i + 1}. ${item.title} (qtd: ${item.quantity})`;
      if (wholesaleApplies) {
        msg += ` - atacado aplicado (-${item.wholesaleDiscountPercent}%)`;
      }
      msg += "%0A";
    });
    return msg;
  };

  const sendWhatsApp = () => {
    const url = `https://wa.me/${phone}?text=${buildMessage()}`;
    window.open(url, "_blank");
  };

  const downloadCoupon = async () => {
    if (!couponRef.current) return;
    setGeneratingCoupon(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(couponRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "pedido-rc-solucoes.png";
      link.click();

      toast.success("Cupom do pedido salvo! Envie a imagem pelo WhatsApp se preferir.");
    } catch {
      toast.error("Não foi possível gerar a imagem do pedido. Tente novamente.");
    } finally {
      setGeneratingCoupon(false);
    }
  };

  return (
    <Sheet>
      {cart.length > 0 && (
        <SheetTrigger asChild>
          <button className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 z-50 flex items-center gap-2">
            <ShoppingCart size={20} />
            Ver Carrinho ({itemCount})
          </button>
        </SheetTrigger>
      )}

      {/* 🛒 Carrinho (sidebar lateral) */}
      <SheetContent className="w-80 sm:w-96">
        <SheetHeader className="bg-blue-100">
          <SheetTitle>Carrinho de Produtos</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2 px-4">
          {cart.length === 0 && (
            <p className="text-gray-500 text-sm">Seu carrinho está vazio.</p>
          )}

          {cart.map((item) => {
            const wholesaleApplies =
              item.minWholesaleQty !== undefined && item.quantity >= item.minWholesaleQty;
            return (
              <div key={item.id} className="border-b pb-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm flex-1 min-w-0 truncate">{item.title}</p>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={13} />
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={13} />
                    </Button>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                    <Trash2 className="text-red-500" size={16} />
                  </Button>
                </div>
                {wholesaleApplies && (
                  <p className="text-xs text-amber-700">
                    ★ Atacado aplicado — {item.wholesaleDiscountPercent}% de desconto
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <SheetFooter className="mt-6 flex flex-col gap-3">
          {cart.length > 0 && (
            <>
              <Button className="w-full cursor-pointer" onClick={sendWhatsApp}>
                Tenho Interesse <WhatsappIcon />
              </Button>

              <Button
                variant="outline"
                className="w-full cursor-pointer gap-2"
                onClick={downloadCoupon}
                disabled={generatingCoupon}
              >
                {generatingCoupon ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ImageDown size={16} />
                )}
                Baixar cupom do pedido (imagem)
              </Button>

              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => clear()}
              >
                Limpar Carrinho
              </Button>

              <SheetClose asChild>
                <Button variant="secondary" className="w-full cursor-pointer">
                  Fechar
                </Button>
              </SheetClose>
            </>
          )}
        </SheetFooter>
      </SheetContent>

      {/* Rendered off-screen, only used as the source for the "Baixar cupom" PNG export. */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden>
        <OrderCouponCanvas ref={couponRef} cart={cart} phone={phone} />
      </div>
    </Sheet>
  );
}
