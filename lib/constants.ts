export const WHATSAPP_NUMBERS = ["5586998143790"] as const;

/**
 * Lives here (not in services/auth.service.ts) because middleware.ts runs on
 * the Edge runtime and must not import anything that pulls in firebase-admin.
 */
export const SESSION_COOKIE_NAME = "__session";

export const NAV_LINKS = [
  { href: "#initial", label: "Home" },
  { href: "#about", label: "Quem Somos" },
  { href: "/portfolio", label: "Catálogo" },
  { href: "#partners", label: "Parceiros" },
  { href: "#advantages", label: "Vantagens" },
  { href: "#contact", label: "Contato" },
] as const;

export const COMPANY = {
  name: "RC Soluções",
  address:
    "Rua Engenheiro Ronald Carvalho - 610 CS2B / Morada do Sol | 64056-220 Teresina - PI",
  whatsapps: ["5586998143790", "5586998012172", "5586998519292"],
};
