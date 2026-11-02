"use client";

import { useTransition } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  moveProductImageAction,
  removeProductImageAction,
} from "@/app/admin/(dashboard)/products/actions";
import type { ProductImage } from "@/models/product";

type Props = {
  productId: string;
  images: ProductImage[];
};

export function ProductImageManager({ productId, images }: Props) {
  const [pending, startTransition] = useTransition();

  if (images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este produto ainda não tem fotos cadastradas.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Fotos atuais (ordem = sequência do carrossel)</Label>
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div
            key={img.path}
            className="relative w-28 rounded-lg border bg-muted/40 p-2 space-y-2"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-md bg-white">
              <Image src={img.url} alt={`Foto ${index + 1}`} fill className="object-contain" />
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                  Capa
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={index === 0 || pending}
                onClick={() =>
                  startTransition(() => moveProductImageAction(productId, img.path, "up"))
                }
                aria-label="Mover para a esquerda"
              >
                <ArrowLeft size={14} />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    disabled={pending}
                    aria-label="Remover foto"
                  >
                    {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover esta foto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      A foto será apagada permanentemente do produto. Não é possível desfazer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        startTransition(() => removeProductImageAction(productId, img.path))
                      }
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={index === images.length - 1 || pending}
                onClick={() =>
                  startTransition(() => moveProductImageAction(productId, img.path, "down"))
                }
                aria-label="Mover para a direita"
              >
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
