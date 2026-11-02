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
    serverActions: {
      // O padrão do Next é só 1MB por requisição de Server Action — baixo demais pra formulários
      // que enviam foto (produto, empresa parceira). A Netlify também tem um teto próprio de ~6MB
      // por requisição nas Functions, então não adianta subir além disso — ficamos no máximo que
      // a hospedagem realmente aceita.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
