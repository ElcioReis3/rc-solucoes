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

type DialogCardItemProps = {
  item: Product;
  children?: React.ReactNode;
};

export const DialogCardItem = ({ item, children }: DialogCardItemProps) => {
  const handlePhone = () => {
    window.open("https://wa.me/5586998012172", "_blank");
  };

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
        <Button className="w-full cursor-pointer" onClick={handlePhone}>
          Tenho Interesse
        </Button>
      </DialogContent>
    </Dialog>
  );
};
