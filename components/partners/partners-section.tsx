import Image from "next/image";
import type { PartnerCompany } from "@/models/partner";

export function PartnersSection({ partners }: { partners: PartnerCompany[] }) {
  if (partners.length === 0) return null;

  return (
    <section id="partners" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Empresas Parceiras
          </h2>
          <p className="text-gray-600 text-lg">
            Negócios que confiam na RC Soluções para manter seus ambientes limpos e organizados.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => {
            const Wrapper: React.ElementType = partner.websiteUrl ? "a" : "div";
            const wrapperProps = partner.websiteUrl
              ? { href: partner.websiteUrl, target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <Wrapper
                key={partner.id}
                {...wrapperProps}
                className="group block rounded-xl overflow-hidden border hover:shadow-lg transition-shadow bg-gray-50"
              >
                <div className="relative w-full h-32 bg-gray-200">
                  <Image
                    src={partner.bannerUrl}
                    alt={`Banner ${partner.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bg-white">
                  <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-white border">
                    <Image
                      src={partner.logoUrl}
                      alt={`Logo ${partner.name}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <p className="font-semibold text-gray-800">{partner.name}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
