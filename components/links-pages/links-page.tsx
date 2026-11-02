import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

type Props = {
  position: "flex-row" | "flex-col";
  /** Hides the "Parceiros" link when there are no partner companies to show. Defaults to true. */
  hasPartners?: boolean;
};

export const LinksPage = ({ position, hasPartners = true }: Props) => {
  const links = hasPartners ? NAV_LINKS : NAV_LINKS.filter((link) => link.href !== "#partners");

  return (
    <nav
      className={cn(
        "gap-x-8 gap-y-2",
        position === "flex-col" ? "flex flex-col" : "hidden md:flex"
      )}
    >
      {links.map((link) => (
        <a key={link.href} href={link.href} className="font-bold transition hover:text-blue-400">
          {link.label}
        </a>
      ))}
    </nav>
  );
};
