"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import type { Product } from "@/models/product";

type Props = {
  product: Product;
};

/** Monta o texto do compartilhamento: título, preço (se exibido) e descrição. */
function buildShareText(product: Product): string {
  const parts = [product.title];

  if (product.showPrice && product.price) {
    const price = product.promoPrice ?? product.price;
    parts.push(formatBRL(price));
  }

  if (product.description) parts.push(product.description);

  return parts.join(" — ");
}

/** Baixa a foto de capa do produto e converte pra File, pra ir anexada no compartilhamento nativo. */
async function fetchCoverImageFile(product: Product): Promise<File | null> {
  const cover = product.images[0];
  if (!cover) return null;

  try {
    const response = await fetch(cover.url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const extension = blob.type.split("/")[1] ?? "jpg";
    return new File([blob], `${product.title}.${extension}`, { type: blob.type });
  } catch {
    // Sem internet, CORS bloqueado, etc. — o compartilhamento continua sem a foto anexada.
    return null;
  }
}

/**
 * Botão de compartilhar um produto pelas opções nativas do aparelho (WhatsApp, Instagram, e-mail
 * etc. — o que o sistema do usuário oferecer). Quando o navegador suporta, vai junto a foto de
 * capa do produto como arquivo, além do título, preço/descrição e um link direto pro produto.
 * Sem suporte (a maioria dos navegadores de computador), cai para copiar o link.
 */
export function ShareProductButton({ product }: Props) {
  const handleShare = async () => {
    const url = `${window.location.origin}/portfolio?produto=${product.id}`;
    const text = buildShareText(product);

    if (typeof navigator === "undefined" || !navigator.share) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link do produto copiado!");
      } catch {
        toast.error("Não foi possível copiar o link.");
      }
      return;
    }

    const imageFile = await fetchCoverImageFile(product);
    const shareData: ShareData = { title: product.title, text, url };

    if (imageFile && navigator.canShare?.({ files: [imageFile] })) {
      shareData.files = [imageFile];
    }

    try {
      await navigator.share(shareData);
    } catch (err) {
      // AbortError = o próprio usuário cancelou a caixa de compartilhamento — não é um erro real.
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Não foi possível compartilhar o produto.");
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleShare}
      aria-label="Compartilhar produto"
    >
      <Share2 size={16} />
    </Button>
  );
}
