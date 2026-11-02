"use client";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

/**
 * Minimal shape kept in the cart/localStorage — just enough to build the WhatsApp message and
 * the order-coupon image. `minWholesaleQty`/`wholesaleDiscountPercent` are only present when the
 * admin enabled wholesale pricing for that product; used to flag "atacado aplicado" once the
 * chosen quantity reaches the threshold.
 */
export type CartItem = {
  id: string;
  title: string;
  quantity: number;
  minWholesaleQty?: number;
  wholesaleDiscountPercent?: number;
};

type AddInput = {
  id: string;
  title: string;
  minWholesaleQty?: number;
  wholesaleDiscountPercent?: number;
};

type CartContextType = {
  cart: CartItem[];
  add: (item: AddInput) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

/** Reads whatever was saved before (possibly without `quantity`, from an older version of the cart). */
function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as Partial<CartItem>[];
    return parsed.map((item) => ({
      id: item.id ?? "",
      title: item.title ?? "",
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      minWholesaleQty: item.minWholesaleQty,
      wholesaleDiscountPercent: item.wholesaleDiscountPercent,
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);

  const sync = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCart(items);
  };

  const add = (item: AddInput) => {
    const existing = cart.find((p) => p.id === item.id);

    if (existing) {
      sync(
        cart.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p))
      );
      toast.success("Quantidade atualizada no carrinho!");
      return;
    }

    sync([...cart, { ...item, quantity: 1 }]);
    toast.success("Produto adicionado ao carrinho!");
  };

  const remove = (id: string) => {
    sync(cart.filter((p) => p.id !== id));
  };

  /** Clamped to >= 1; use `remove` to take an item out entirely. */
  const setQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      remove(id);
      return;
    }
    sync(cart.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const clear = () => sync([]);

  return (
    <CartContext.Provider value={{ cart, add, remove, setQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
