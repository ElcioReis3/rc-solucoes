/**
 * Domain model for a partner company ("Empresa Parceira") shown on the
 * landing page, managed through the admin panel.
 */

export type PartnerCompany = {
  id: string;
  name: string;
  logoUrl: string;
  logoPath: string;
  bannerUrl: string;
  bannerPath: string;
  websiteUrl?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerFormInput = {
  name: string;
  websiteUrl?: string;
  active: boolean;
};
