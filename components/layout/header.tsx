"use client";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LinksPage } from "../links-pages/links-page";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="bg-blue-950 text-secondary top-0 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                <Image
                  width={80}
                  height={80}
                  src="/assets/images/logo-marca-dark.png"
                  alt="Logo"
                />
              </div>
            </a>

            <LinksPage position="flex-row" />

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          {mobileMenuOpen && <LinksPage position="flex-col" />}
        </div>
      </header>
    </>
  );
};
