"use client";
import { useWhats } from "@/hooks/useWhats";
import { WhatsappIcon } from "../WhatsappIcon";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  const numeroWhats = useWhats();

  return (
    <section
      id="initial"
      className="relative bg-gradient-to-br from-blue-950 via-primary to-blue-800 text-white py-20 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Soluções em material de limpeza e expediente para sua empresa
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-50">
            Produtos de alta qualidade, entregas ágeis e um atendimento
            especializado que entende as necessidades do seu negócio.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${numeroWhats}`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              <WhatsappIcon width={24} height={24} className="text-green-600" />
              Entre em Contato Conosco
            </a>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-3 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition backdrop-blur"
            >
              <ShoppingCart size={22} />
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
