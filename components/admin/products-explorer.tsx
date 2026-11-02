"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/app/admin/(dashboard)/products/actions";
import { BuySlotsButton } from "./buy-slots-button";
import type { Product } from "@/models/product";
import type { Category, SubCategory } from "@/models/category";
import type { PlanInfo } from "@/models/plan";

const PAGE_SIZE = 15;

type Status = "todos" | "ativos" | "inativos";

type StoredFilters = {
  search: string;
  category: string;
  subCategory: string;
  status: Status;
  page: number;
};

const FILTERS_STORAGE_KEY = "rc-solucoes-admin-products-filters";

const DEFAULT_FILTERS: StoredFilters = {
  search: "",
  category: "todas",
  subCategory: "todas",
  status: "todos",
  page: 1,
};

/**
 * Remembers the admin's last search/filter/page choices across visits to this screen (e.g. after
 * creating or editing a product and being redirected back), so they don't have to re-pick them
 * every time. Falls back silently to the defaults in SSR or when storage is unavailable/corrupt.
 */
function readStoredFilters(categories: Category[]): StoredFilters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const raw = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<StoredFilters>;
    const category =
      parsed.category && (parsed.category === "todas" || categories.some((c) => c.slug === parsed.category))
        ? parsed.category
        : "todas";
    return {
      search: parsed.search ?? "",
      category,
      subCategory: parsed.subCategory ?? "todas",
      status: parsed.status === "ativos" || parsed.status === "inativos" ? parsed.status : "todos",
      page: parsed.page && parsed.page > 0 ? parsed.page : 1,
    };
  } catch {
    return DEFAULT_FILTERS;
  }
}

type Props = {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  plan: PlanInfo;
};

export function ProductsExplorer({ products, categories, subCategories, plan }: Props) {
  const [initialFilters] = useState(() => readStoredFilters(categories));
  const [search, setSearch] = useState(initialFilters.search);
  const [category, setCategory] = useState(initialFilters.category);
  const [subCategory, setSubCategory] = useState(initialFilters.subCategory);
  const [status, setStatus] = useState<Status>(initialFilters.status);
  const [page, setPage] = useState(initialFilters.page);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        FILTERS_STORAGE_KEY,
        JSON.stringify({ search, category, subCategory, status, page })
      );
    } catch {
      // sessionStorage unavailable (private mode, etc.) — filters just won't persist this time.
    }
  }, [search, category, subCategory, status, page]);

  const categoryName = useMemo(
    () => new Map(categories.map((c) => [c.slug, c.name])),
    [categories]
  );
  // Keyed by "categorySlug::subCategorySlug" — the same subcategory slug can exist under
  // more than one category (e.g. "utensilios" under both "limpeza" and "expediente").
  const subCategoryName = useMemo(
    () => new Map(subCategories.map((s) => [`${s.categorySlug}::${s.slug}`, s.name])),
    [subCategories]
  );
  const visibleSubCategories = subCategories.filter((s) => s.categorySlug === category);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "todas" && p.category !== category) return false;
      if (subCategory !== "todas" && p.subCategory !== subCategory) return false;
      if (status === "ativos" && !p.active) return false;
      if (status === "inativos" && p.active) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [products, search, category, subCategory, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const usagePct = Math.min(100, Math.round((plan.productCount / plan.productLimit) * 100));
  const nearLimit = usagePct >= 80;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-background p-4 space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium">
              {plan.productCount} de {plan.productLimit} produtos cadastrados
            </p>
            <div className="h-1.5 w-48 bg-muted rounded-full overflow-hidden mt-1.5">
              <div
                className={nearLimit ? "h-full bg-amber-500" : "h-full bg-primary"}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
          {nearLimit && <BuySlotsButton slotPackSize={plan.slotPackSize} />}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>

        <Select
          className="w-44"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("todas");
            setPage(1);
          }}
        >
          <option value="todas">Todas categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          className="w-44"
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setPage(1);
          }}
          disabled={category === "todas"}
        >
          <option value="todas">Todas subcategorias</option>
          {visibleSubCategories.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </Select>

        <Select
          className="w-36"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            setPage(1);
          }}
        >
          <option value="todos">Todos status</option>
          <option value="ativos">Ativos</option>
          <option value="inativos">Inativos</option>
        </Select>
      </div>

      <ProductsTableBody
        products={pageItems}
        categoryName={categoryName}
        subCategoryName={subCategoryName}
        total={filtered.length}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={15} />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsTableBody({
  products,
  categoryName,
  subCategoryName,
  total,
}: {
  products: Product[];
  categoryName: Map<string, string>;
  subCategoryName: Map<string, string>;
  total: number;
}) {
  const [pending, startTransition] = useTransition();

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground py-10 text-center">
        Nenhum produto encontrado para esse filtro.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Foto</th>
            <th className="p-3">Produto</th>
            <th className="p-3">Categoria</th>
            <th className="p-3">Ativo</th>
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              </td>
              <td className="p-3 font-medium max-w-xs">
                <p className="line-clamp-1">{product.title}</p>
                <span className="text-xs text-muted-foreground">
                  {product.images.length} foto(s)
                </span>
              </td>
              <td className="p-3">
                <Badge variant="outline">
                  {categoryName.get(product.category) ?? product.category}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {subCategoryName.get(`${product.category}::${product.subCategory}`) ??
                    product.subCategory}
                </div>
              </td>
              <td className="p-3">
                <Switch
                  checked={product.active}
                  disabled={pending}
                  onCheckedChange={(checked) =>
                    startTransition(() => toggleProductActiveAction(product.id, checked))
                  }
                />
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon-sm" asChild>
                    <Link href={`/admin/products/${product.id}`} aria-label="Editar">
                      <Pencil size={14} />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon-sm" aria-label="Excluir">
                        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir &quot;{product.title}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação remove o produto e todas as suas fotos permanentemente. Não é possível desfazer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => startTransition(() => deleteProductAction(product.id))}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
