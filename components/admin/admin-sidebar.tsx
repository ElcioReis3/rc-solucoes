"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Package, Handshake, Tag, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tag },
  { href: "/admin/partners", label: "Empresas Parceiras", icon: Handshake },
];

/** Lista de navegação em si — usada tanto na barra lateral do desktop quanto dentro do menu
 *  (Sheet) que abre no celular, pra não duplicar o JSX dos links em dois lugares. */
function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  // Fecha o menu sozinho ao navegar pra outra aba — o layout do admin fica montado entre as
  // páginas, então sem isso o menu continuaria aberto depois de trocar de tela no celular.
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    setMobileOpen(false);
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Barra do celular: logo + botão de menu, troca o lugar da fileira de abas com rolagem
          horizontal por um menu hambúrguer. Só aparece abaixo do breakpoint md. */}
      <header className="flex md:hidden items-center justify-between border-b bg-background px-4 py-3">
        <Image src="/assets/images/logo-marca-dark.png" alt="RC Soluções" width={36} height={36} />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Abrir menu">
              <Menu size={18} />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2">
                <Image
                  src="/assets/images/logo-marca-dark.png"
                  alt="RC Soluções"
                  width={32}
                  height={32}
                />
                Painel Admin
              </SheetTitle>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </SheetHeader>

            <nav className="flex flex-col gap-1 p-3 flex-1">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>

            <div className="p-3 border-t">
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Barra lateral do desktop — igual a antes, só visível a partir do breakpoint md. */}
      <aside className="hidden md:flex md:w-64 md:min-h-screen border-r bg-background md:flex-col">
        <div className="p-5 border-b">
          <Image
            src="/assets/images/logo-marca-dark.png"
            alt="RC Soluções"
            width={56}
            height={56}
          />
          <p className="text-xs text-muted-foreground mt-2 truncate">{email}</p>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="p-3 border-t">
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
