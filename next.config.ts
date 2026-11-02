import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
    // Deixa o Next reaproveitar a mesma versão otimizada de cada foto por mais tempo (1 dia) em
    // vez do padrão de 1 min — evita reprocessar a imagem toda hora e acelera quando o visitante
    // sai e volta pro catálogo.
    minimumCacheTTL: 60 * 60 * 24,
  },
  experimental: {
    // staleTimes.dynamic=0 faz toda navegação interna (voltar, clicar em link) buscar os dados de
    // novo em vez de reaproveitar uma cópia em cache no navegador — importante pro catálogo
    // sempre refletir produtos excluídos/desativados pelo admin.
    staleTimes: { dynamic: 0 },
  },
};

export default nextConfig;
