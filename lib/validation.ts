import { z } from "zod";

// Shared by price/promoPrice/wholesale-discount inputs: accepts "", undefined or a positive number.
const optionalPositiveNumber = z
  .union([z.coerce.number().positive(), z.literal(""), z.undefined()])
  .transform((v) => (v === "" || v === undefined ? undefined : v));

const optionalPositiveInt = z
  .union([z.coerce.number().int().positive(), z.literal(""), z.undefined()])
  .transform((v) => (v === "" || v === undefined ? undefined : v));

export const productFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "O título precisa ter pelo menos 3 caracteres.")
      .max(120, "O título é muito longo."),
    description: z
      .string()
      .trim()
      .min(10, "A descrição precisa ter pelo menos 10 caracteres.")
      .max(2000, "A descrição é muito longa."),
    // Categories/subcategories are managed dynamically (services/categories.service.ts),
    // so we just validate "something was selected" here; existence is checked in the action.
    category: z.string().trim().min(1, "Selecione uma categoria."),
    subCategory: z.string().trim().min(1, "Selecione uma subcategoria."),
    active: z.boolean(),

    // All optional — the admin decides whether to show price/wholesale info to customers.
    showPrice: z.boolean(),
    price: optionalPositiveNumber,
    promoPrice: optionalPositiveNumber,
    showWholesale: z.boolean(),
    minWholesaleQty: optionalPositiveInt,
    wholesaleDiscountPercent: z
      .union([z.coerce.number().min(1).max(90), z.literal(""), z.undefined()])
      .transform((v) => (v === "" || v === undefined ? undefined : v)),
  })
  .refine((data) => !data.showPrice || data.price !== undefined, {
    message: "Informe o preço ou desative a exibição de preço.",
    path: ["price"],
  })
  .refine((data) => !data.promoPrice || !data.price || data.promoPrice < data.price, {
    message: "O preço promocional deve ser menor que o preço normal.",
    path: ["promoPrice"],
  })
  .refine((data) => !data.showWholesale || data.minWholesaleQty !== undefined, {
    message: "Informe a quantidade mínima para atacado ou desative essa opção.",
    path: ["minWholesaleQty"],
  })
  .refine((data) => !data.showWholesale || data.wholesaleDiscountPercent !== undefined, {
    message: "Informe o desconto de atacado ou desative essa opção.",
    path: ["wholesaleDiscountPercent"],
  });

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome precisa ter pelo menos 2 caracteres.")
    .max(60, "O nome é muito longo."),
  active: z.boolean(),
});

export const subCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome precisa ter pelo menos 2 caracteres.")
    .max(60, "O nome é muito longo."),
  categorySlug: z.string().trim().min(1, "Selecione a categoria."),
  active: z.boolean(),
});

export const partnerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome precisa ter pelo menos 2 caracteres.")
    .max(120, "O nome é muito longo."),
  websiteUrl: z
    .string()
    .trim()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),
  active: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
