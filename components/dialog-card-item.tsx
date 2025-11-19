"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/data/product";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";

type DialogCardItemProps = {
  item: Product;
  children?: React.ReactNode;
};

export const DialogCardItem = ({ item, children }: DialogCardItemProps) => {
  const { add } = useCart();

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>
        <div className="w-full h-60 relative">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-contain mt-4"
          />
        </div>
        <Button
          className="w-full bg-blue-600 text-white py-1 mt-2 rounded hover:bg-blue-700"
          onClick={() => add(item)}
        >
          + Carrinho
        </Button>
      </DialogContent>
    </Dialog>
  );
};
