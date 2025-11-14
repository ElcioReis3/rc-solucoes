import { Folder, Phone } from "lucide-react";
import Image from "next/image";

export const TechnicalSection = () => {
  return (
    <>
      <section id="contato" className="py-14 ">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <Image
              width={170}
              height={170}
              src="/assets/images/logo-tipo-light.png"
              alt="rc soluções"
              className="m-auto"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Conheça a RC Soluções
            </h2>
            <p className="text-gray-600 text-lg">
              Conheça nosso catálogo completo de produtos e serviços
            </p>
          </header>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Nos siga nas redes sociais
                </h3>
                <p className="text-gray-600 mb-6">
                  Conheça as nossas redes sociais para ficar por dentro das
                  novidades, promoções e dicas exclusivas sobre nossos produtos
                  e serviços.
                </p>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-lg text-gray-800 mb-4">
                    Me siga nas redes sociais
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="#"
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <Phone size={20} /> WhatsApp
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                    >
                      <Folder size={20} /> Nosso Catálogo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
