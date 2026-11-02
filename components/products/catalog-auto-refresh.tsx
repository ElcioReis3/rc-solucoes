"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 60_000;

/**
 * Busca os dados do catálogo de novo a cada 20s em segundo plano, sem mostrar nada na tela.
 * Assim, se o admin excluir ou desativar um produto, ele some do catálogo para quem já está com
 * a página aberta em até ~20s, sem precisar recarregar a página manualmente.
 */
export function CatalogAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
