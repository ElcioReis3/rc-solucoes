"use client";
import { useEffect, useState } from "react";
import { WhatsappIcon } from "../WhatsappIcon";

export const HeroSection = () => {
  const contacts = ["5586998012172", "5586998519292"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index == 0) {
        setIndex(1);
      }
      if (index == 1) {
        setIndex(0);
      }
    }, 30000);

    return () => clearInterval(interval);
  });

  const numeroWhats = contacts[index];
  return (
    <>
      <section id="initial" className="bg-primary text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Soluções em material de limpeza e expediente para sua empresa
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Produtos de alta qualidade, entregas ágeis e um atendimento
              especializado que entende as necessidades do seu negócio.
            </p>
            <a
              href={`https://wa.me/${numeroWhats}`}
              target="_blank"
              className="inline-flex gap-3 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg animate-pulse"
            >
              <WhatsappIcon width={24} height={24} className="text-green-600" />
              Entre em Contato Conosco
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
