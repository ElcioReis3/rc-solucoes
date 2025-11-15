"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/data/product";
import { DialogCardItem } from "./dialog-card-item";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const handlePhone = () => {
    window.open("https://wa.me/5586998012172", "_blank");
  };

  return (
    <Card className="w-full max-h-80 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-evenly">
      <DialogCardItem item={product}>
        <CardHeader className="py-0 my-0 relative">
          <div className="overflow-hidden relative w-20 h-20 mx-auto">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={200}
                height={200}
                className="object-cover"
              />
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2">
            {product.title}
          </CardTitle>
        </CardHeader>
      </DialogCardItem>

      <CardContent className="py-0">
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
};
