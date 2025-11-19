"use client";
import { createContext, useContext, useState } from "react";
import { Product } from "@/data/product";
import { toast } from "sonner";

type CartContextType = {
  cart: Product[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const sync = (items: Product[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCart(items);
  };

  const add = (product: Product) => {
    const exists = cart.some((item) => item.id === product.id);

    if (exists) {
      toast.warning("Este item já está no carrinho!");
      return;
    }
    const updated = [...cart, product];
    sync(updated);
  };

  const remove = (id: string) => {
    const updated = cart.filter((p) => p.id !== id);
    sync(updated);
  };

  const clear = () => sync([]);

  return (
    <CartContext.Provider value={{ cart, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
