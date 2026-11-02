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

function parsePartnerForm(formData: FormData) {
  const parsed = partnerFormSchema.safeParse({
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl") || "",
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    throw new Error(message);
  }

  return { ...parsed.data, websiteUrl: parsed.data.websiteUrl || undefined };
}

function getFile(formData: FormData, field: string): File | undefined {
  const entry = formData.get(field);
  return entry instanceof File && entry.size > 0 ? entry : undefined;
}

export async function createPartnerAction(formData: FormData) {
  await requireAdmin();
  const input = parsePartnerForm(formData);
  const logo = getFile(formData, "logo");
  const banner = getFile(formData, "banner");

  if (!logo || !banner) {
    throw new Error("Envie a logo e o banner da empresa.");
  }

  await createPartner(input, logo, banner);
  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function updatePartnerAction(id: string, formData: FormData) {
  await requireAdmin();
  const input = parsePartnerForm(formData);
  const logo = getFile(formData, "logo");
  const banner = getFile(formData, "banner");

  await updatePartner(id, input, logo, banner);
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
