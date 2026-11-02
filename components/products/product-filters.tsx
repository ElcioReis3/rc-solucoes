"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Product } from "@/models/product";
import type { Category, SubCategory } from "@/models/category";
import { ProductGrid } from "./product-grid";

type Props = {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
};

export function ProductFilters({ products, categories, subCategories }: Props) {
  const [category, setCategory] = useState<string>("todos");
  const [subCategory, setSubCategory] = useState<string>("todas");
  const [search, setSearch] = useState("");

  const availableSubcategories = useMemo(() => {
    const slugsInUse = new Set(
      products
        .filter((p) => category === "todos" || p.category === category)
        .map((p) => p.subCategory)
    );
    return subCategories.filter((s) => slugsInUse.has(s.slug));
  }, [products, subCategories, category]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "todos" && p.category !== category) return false;
      if (subCategory !== "todas" && p.subCategory !== subCategory) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [products, category, subCategory, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={category === "todos"}
            onClick={() => {
              setCategory("todos");
              setSubCategory("todas");
            }}
          >
            Todas as categorias
          </FilterPill>
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              active={category === c.slug}
              onClick={() => {
                setCategory(c.slug);
                setSubCategory("todas");
              }}
            >
              {c.name}
            </FilterPill>
          ))}
        </div>

        {availableSubcategories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <FilterPill variant="ghost" active={subCategory === "todas"} onClick={() => setSubCategory("todas")}>
              Todas
            </FilterPill>
            {availableSubcategories.map((s) => (
              <FilterPill
                key={s.id}
                variant="ghost"
                active={subCategory === s.slug}
                onClick={() => setSubCategory(s.slug)}
              >
                {s.name}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      <ProductGrid products={filtered} categories={categories} subCategories={subCategories} />
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
  variant = "solid",
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  variant?: "solid" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors border",
        variant === "solid"
          ? active
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground border-border hover:bg-muted"
          : active
            ? "bg-foreground text-background border-foreground"
            : "bg-muted/60 text-muted-foreground border-transparent hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
