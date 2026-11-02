import "server-only";
import { getAdminFirestore } from "./firebase/admin";
import { deleteImage, uploadImage } from "./storage.service";
import type { PartnerCompany, PartnerFormInput } from "@/models/partner";

const COLLECTION = "partners";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPartner(id: string, data: any): PartnerCompany {
  return {
    id,
    name: data.name,
    logoUrl: data.logoUrl,
    logoPath: data.logoPath,
    bannerUrl: data.bannerUrl,
    bannerPath: data.bannerPath,
    websiteUrl: data.websiteUrl ?? undefined,
    order: data.order ?? 0,
    active: data.active ?? true,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? "",
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? "",
  };
}

export async function listActivePartners(): Promise<PartnerCompany[]> {
  const snap = await getAdminFirestore()
    .collection(COLLECTION)
    .where("active", "==", true)
    .get();
  return snap.docs
    .map((doc) => toPartner(doc.id, doc.data()))
    .sort((a, b) => a.order - b.order);
}

export async function listAllPartners(): Promise<PartnerCompany[]> {
  const snap = await getAdminFirestore().collection(COLLECTION).get();
  return snap.docs
    .map((doc) => toPartner(doc.id, doc.data()))
    .sort((a, b) => a.order - b.order);
}

export async function getPartner(id: string): Promise<PartnerCompany | null> {
  const doc = await getAdminFirestore().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return toPartner(doc.id, doc.data());
}

export async function createPartner(
  input: PartnerFormInput,
  logo: File,
  banner: File
): Promise<string> {
  const db = getAdminFirestore();
  const docRef = db.collection(COLLECTION).doc();

  const [logoUpload, bannerUpload] = await Promise.all([
    uploadImage(logo, `partners/${docRef.id}`),
    uploadImage(banner, `partners/${docRef.id}`),
  ]);

  const countSnap = await db.collection(COLLECTION).count().get();

  await docRef.set({
    ...input,
    logoUrl: logoUpload.url,
    logoPath: logoUpload.path,
    bannerUrl: bannerUpload.url,
    bannerPath: bannerUpload.path,
    order: countSnap.data().count,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

export async function updatePartner(
  id: string,
  input: PartnerFormInput,
  logo?: File,
  banner?: File
): Promise<void> {
  const existing = await getPartner(id);
  if (!existing) throw new Error("Empresa parceira não encontrada.");

  const update: Record<string, unknown> = { ...input, updatedAt: new Date() };

  if (logo && logo.size > 0) {
    const upload = await uploadImage(logo, `partners/${id}`);
    await deleteImage(existing.logoPath);
    update.logoUrl = upload.url;
    update.logoPath = upload.path;
  }

  if (banner && banner.size > 0) {
    const upload = await uploadImage(banner, `partners/${id}`);
    await deleteImage(existing.bannerPath);
    update.bannerUrl = upload.url;
    update.bannerPath = upload.path;
  }

  await getAdminFirestore().collection(COLLECTION).doc(id).update(update);
}

export async function setPartnerActive(id: string, active: boolean): Promise<void> {
  await getAdminFirestore()
    .collection(COLLECTION)
    .doc(id)
    .update({ active, updatedAt: new Date() });
}

export async function deletePartner(id: string): Promise<void> {
  const existing = await getPartner(id);
  if (!existing) return;

  await Promise.all([deleteImage(existing.logoPath), deleteImage(existing.bannerPath)]);
  await getAdminFirestore().collection(COLLECTION).doc(id).delete();
}
