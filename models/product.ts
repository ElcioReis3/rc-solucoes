/**
 * Domain model for a product. This is the single source of truth for the
 * shape of a product everywhere in the app (admin forms, public catalog,
 * Firestore documents).
 *
 * `category` and `subCategory` are slugs referencing the admin-managed
 * collections in models/category.ts (not hardcoded enums anymore) — see
 * services/categories.service.ts.
 */

/** One uploaded product photo. `path` is the Storage object path, used to delete the file later. */
export type ProductImage = {
  url: string;
  path: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  /** Up to 3 images, in display/carousel order. */
  images: ProductImage[];
  /** Category slug (models/category.ts). */
  category: string;
  /** Subcategory slug (models/category.ts). */
  subCategory: string;
  /** Controls manual ordering inside a subcategory grid. */
  order: number;
  active: boolean;

  /**
   * Pricing and wholesale fields are all optional — the admin decides, per product, whether
   * customers see a price at all. `price`/`promoPrice` only render when `showPrice` is true;
   * `minWholesaleQty`/`wholesaleDiscountPercent` only render when `showWholesale` is true.
   */
  showPrice: boolean;
  price?: number;
  promoPrice?: number;
  showWholesale: boolean;
  minWholesaleQty?: number;
  wholesaleDiscountPercent?: number;

  createdAt: string;
  updatedAt: string;
};

export const MAX_PRODUCT_IMAGES = 3;

/** Shape submitted by the admin product form before images are uploaded. */
export type ProductFormInput = {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  active: boolean;
  showPrice: boolean;
  price?: number;
  promoPrice?: number;
  showWholesale: boolean;
  minWholesaleQty?: number;
  wholesaleDiscountPercent?: number;
};
