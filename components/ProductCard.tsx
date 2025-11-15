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
import { HoverCardItem } from "./hover-card";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const handlePhone = () => {
    window.open("https://wa.me/5586998012172", "_blank");
  };

  return (
    <Card className="w-full max-h-80 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-evenly">
      <CardHeader className="py-0 my-0">
        <div className="overflow-hidden relative w-20 h-20 mx-auto">
          <HoverCardItem
            item={
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover rounded-md p-2"
              />
            }
          >
            {
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover "
              />
            }
          </HoverCardItem>
        </div>
        <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex justify-center py-0">
        <Button className="w-full cursor-pointer" onClick={handlePhone}>
          Tenho Interesse
        </Button>
      </CardFooter>
    </Card>
  );
};
