"use client";
import { useRouter } from "next/navigation";
import { LinksPage } from "../links-pages/links-page";

export const InforFooter = () => {
  const router = useRouter();

  return (
    <>
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Quer saber mais?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nossas páginas</h3>
              <LinksPage position="flex-col" />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li
                  className="hover:text-blue-400 transition cursor-pointer"
                  onClick={() => router.push("/legal-notice")}
                >
                  Aviso Legal
                </li>
                <li
                  className="hover:text-blue-400 transition cursor-pointer"
                  onClick={() => router.push("/terms-of-use")}
                >
                  Termos de Uso
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">
                Para dúvidas ou solicitações sobre estes Termos, entre em
                contato:
              </h3>
              <a href="#" className="text-gray-300">
                contato@rcsolucoes.com.br
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
