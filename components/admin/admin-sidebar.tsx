"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Package, Handshake, Tag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tag },
  { href: "/admin/partners", label: "Empresas Parceiras", icon: Handshake },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r bg-background flex md:flex-col">
      <div className="p-5 border-b hidden md:block">
        <Image
          src="/assets/images/logo-marca-dark.png"
          alt="RC Soluções"
          width={56}
          height={56}
        />
        <p className="text-xs text-muted-foreground mt-2 truncate">{email}</p>
      </div>

      <nav className="flex md:flex-col gap-1 p-2 md:p-3 flex-1 overflow-x-auto">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
      </nav>

      <div className="p-3 md:border-t">
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
          <LogOut size={16} />
          Sair
        </Button>
      </div>
    </aside>
  );
}
