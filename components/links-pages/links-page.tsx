type Props = {
  position: "flex-row" | "flex-col";
};

export const LinksPage = ({ position }: Props) => {
  return (
    <nav className={`hidden md:flex space-x-8 ${position}`}>
      <a href="#banner" className=" font-bold transition">
        Home
      </a>
      <a href="#sobre" className=" font-bold transition">
        Quem Somos
      </a>
      <a href="/portfolio" className=" font-bold transition">
        Catálogo
      </a>
      <a href="#vantagens" className=" font-bold transition">
        Vantagens
      </a>
      <a href="#contato" className=" font-bold transition">
        Contato
      </a>
    </nav>
  );
};
