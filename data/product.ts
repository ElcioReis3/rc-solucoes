export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "limpeza" | "expediente";
  subCategory:
    | "papel"
    | "quimicos"
    | "dispensers"
    | "higienicos"
    | "utensilios"
    | "luvas";
};

export const ListProducts: Product[] = [
  {
    id: "p1",
    title: "Dispenser de Papel Higiênico",
    description:
      "Dispenser branco, compacto e robusto para rolos de papel higiênico jumbo. Ideal para alto tráfego.",
    imageUrl: "/assets/images/images-produtos/Dispense_de_papel_higienico.jpg",
    category: "expediente",
    subCategory: "dispensers",
  },
  {
    id: "p8",
    title: "Dispenser Toalheiro Interfolha",
    description:
      "Dispenser para papel toalha interfolhado, promovendo higiene e economia no consumo de papel.",
    imageUrl:
      "/assets/images/images-produtos/Dispense_Toalheiro_porta_papel.jpg",
    category: "expediente",
    subCategory: "dispensers",
  },
  {
    id: "p10",
    title: "Dispenser para Papel Toalha Bobina (Autocorte)",
    description: "Dispenser elegante com autocorte para controle de consumo.",
    imageUrl: "/assets/images/images-produtos/Dispense_para_detergente.jpg",
    category: "expediente",
    subCategory: "dispensers",
  },
  {
    id: "p6",
    title: "Dispenser de Sabonete Líquido",
    description:
      "Dispenser de parede para sabonete líquido ou álcool em gel. Capacidade 800ml.",
    imageUrl:
      "/assets/images/images-produtos/Dispenser_de_sabonete_liquido.jpg",
    category: "expediente",
    subCategory: "dispensers",
  },
  {
    id: "p13",
    title: "Lixeira com Pedal de Plástico (50L)",
    description:
      "Lixeira robusta e prática para ambientes internos e externos.",
    imageUrl: "/assets/images/images-produtos/Lixeira_com_pedal_plastico.jpg",
    category: "expediente",
    subCategory: "utensilios",
  },
  {
    id: "p24",
    title: "Placa de Sinalização 'Cuidado Piso Molhado'",
    description:
      "Placa dobrável e resistente para sinalização de áreas em limpeza.",
    imageUrl: "/assets/images/images-produtos/Placa_Piso_Molhado.jpg",
    category: "expediente",
    subCategory: "utensilios",
  },

  {
    id: "p15",
    title: "Papel Higiênico Jumbo 100% Celulose (6 Rolos)",
    description: "Alta maciez e durabilidade.",
    imageUrl:
      "/assets/images/images-produtos/Papel_Higienico_100_ celulose.jpg",
    category: "limpeza",
    subCategory: "papel",
  },
  {
    id: "p21",
    title: "Papel Toalha em Bobina 100% Celulose (6 Rolos)",
    description: "Alta absorção e rendimento.",
    imageUrl: "/assets/images/images-produtos/Papel_toalha_100_celulose.jpg",
    category: "limpeza",
    subCategory: "papel",
  },
  {
    id: "p22",
    title: "Papel Toalha Interfolhado 100% Celulose (3 Pacotes)",
    description: "Folha dupla macia e absorvente.",
    imageUrl:
      "/assets/images/images-produtos/Papel_interfolhado_100_celulose.jpg",
    category: "limpeza",
    subCategory: "papel",
  },

  {
    id: "p36",
    title: "Sabonete Espuma All Clean",
    description:
      "Sabonete líquido em espuma 5L ideal para lavabos e dispensers.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0032.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },

  {
    id: "p27",
    title: "Lava Louças Harmoniex - Alta Diluição",
    description: "Detergente de alto rendimento e pH neutro.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0029.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p29",
    title: "Desengordurante Harmoniex - Alta Diluição",
    description: "Fórmula mais potente para limpeza pesada.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0026.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p28",
    title: "Desinfetante Harmoniex Romance - Alta Diluição",
    description: "Desinfetante com perfume Romance.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0028.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },

  {
    id: "p30",
    title: "Limpa Pedras Harmoniex - Alta Diluição",
    description: "Detergente para pedras e cimentados.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0031.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p31",
    title: "Limpa Pedras Pedrex - Alta Diluição",
    description: "Ideal para pisos rústicos e tijolos.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0027.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p32",
    title: "Limpa Peróxido San Peroxxy Plus - Alta Diluição",
    description: "Limpador com Peróxido de Hidrogênio. Diluição 1/200.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0025.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },

  {
    id: "p33",
    title: "Limpador Perfumado Klyo - Alta Diluição",
    description: "Limpador com fragrância Brisa do Campo.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0030.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p34",
    title: "Desinfetante Lysoform Original",
    description: "Mata 99,9% dos vírus e bactérias.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0033.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p35",
    title: "Aromatizador Mirax Air Bamboo - Alta Diluição",
    description: "Odorizador concentrado Bamboo.",
    imageUrl: "/assets/images/images-produtos/IMG-20251115-WA0034.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p36",
    title: "Sabão Líquido Harmoniex Pistache - Alta Diluição",
    description: "Sabão líquido perfumado.",
    imageUrl: "/assets/images/images-produtos/sabao_de-pistache.jpeg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p37",
    title: "Álcool em Gel",
    description: "Álcool em gel 70% antisséptico.",
    imageUrl: "/assets/images/images-produtos/alcool-em-gel.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
  {
    id: "p37",
    title: "Álcool Gel Líquido",
    description: "Álcool gel 70% antisséptico.",
    imageUrl: "/assets/images/images-produtos/alcool-gel.jpeg",
    category: "limpeza",
    subCategory: "quimicos",
  },

  {
    id: "p2",
    title: "Azulim - Pedra Sanitária Lavanda (25g)",
    description: "Pedra sanitária com perfume Lavanda.",
    imageUrl: "/assets/images/images-produtos/Azulim.jpg",
    category: "limpeza",
    subCategory: "higienicos",
  },
  {
    id: "p9",
    title: "Bloco para Caixa Acoplada Novo Frescor (3un)",
    description: "Mantém o vaso limpo por mais tempo.",
    imageUrl: "/assets/images/images-produtos/Bloco_para_Caixa_Acoplada.jpg",
    category: "limpeza",
    subCategory: "higienicos",
  },

  {
    id: "p4",
    title: "Flanela Multiuso (Laranja)",
    description: "Flanela macia e absorvente.",
    imageUrl: "/assets/images/images-produtos/Flanela.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },
  {
    id: "p14",
    title: "Pano Multiuso Microfibra (Kit 8 Cores)",
    description: "Alta absorção e ideal para detalhamento.",
    imageUrl: "/assets/images/images-produtos/Pano_multiuso_microfibra.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },
  {
    id: "p26",
    title: "Pano de Limpeza Microfibra (Kit Colorido)",
    description: "Alta absorção e toque macio.",
    imageUrl: "/assets/images/images-produtos/Pano_Micro_Fibra.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },
  {
    id: "p17",
    title: "Pano de Chão Microfibra (Azul)",
    description: "Super absorvente e ideal para pisos.",
    imageUrl: "/assets/images/images-produtos/Pano_de_Chao_Microfibra.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },

  {
    id: "p5",
    title: "Fibra Verde de Limpeza Pesada (Pacote c/ 10)",
    description: "Fibra abrasiva resistente.",
    imageUrl:
      "/assets/images/images-produtos/Fibra_verde_de_limpeza_pesada.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },
  {
    id: "p23",
    title: "Rodo Pega Fibra com Cabo",
    description: "Ideal para fibras de limpeza pesada.",
    imageUrl: "/assets/images/images-produtos/Rodo_Pega_Fibra.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },

  {
    id: "p7",
    title: "Balde Espremedor Doblo 30 Litros (Profissional)",
    description: "Balde com espremedor profissional.",
    imageUrl:
      "/assets/images/images-produtos/Balde_Espremedor_Doblo_30litros.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },
  {
    id: "p12",
    title: "Mop Giratório com Balde Inox",
    description: "Sistema giratório para limpeza prática.",
    imageUrl: "/assets/images/images-produtos/Mop_Giratorio.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },
  {
    id: "p18",
    title: "Mop Pó Retangular (40cm)",
    description: "Ideal para coleta de pó.",
    imageUrl: "/assets/images/images-produtos/Mop_Po.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },

  {
    id: "p19",
    title: "Pá de Lixo Coletora com Cabo",
    description: "Ergonômica e prática para resíduos.",
    imageUrl: "/assets/images/images-produtos/Pa_de_lixo_coletora.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },

  {
    id: "p11",
    title: "Luvas Confort Látex Danny (Amarela)",
    description: "Luva com palma antiderrapante.",
    imageUrl: "/assets/images/images-produtos/Luvas_Confort_Latex.jpg",
    category: "limpeza",
    subCategory: "luvas",
  },
  {
    id: "p16",
    title: "Luva Ranhurada Volk (Limpeza Pesada)",
    description: "Luva de látex robusta ideal para limpeza pesada.",
    imageUrl: "/assets/images/images-produtos/Luva_Ranhurada.jpg",
    category: "limpeza",
    subCategory: "luvas",
  },

  {
    id: "p25",
    title: "Saco de Lixo Reforçado (100 Unid.)",
    description: "Resistência para uso profissional.",
    imageUrl: "/assets/images/images-produtos/Saco_de_lixo.jpg",
    category: "limpeza",
    subCategory: "utensilios",
  },

  {
    id: "p20",
    title: "Odorizante Ambiental Puro Ar (Capim Limão)",
    description: "Perfume para ambientes.",
    imageUrl: "/assets/images/images-produtos/Odorizante_Ambiental.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },

  {
    id: "p3",
    title: "Limpador Geral Power Oxy (500ml)",
    description: "Limpador multiuso com Oxigênio Ativo.",
    imageUrl: "/assets/images/images-produtos/Limpador_Geral.jpg",
    category: "limpeza",
    subCategory: "quimicos",
  },
];
