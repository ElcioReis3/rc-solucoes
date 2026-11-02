"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatBRL } from "@/lib/utils";
import type { Product } from "@/models/product";
import { ProductCarousel } from "./product-carousel";
import { ProductDetailDialog } from "./product-detail-dialog";

type Props = {
  product: Product;
  categoryLabel: string;
  subCategoryLabel: string;
};

export function ProductCard({
  product,
  categoryLabel,
  subCategoryLabel,
}: Props) {
  const { add } = useCart();
  const hasPromo = product.showPrice && product.promoPrice && product.price;

  return (
    <Card className="w-full overflow-hidden pt-0 gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <ProductDetailDialog
        product={product}
        categoryLabel={categoryLabel}
        subCategoryLabel={subCategoryLabel}
      >
        <button
          type="button"
          className="block w-full text-left cursor-pointer group"
        >
          <ProductCarousel
            images={product.images}
            title={product.title}
            className="w-full h-36 sm:h-40"
          />
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem] px-3 pt-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.showPrice && product.price && (
            <p className="px-3 pt-1 flex items-baseline gap-1.5">
              {hasPromo ? (
                <>
                  <span className="text-sm font-bold text-primary">
                    {formatBRL(product.promoPrice!)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatBRL(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-primary">
                  {formatBRL(product.price)}
                </span>
              )}
            </p>
          )}
        </button>
      </ProductDetailDialog>

      <CardContent className="px-3 pb-3">
        <Button
          size="sm"
          className="w-full gap-1.5 hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() =>
            add({
              id: product.id,
              title: product.title,
              minWholesaleQty: product.showWholesale
                ? product.minWholesaleQty
                : undefined,
              wholesaleDiscountPercent: product.showWholesale
                ? product.wholesaleDiscountPercent
                : undefined,
            })
          }
        >
          <ShoppingCart size={15} />
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}
