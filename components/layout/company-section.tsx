"use client";
import { Map, Phone, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Store, Home, School, Stethoscope, Dumbbell } from "lucide-react";
import { WhatsappIcon } from "../WhatsappIcon";

export const CompanySection = () => {
  const router = useRouter();

  return (
    <>
      <section id="about" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Quem Somos
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                A RC Soluções é uma empresa especializada na venda e
                distribuição de produtos de limpeza e material de expediente
                para empresas de todos os portes. Trabalhamos com variedade,
                agilidade e uma ótima relação custo-benefício, garantindo
                praticidade no seu dia a dia e fornecimento contínuo para o seu
                negócio.
              </p>

              <div className="flex gap-4 mb-8">
                <a
                  href="https://wa.me/5586998012172"
                  target="_blank"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <WhatsappIcon
                    width={24}
                    height={24}
                    className="text-green-600 hover:text-green-700"
                  />{" "}
                  86 99801-2172
                </a>

                <a
                  href="https://wa.me/5586998519292"
                  target="_blank"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <WhatsappIcon
                    width={24}
                    height={24}
                    className="text-green-600 hover:text-green-700"
                  />{" "}
                  86 99851-9292
                </a>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                O QUE OFERECEMOS
              </h3>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-500 mb-4">
                  Contamos com um catálogo para atender escritórios, comércios,
                  residências, escolas, clínicas, academias e diversos outros
                  segmentos.
                </h3>
                <p className="flex gap-7 text-primary ">
                  <Store /> <Home /> <School /> <Stethoscope /> <Dumbbell />
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6">
              <div className="bg-blue-600 text-white p-6 rounded-lg w-full">
                <div className="flex items-start gap-3">
                  <Map className="" size={24} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Nos Encontre</h3>
                    <p>
                      Rua Engenheiro Ronald Carvalho - 610 CS2B / Morada do Sol
                      | 64056-220 Teresina - PI
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-500 w-full h-96 rounded-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3337.6898080613073!2d-42.768253325018144!3d-5.074619794902163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMDQnMjguNiJTIDQywrA0NSc1Ni40Ilc!5e1!3m2!1spt-BR!2sbr!4v1763128558312!5m2!1spt-BR!2sbr"
                  width="600"
                  height="450"
                  className="w-full h-full "
                  loading="lazy"
                ></iframe>
              </div>
              <Button
                className="w-full p-4 text-xl font-bold cursor-pointer animate-pulse"
                onClick={() => router.push("/portfolio")}
              >
                <ShoppingCart /> Ver Catálogo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
