import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnersTable } from "@/components/admin/partners-table";
import { listAllPartners } from "@/services/partners.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Empresas Parceiras - Painel Admin" };

export default async function AdminPartnersPage() {
  const partners = await listAllPartners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Empresas Parceiras</h1>
          <p className="text-sm text-muted-foreground">
            Exibidas na landing page, com logo e banner.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/partners/new">
            <Plus size={18} />
            Nova empresa
          </Link>
        </Button>
      </div>

      <PartnersTable partners={partners} />
    </div>
  );
}
