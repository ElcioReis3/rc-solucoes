import { notFound } from "next/navigation";
import { PartnerForm } from "@/components/admin/partner-form";
import { getPartner } from "@/services/partners.service";
import { updatePartnerAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar Empresa Parceira - Painel Admin" };

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartner(id);
  if (!partner) notFound();

  const boundAction = updatePartnerAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar empresa parceira</h1>
        <p className="text-sm text-muted-foreground">{partner.name}</p>
      </div>
      <PartnerForm partner={partner} action={boundAction} />
    </div>
  );
}
