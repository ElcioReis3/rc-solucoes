"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MAX_PRODUCT_IMAGES, type Product } from "@/models/product";
import type { Category, SubCategory } from "@/models/category";
import { ProductImageManager } from "./product-image-manager";
import { CroppedImageInput } from "./cropped-image-input";

type Props = {
  product?: Product;
  categories: Category[];
  subCategories: SubCategory[];
  // A action devolve { error } em vez de lançar throw quando a validação falha — ver o comentário
  // em app/admin/(dashboard)/products/actions.ts sobre por que o Next apaga mensagens de throw.
  action: (formData: FormData) => Promise<{ error: string } | void>;
};

/** True when the thrown value is Next.js's internal redirect control-flow signal. */
function isRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function ProductForm({ product, categories, subCategories, action }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState(product?.category ?? "");
  const [showPrice, setShowPrice] = useState(product?.showPrice ?? false);
  const [showWholesale, setShowWholesale] = useState(product?.showWholesale ?? false);
  // Bumped after a successful save so <CroppedImageInput> remounts clean — its staged/pending
  // thumbnails are now actually uploaded and showing in <ProductImageManager> instead.
  const [imagesInputKey, setImagesInputKey] = useState(0);
  const existingSlots = product?.images.length ?? 0;
  const remainingSlots = MAX_PRODUCT_IMAGES - existingSlots;

  const visibleSubCategories = subCategories.filter((s) => s.categorySlug === category);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        // Só chega aqui quando criar produto não se aplica (esse caminho sempre redireciona e
        // lança NEXT_REDIRECT, pego abaixo) — ou seja, isso é um salvamento de edição bem-sucedido
        // que deliberadamente fica nessa mesma tela. Atualiza os dados do servidor no lugar pra as
        // fotos recém-enviadas (com reordenar/remover funcionando) aparecerem na hora, sem trocar de página.
        if (product) {
          toast.success("Alterações salvas.");
          setImagesInputKey((k) => k + 1);
          router.refresh();
        }
      } catch (err) {
        if (isRedirectError(err)) throw err;
        setError(err instanceof Error ? err.message : "Erro ao salvar produto.");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Button variant="outline" size="sm" asChild className="gap-1.5 -mt-2">
        <Link href="/admin/products">
          <ArrowLeft size={15} />
          Voltar
        </Link>
      </Button>

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required defaultValue={product?.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            id="category"
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Selecione
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
          {categories.length === 0 && (
            <p className="text-xs text-destructive">
              Nenhuma categoria cadastrada ainda —{" "}
              <Link href="/admin/categories" className="underline">
                crie uma primeiro
              </Link>
              .
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subCategory">Subcategoria</Label>
          <Select
            id="subCategory"
            name="subCategory"
            required
            defaultValue={product?.subCategory}
            disabled={!category}
          >
            <option value="" disabled>
              {category ? "Selecione" : "Escolha a categoria primeiro"}
            </option>
            {visibleSubCategories.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="active" name="active" defaultChecked={product?.active ?? true} />
        <Label htmlFor="active">Produto visível no site</Label>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <Switch id="showPrice" name="showPrice" checked={showPrice} onCheckedChange={setShowPrice} />
          <Label htmlFor="showPrice">Mostrar preço para os clientes</Label>
        </div>

        {showPrice && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required={showPrice}
                defaultValue={product?.price}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promoPrice">Preço promocional (R$, opcional)</Label>
              <Input
                id="promoPrice"
                name="promoPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.promoPrice}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <Switch
            id="showWholesale"
            name="showWholesale"
            checked={showWholesale}
            onCheckedChange={setShowWholesale}
          />
          <Label htmlFor="showWholesale">Vende no atacado</Label>
        </div>

        {showWholesale && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWholesaleQty">Quantidade mínima</Label>
              <Input
                id="minWholesaleQty"
                name="minWholesaleQty"
                type="number"
                step="1"
                min="1"
                required={showWholesale}
                defaultValue={product?.minWholesaleQty}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wholesaleDiscountPercent">Desconto no atacado (%)</Label>
              <Input
                id="wholesaleDiscountPercent"
                name="wholesaleDiscountPercent"
                type="number"
                step="1"
                min="1"
                max="90"
                required={showWholesale}
                defaultValue={product?.wholesaleDiscountPercent}
              />
            </div>
          </div>
        )}
      </div>

      {product && (
        <ProductImageManager productId={product.id} images={product.images} />
      )}

      <CroppedImageInput
        key={imagesInputKey}
        name="images"
        label={
          product
            ? `Adicionar fotos (restam ${remainingSlots} de ${MAX_PRODUCT_IMAGES})`
            : `Fotos do produto (até ${MAX_PRODUCT_IMAGES})`
        }
        hint="JPG, PNG ou WebP, até 5MB cada. A primeira foto é a capa; a ordem define o carrossel."
        aspect={1}
        maxFiles={remainingSlots}
        disabled={product ? remainingSlots <= 0 : false}
      />

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="gap-2">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {product ? "Salvar alterações" : "Criar produto"}
      </Button>
    </form>
  );
}
