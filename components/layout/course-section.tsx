import { BadgeDollarSign, HeadsetIcon, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

type listCourseType = {
  title: string;
  icon: React.ElementType;
  description: string;
};

export const CourseSection = () => {
  const listCourse: listCourseType[] = [
    {
      title: "Entrega Rápida",
      icon: Truck,
      description:
        "Todas as aulas são realizadas no laboratório de informática para que você tenha a maior experiencia parecida com o mercado de trabalho.",
    },
    {
      title: "Qualidade Garantida",
      icon: ShieldCheck,
      description:
        "Conteúdo organizado e progressivo para facilitar sua compreensão e prática no dia a dia.",
    },
    {
      title: "Preço Competitivo",
      icon: BadgeDollarSign,
      description: "Condições especiais para empresas e compras recorrentes.",
    },
    {
      title: "Atendimento Personalizado",
      icon: HeadsetIcon,
      description:
        "Suporte direto para tirar dúvidas ou montar sua lista de produtos.",
    },
  ];

  return (
    <>
      <section id="vantagens" className="py-14 bg-gray-100">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <div className="w-36 h-36 rounded-lg flex items-center justify-center mx-auto">
              <Image
                width={300}
                height={300}
                src="/assets/images/logo-tipo-light.png"
                alt="rc soluções"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Por que escolher a RC Soluções?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Trabalhamos com condições diferenciadas para compras recorrentes,
              grandes volumes e contratos corporativos, sempre prezando pela
              transparência e mantendo preços competitivos.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {listCourse.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition"
              >
                {item.icon && (
                  <item.icon className="text-blue-600 mb-4 m-auto" size={38} />
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 ">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
