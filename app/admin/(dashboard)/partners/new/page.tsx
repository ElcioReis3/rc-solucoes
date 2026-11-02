import { PartnerForm } from "@/components/admin/partner-form";
import { createPartnerAction } from "../actions";

export const metadata = { title: "Nova Empresa Parceira - Painel Admin" };

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nova empresa parceira</h1>
        <p className="text-sm text-muted-foreground">
          Envie a logo e o banner que aparecerão na landing page.
        </p>
      </div>
      <PartnerForm action={createPartnerAction} />
    </div>
  );
}
