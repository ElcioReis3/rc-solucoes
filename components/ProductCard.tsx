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

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  // const formattedPrice = new Intl.NumberFormat("pt-BR", {
  //   style: "currency",
  //   currency: "BRL",
  // }).format(product.price);

  return (
    <Card className=" sm:w-full hover:shadow-lg transition-shadow duration-300 ">
      <div className="relative h-28 sm:h-40 w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>

      <CardHeader className="">
        <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-sm text-gray-600 ">{product.description}</p>
      </CardContent>

      <CardFooter className="flex justify-center py-0">
        <Button className="w-full">Tenho Interesse</Button>
      </CardFooter>
    </Card>
  );
};
