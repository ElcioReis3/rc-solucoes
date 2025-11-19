"use client";

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
import { Trash2, ShoppingCart } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";
import { useWhats } from "@/hooks/useWhats";

export function CartSheet() {
  const { cart, remove, clear } = useCart();

  const phone = useWhats();
  const buildMessage = () => {
    let msg = "Olá, gostaria de solicitar os seguintes produtos:%0A%0A";
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.title}%0A`;
    });
    return msg;
  };

  const sendWhatsApp = () => {
    const url = `https://wa.me/${phone}?text=${buildMessage()}`;
    window.open(url, "_blank");
  };

  return (
    <Sheet>
      {cart.length > 0 && (
        <SheetTrigger asChild>
          <button className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 z-50 flex items-center gap-2">
            <ShoppingCart size={20} />
            Ver Carrinho ({cart.length})
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

          {cart.map((item) => (
            <div
              key={item.id}
              className="border-b pb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.title}</p>
              </div>

              <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                <Trash2 className="text-red-500" size={16} />
              </Button>
            </div>
          ))}
        </div>

        <SheetFooter className="mt-6 flex flex-col gap-3">
          {cart.length > 0 && (
            <>
              <Button className="w-full cursor-pointer" onClick={sendWhatsApp}>
                Tenho Interesse <WhatsappIcon />
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
    </Sheet>
  );
}
