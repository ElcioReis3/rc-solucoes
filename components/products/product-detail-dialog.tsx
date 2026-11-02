"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatBRL } from "@/lib/utils";
import type { Product } from "@/models/product";
import { ProductCarousel } from "./product-carousel";

type Props = {
  product: Product;
  categoryLabel: string;
  subCategoryLabel: string;
  children: React.ReactNode;
};

export function ProductDetailDialog({ product, categoryLabel, subCategoryLabel, children }: Props) {
  const { add } = useCart();
  const hasPromo = product.showPrice && product.promoPrice && product.price;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5">
          <Badge variant="secondary">{categoryLabel}</Badge>
          <Badge variant="outline">{subCategoryLabel}</Badge>
        </div>

        <ProductCarousel
          images={product.images}
          title={product.title}
          className="w-full h-60 rounded-md border"
        />

        {product.showPrice && product.price && (
          <div className="flex items-baseline gap-2">
            {hasPromo ? (
              <>
                <span className="text-xl font-bold text-primary">
                  {formatBRL(product.promoPrice!)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatBRL(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatBRL(product.price)}</span>
            )}
          </div>
        )}

        {product.showWholesale && product.minWholesaleQty && product.wholesaleDiscountPercent && (
          <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
            <Tag size={15} className="shrink-0" />
            A partir de {product.minWholesaleQty} unidades: {product.wholesaleDiscountPercent}% de
            desconto no atacado.
          </div>
        )}

        <Button
          className="w-full gap-2"
          onClick={() =>
            add({
              id: product.id,
              title: product.title,
              minWholesaleQty: product.showWholesale ? product.minWholesaleQty : undefined,
              wholesaleDiscountPercent: product.showWholesale
                ? product.wholesaleDiscountPercent
                : undefined,
            })
          }
        >
          <ShoppingCart size={16} />
          Adicionar ao carrinho
        </Button>
      </DialogContent>
    </Dialog>
  );
}
