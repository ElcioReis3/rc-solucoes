import type { Product } from "@/models/product";
import type { Category, SubCategory } from "@/models/category";
import { ProductCard } from "./product-card";

type Props = {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
};

/** Groups products by category > subcategory, alphabetically by title within each group, and renders a labeled grid per group. */
export function ProductGrid({ products, categories, subCategories }: Props) {
  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-16 text-center">
        Nenhum produto encontrado para esse filtro.
      </p>
    );
  }

  const categoryName = new Map(categories.map((c) => [c.slug, c.name]));
  // Keyed by "categorySlug::subCategorySlug" — the same subcategory slug can exist under
  // more than one category (e.g. "utensilios" under both "limpeza" and "expediente").
  const subCategoryName = new Map(
    subCategories.map((s) => [`${s.categorySlug}::${s.slug}`, s.name])
  );
  const groups = groupProducts(products, categoryName, subCategoryName);

  return (
    <div className="space-y-10">
      {groups.map(([key, label, items]) => (
        <section key={key}>
          <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
            {label}
            <span className="text-xs font-normal text-muted-foreground">
              ({items.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryLabel={categoryName.get(product.category) ?? product.category}
                subCategoryLabel={
                  subCategoryName.get(`${product.category}::${product.subCategory}`) ??
                  product.subCategory
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function groupProducts(
  products: Product[],
  categoryName: Map<string, string>,
  subCategoryName: Map<string, string>
): [string, string, Product[]][] {
  const byGroup = new Map<string, Product[]>();

  for (const product of products) {
    const key = `${product.category}-${product.subCategory}`;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(product);
  }

  const result: [string, string, Product[]][] = [];
  for (const [key, items] of byGroup) {
    // Alphabetical by title (accent-insensitive) rather than insertion order, so newly added
    // products land in their alphabetical spot instead of always trailing at the end.
    items.sort((a, b) => a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" }));
    const [categorySlug, subCategorySlug] = [items[0].category, items[0].subCategory];
    const subLabel = subCategoryName.get(`${categorySlug}::${subCategorySlug}`) ?? subCategorySlug;
    const label = `${subLabel} · ${categoryName.get(categorySlug) ?? categorySlug}`;
    result.push([key, label, items]);
  }
  return result;
}
