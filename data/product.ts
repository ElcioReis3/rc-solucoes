export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "limpeza" | "expediente";
};

export const ListProducts: Product[] = [
  // --- Material de Expediente ---
  {
    id: "p1",
    title: "Dispenser de Papel Higiênico",
    description:
      "Dispenser branco, compacto e robusto para rolos de papel higiênico jumbo. Ideal para alto tráfego.",
    imageUrl: "/assets/images/images-produtos/Dispense_de_papel_higienico.jpg",
    category: "expediente",
  },
  {
    id: "p8",
    title: "Dispenser Toalheiro Interfolha",
    description:
      "Dispenser para papel toalha interfolhado, promovendo higiene e economia no consumo de papel.",
    imageUrl:
      "/assets/images/images-produtos/Dispense_Toalheiro_porta_papel.jpg",
    category: "expediente",
  },
  {
    id: "p6",
    title: "Dispenser de Sabonete Líquido",
    description:
      "Dispenser de parede para sabonete líquido ou álcool em gel. Capacidade 800ml.",
    imageUrl:
      "/assets/images/images-produtos/Dispenser_de_sabonete_liquido.jpg",
    category: "expediente",
  },
  {
    id: "p10",
    title: "Dispenser para Papel Toalha Bobina (Autocorte)",
    description:
      "Dispenser elegante e higiênico com autocorte para controle de consumo.",
    imageUrl: "/assets/images/images-produtos/Dispense_para_detergente.jpg",
    category: "expediente",
  },
  {
    id: "p13",
    title: "Lixeira com Pedal de Plástico (50L)",
    description:
      "Lixeira robusta e prática, ideal para ambientes internos e externos.",
    imageUrl: "/assets/images/images-produtos/Lixeira_com_pedal_plastico.jpg",
    category: "expediente",
  },
  {
    id: "p24",
    title: "Placa de Sinalização 'Cuidado Piso Molhado'",
    description:
      "Placa dobrável e resistente para sinalização de áreas em limpeza.",
    imageUrl: "/assets/images/images-produtos/Placa_Piso_Molhado.jpg",
    category: "expediente",
  },

  // --- Produtos de Limpeza ---
  {
    id: "p2",
    title: "Azulim - Pedra Sanitária Lavanda (25g)",
    description: "Pedra sanitária para caixa acoplada com perfume de Lavanda.",
    imageUrl: "/assets/images/images-produtos/Azulim.jpg",
    category: "limpeza",
  },
  {
    id: "p3",
    title: "Limpador Geral Power Oxy (500ml)",
    description: "Limpador multiuso com Oxigênio Ativo para limpeza pesada.",
    imageUrl: "/assets/images/images-produtos/Limpador_Geral.jpg",
    category: "limpeza",
  },
  {
    id: "p4",
    title: "Flanela Multiuso (Laranja)",
    description: "Flanela macia e absorvente ideal para limpeza delicada.",
    imageUrl: "/assets/images/images-produtos/Flanela.jpg",
    category: "limpeza",
  },
  {
    id: "p5",
    title: "Fibra Verde de Limpeza Pesada (Pacote c/ 10)",
    description:
      "Fibra abrasiva resistente para remoção de sujeira incrustada.",
    imageUrl:
      "/assets/images/images-produtos/Fibra_verde_de_limpeza_pesada.jpg",
    category: "limpeza",
  },
  {
    id: "p7",
    title: "Balde Espremedor Doblo 30 Litros (Profissional)",
    description: "Balde com espremedor profissional para grandes áreas.",
    imageUrl:
      "/assets/images/images-produtos/Balde_Espremedor_Doblo_30litros.jpg",
    category: "limpeza",
  },
  {
    id: "p9",
    title: "Bloco para Caixa Acoplada Novo Frescor (3un)",
    description: "Mantém o vaso limpo com fragrância prolongada.",
    imageUrl: "/assets/images/images-produtos/Bloco_para_Caixa_Acoplada.jpg",
    category: "limpeza",
  },
  {
    id: "p11",
    title: "Luvas Confort Látex Danny (Amarela)",
    description: "Luva com palma antiderrapante e ótima durabilidade.",
    imageUrl: "/assets/images/images-produtos/Luvas_Confort_Latex.jpg",
    category: "limpeza",
  },
  {
    id: "p12",
    title: "Mop Giratório com Balde Inox",
    description: "Sistema giratório ideal para limpeza prática e rápida.",
    imageUrl: "/assets/images/images-produtos/Mop_Giratorio.jpg",
    category: "limpeza",
  },
  {
    id: "p14",
    title: "Pano Multiuso Microfibra (Kit 8 Cores)",
    description: "Alta absorção e ideal para detalhamento.",
    imageUrl: "/assets/images/images-produtos/Pano_multiuso_microfibra.jpg",
    category: "limpeza",
  },
  {
    id: "p15",
    title: "Papel Higiênico Jumbo 100% Celulose (6 Rolos)",
    description: "Alta maciez e durabilidade.",
    imageUrl:
      "/assets/images/images-produtos/Papel_Higienico_100_ celulose.jpg",
    category: "limpeza",
  },
  {
    id: "p16",
    title: "Luva Ranhurada Volk (Limpeza Pesada)",
    description: "Luva de látex robusta ideal para limpeza pesada.",
    imageUrl: "/assets/images/images-produtos/Luva_Ranhurada.jpg",
    category: "limpeza",
  },
  {
    id: "p17",
    title: "Pano de Chão Microfibra (Azul)",
    description: "Super absorvente e ideal para pisos.",
    imageUrl: "/assets/images/images-produtos/Pano_de_Chao_Microfibra.jpg",
    category: "limpeza",
  },
  {
    id: "p18",
    title: "Mop Pó Retangular (40cm)",
    description: "Ideal para coleta de pó e limpeza seca.",
    imageUrl: "/assets/images/images-produtos/Mop_Po.jpg",
    category: "limpeza",
  },
  {
    id: "p19",
    title: "Pá de Lixo Coletora com Cabo",
    description: "Ergonômica e prática para coleta de resíduos.",
    imageUrl: "/assets/images/images-produtos/Pa_de_lixo_coletora.jpg",
    category: "limpeza",
  },
  {
    id: "p20",
    title: "Odorizante Ambiental Puro Ar (Capim Limão)",
    description: "Perfume de longa duração para ambientes.",
    imageUrl: "/assets/images/images-produtos/Odorizante_Ambiental.jpg",
    category: "limpeza",
  },
  {
    id: "p21",
    title: "Papel Toalha em Bobina 100% Celulose (6 Rolos)",
    description: "Alta absorção e rendimento.",
    imageUrl: "/assets/images/images-produtos/Papel_toalha_100_celulose.jpg",
    category: "limpeza",
  },
  {
    id: "p22",
    title: "Papel Toalha Interfolhado 100% Celulose (3 Pacotes)",
    description: "Folha dupla macia e absorvente.",
    imageUrl:
      "/assets/images/images-produtos/Papel_interfolhado_100_celulose.jpg",
    category: "limpeza",
  },
  {
    id: "p23",
    title: "Rodo Pega Fibra com Cabo",
    description: "Ideal para fibras de limpeza pesada.",
    imageUrl: "/assets/images/images-produtos/Rodo_Pega_Fibra.jpg",
    category: "limpeza",
  },
  {
    id: "p25",
    title: "Saco de Lixo Reforçado (100 Unidades - Vários L.)",
    description: "Resistência para uso profissional.",
    imageUrl: "/assets/images/images-produtos/Saco_de_lixo.jpg",
    category: "limpeza",
  },
  {
    id: "p26",
    title: "Pano de Limpeza Microfibra (Kit Colorido)",
    description: "Panos ultra macios e com alta absorção.",
    imageUrl: "/assets/images/images-produtos/Pano_Micro_Fibra.jpg",
    category: "limpeza",
  },
  {
    id: "p27",
    title: "Lava Louças Harmoniex",
    description:
      "Detergente de alto rendimento e pH neutro que garante desengorduramento eficaz e maior economia. Ideal para louças, talheres e utensílios em geral.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0029.jpg",
    category: "limpeza",
  },
  {
    id: "p28",
    title: "Desinfetante Harmoniex Romance",
    description:
      "Desinfetante de uso geral com agradável perfume Romance. Possui ação bactericida e é perfeito para desinfetar e perfumar pisos, banheiros e superfícies laváveis.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0028.jpg",
    category: "limpeza",
  },
  {
    id: "p29",
    title: "Desengordurante Harmoniex",
    description:
      "Fórmula 2x mais potente para limpeza pesada. Atua com eficácia máxima na remoção de gorduras e graxas em coifas, churrasqueiras, pisos, cozinhas e banheiros.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0026.jpg",
    category: "limpeza",
  },
  {
    id: "p30",
    title: "Limpa Pedras Harmoniex",
    description:
      "Detergente de alta performance desenvolvido para limpeza profunda de pedras, tijolos e cimentados. Restaura a aparência de superfícies externas com sujeira incrustada.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0031.jpg",
    category: "limpeza",
  },
  {
    id: "p31",
    title: "Limpa Pedras Pedrex",
    description:
      "Limpador potente ideal para remoção de sujeira e oxidação em pisos rústicos, pedras, cimentados e tijolos. Restaura e revitaliza superfícies externas desgastadas.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0027.jpg",
    category: "limpeza",
  },
  {
    id: "p32",
    title: "Limpa Peróxido San Peroxxy Plus",
    description:
      "Limpador profissional formulado com Peróxido de Hidrogênio. Oferece alto poder de limpeza, com alta diluição sendo 1/200 ideal para ambientes hospitalares e comerciais que exigem higiene rigorosa.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0025.jpg",
    category: "limpeza",
  },
  {
    id: "p33",
    title: "Limpador Perfumado Klyo",
    description:
      "Limpador de uso geral que oferece limpeza e perfumação agradável de Brisa do Campo em uma única etapa. Ideal para manutenção diária de pisos e ambientes.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0030.jpg",
    category: "limpeza",
  },
  {
    id: "p34",
    title: "Desinfetante Lysoform Original",
    description:
      "O desinfetante número 1 recomendado por médicos. Mata 99,9% dos vírus e bactérias, incluindo o SARS-CoV-2 (COVID-19), garantindo máxima higiene e proteção.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0033.jpg",
    category: "limpeza",
  },
  {
    id: "p35",
    title: "Aromatizador Mirax Air Bamboo",
    description:
      "Odorizador de Ambientes concentrado com suave e duradoura fragrância Bamboo. Proporciona bem-estar e frescor em áreas de alto tráfego ou escritórios.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0034.jpg",
    category: "limpeza",
  },
  {
    id: "p36",
    title: "Sabonete Espuma All Clean",
    description:
      "Sabonete líquido em espuma de 5L. Sua fórmula suave não resseca a epiderme, sendo ideal para uso frequente em lavabos, banheiros e dispensers de alto fluxo.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0032.jpg",
    category: "limpeza",
  },
];
