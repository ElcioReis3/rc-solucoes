"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/models/product";

type Props = {
  images: ProductImage[];
  title: string;
  className?: string;
  /** Carrega a foto com prioridade (sem lazy loading) — reservar só para os primeiros produtos
   *  visíveis sem rolar a página, pra acelerar o carregamento inicial sem pedir tudo de uma vez. */
  priority?: boolean;
};

/** Mostra uma única imagem quando só há uma; com 2–3, roda um carrossel automático com bolinhas.
 *  Cada foto fica sobre uma cópia dela mesma desfocada e com opacidade baixa, em vez de um fundo
 *  liso, e toda a área da foto tem os cantos arredondados. */
export function ProductCarousel({ images, title, className, priority }: Props) {
  const [active, setActive] = useState(0);
  const apiRef = useRef<CarouselApi | null>(null);

  // Autoplay só roda enquanto o mouse está sobre a foto (ou o dedo, no celular) — parado, o
  // carrossel fica na foto atual em vez de várias fotos trocando sozinhas ao mesmo tempo na tela.
  const playAutoplay = () => apiRef.current?.plugins()?.autoplay?.play();
  const stopAutoplay = () => apiRef.current?.plugins()?.autoplay?.stop();

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted flex items-center justify-center",
          className
        )}
      >
        <span className="text-xs text-muted-foreground">Sem foto</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-white", className)}>
        <PhotoLayer src={images[0].url} alt={title} priority={priority} />
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn("relative overflow-hidden rounded-xl bg-white", className)}
        onMouseEnter={playAutoplay}
        onMouseLeave={stopAutoplay}
        onTouchStart={playAutoplay}
        onTouchEnd={stopAutoplay}
        onTouchCancel={stopAutoplay}
      >
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 2000, playOnInit: false, stopOnInteraction: false })]}
          setApi={(api) => {
            if (!api) return;
            apiRef.current = api;
            api.on("select", () => setActive(api.selectedScrollSnap()));
          }}
          className="h-full"
        >
          <CarouselContent className="h-full -ml-0">
            {images.map((img, i) => (
              <CarouselItem key={img.path} className="pl-0 h-full">
                <PhotoLayer
                  src={img.url}
                  alt={`${title} - foto ${i + 1}`}
                  priority={priority && i === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Bolinhas ficam abaixo da foto no fluxo normal, não sobrepostas a ela, com respiro claro entre as duas. */}
      <div className="flex justify-center gap-1.5 pt-2">
        {images.map((img, i) => (
          <span
            key={img.path}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              i === active ? "bg-primary" : "bg-primary/25"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Uma foto, renderizada duas vezes: uma cópia desfocada e com opacidade baixa, cobrindo todo o
 *  box, como fundo (preenchendo o espaço vazio que o object-contain deixaria liso) e a foto nítida por cima. */
function PhotoLayer({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        className="object-cover scale-110 blur-2xl opacity-[45%]"
        sizes="(max-width: 768px) 50vw, 25vw"
        priority={priority}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-3"
        sizes="(max-width: 768px) 50vw, 25vw"
        priority={priority}
      />
    </div>
  );
}
