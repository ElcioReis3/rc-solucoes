"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LinksPage } from "../links-pages/links-page";
import { NAV_LINKS } from "@/lib/constants";

type Props = {
  /** Hides the "Parceiros" nav link when there are no partner companies to show. Defaults to true. */
  hasPartners?: boolean;
};

export const Header = ({ hasPartners = true }: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = hasPartners ? NAV_LINKS : NAV_LINKS.filter((link) => link.href !== "#partners");

  return (
    <header className="bg-blue-950/95 backdrop-blur supports-[backdrop-filter]:bg-blue-950/90 text-secondary sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a href="#initial" className="flex items-center">
            <Image
              width={64}
              height={64}
              src="/assets/images/logo-marca-dark.png"
              alt="RC Soluções"
              className="w-14 h-14 sm:w-16 sm:h-16"
            />
          </a>

          <LinksPage position="flex-row" hasPartners={hasPartners} />

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-1 mt-4 pb-2 border-t border-white/10 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold py-2 transition hover:text-blue-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
