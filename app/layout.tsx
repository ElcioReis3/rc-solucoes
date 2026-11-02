import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "RC Soluções - Produtos e Serviços de Qualidade",
  description: "Produtos de limpeza em geral e expedientes para seu negócio.",
  // Ícone da aba do navegador (app/icon.png) e da tela de início do iPhone (app/apple-icon.png)
  // são detectados automaticamente pelo Next por estarem na pasta app/, sem precisar listar aqui.
  manifest: "/manifest.json",
  appleWebApp: {
    title: "RC Soluções",
  },
  openGraph: {
    title: "RC Soluções - Produtos de Limpeza.",
    description:
      "A RC Soluções é uma empresa especializada na venda e distribuição de produtos de limpeza e material de expediente.",
    url: "https://rc-solucoes-produtos-limpeza.netlify.app",
    type: "website",
    images: [
      {
        url: "https://rc-solucoes-produtos-limpeza.netlify.app/assets/images/logo-tipo-light.png",
        width: 800,
        height: 800,
        alt: "Logo RC Soluções",
      },
    ],
  },
};

// Cor da barra de endereço do navegador/do app instalado na tela de início — mesmo azul da marca.
export const viewport: Viewport = {
  themeColor: "#0250a3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.variable}>
        {" "}
        <CartProvider>{children}</CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
