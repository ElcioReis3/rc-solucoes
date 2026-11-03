"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/services/auth.service";
import {
  createPartner,
  updatePartner,
  deletePartner,
  setPartnerActive,
} from "@/services/partners.service";
import { partnerFormSchema } from "@/lib/validation";
import type { PartnerFormInput } from "@/models/partner";

/**
 * Devolve { error } em vez de lançar throw quando a validação falha — o Next apaga a mensagem de
 * qualquer erro lançado (throw) dentro de uma Server Action em produção, deixando só um
 * "An error occurred..." genérico pro admin. Devolvendo o erro como valor normal, a mensagem
 * certa chega até a tela.
 */
export type ActionResult = { error: string } | undefined;

function parsePartnerForm(formData: FormData): { data: PartnerFormInput } | { error: string } {
  const parsed = partnerFormSchema.safeParse({
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl") || "",
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  return { data: { ...parsed.data, websiteUrl: parsed.data.websiteUrl || undefined } };
}

function getFile(formData: FormData, field: string): File | undefined {
  const entry = formData.get(field);
  return entry instanceof File && entry.size > 0 ? entry : undefined;
}

export async function createPartnerAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parsePartnerForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const logo = getFile(formData, "logo");
  const banner = getFile(formData, "banner");

  if (!logo || !banner) {
    return { error: "Envie a logo e o banner da empresa." };
  }

  await createPartner(parsed.data, logo, banner);
  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function updatePartnerAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parsePartnerForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const logo = getFile(formData, "logo");
  const banner = getFile(formData, "banner");

  await updatePartner(id, parsed.data, logo, banner);
  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}`);
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function deletePartnerAction(id: string) {
  await requireAdmin();
  await deletePartner(id);
  revalidatePath("/admin/partners");
  revalidatePath("/");
}

export async function togglePartnerActiveAction(id: string, active: boolean) {
  await requireAdmin();
  await setPartnerActive(id, active);
  revalidatePath("/admin/partners");
  revalidatePath("/");
}
