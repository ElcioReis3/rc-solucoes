import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "RC Soluções - Produtos e Serviços de Qualidade",
  description: "Produtos de limpeza em geral e expedientes para seu negócio.",
  openGraph: {
    title: "RC Soluções - Produtos de Limpeza.",
    description:
      "A RC Soluções é uma empresa especializada na venda e distribuição de produtos de limpeza e material de expediente para empresas de todos os portes.",
    url: "https://rc-solucoes-produtos-limpeza.netlify.app/_next/image?url=%2Fassets%2Fimages%2Flogo-marca-dark.png&w=96&q=75",
    type: "website",
    images: [
      {
        url: "https://rc-solucoes-produtos-limpeza.netlify.app/_next/image?url=%2Fassets%2Fimages%2Flogo-marca-dark.png&w=96&q=75",
        width: 256,
        height: 256,
        alt: "Logomarca",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
