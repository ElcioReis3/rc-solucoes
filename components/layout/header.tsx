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

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-2">
              <a href="#banner" className="hover:text-blue-200 transition">
                Home
              </a>
              <a href="#noticias" className="hover:text-blue-200 transition">
                Notícias
              </a>
              <a href="#curso" className="hover:text-blue-200 transition">
                Senac
              </a>
              <a href="#contato" className="hover:text-blue-200 transition">
                Contato
              </a>
              <a href="#cursos" className="hover:text-blue-200 transition">
                Cursos
              </a>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};
