export type Product = {
  id: string;
  title: string;
  description: string;
  price?: number;
  imageUrl: string;
};

export const ListProducts: Product[] = [
  {
    id: "p1",
    title: "Dispenser de Papel Higiênico",
    description:
      "Dispenser branco, compacto e robusto para rolos de papel higiênico jumbo. Ideal para alto tráfego.",
    price: 85.5,
    imageUrl: "/assets/images/images-produtos/Dispense_de_papel_higienico.jpg",
  },
  {
    id: "p2",
    title: "Azulim - Pedra Sanitária Lavanda (25g)",
    description:
      "Pedra sanitária para caixa acoplada com perfume de Lavanda. Fácil instalação e longa duração.",
    price: 3.99,
    imageUrl: "/assets/images/images-produtos/Azulim.jpg",
  },
  {
    id: "p3",
    title: "Limpador Geral Power Oxy (500ml)",
    description:
      "Limpador multiuso com Oxigênio Ativo para limpeza pesada em diversas superfícies, removendo manchas difíceis.",
    price: 12.75,
    imageUrl: "/assets/images/images-produtos/Limpador_Geral.jpg",
  },
  {
    id: "p4",
    title: "Flanela Multiuso (Laranja)",
    description:
      "Flanela macia e absorvente, ideal para polimento e limpeza de superfícies delicadas sem riscar.",
    price: 4.9,
    imageUrl: "/assets/images/images-produtos/Flanela.jpg",
  },
  {
    id: "p5",
    title: "Fibra Verde de Limpeza Pesada (Pacote c/ 10)",
    description:
      "Fibra abrasiva de alta resistência para remoção de sujeira incrustada e limpeza pesada.",
    price: 19.9,
    imageUrl:
      "/assets/images/images-produtos/Fibra_verde_de_limpeza_pesada.jpg",
  },
  {
    id: "p6",
    title: "Dispenser de Sabonete Líquido",
    description:
      "Dispenser de parede com acionamento manual (push) para sabonete líquido ou álcool em gel. Capacidade 800ml.",
    price: 79.9,
    imageUrl:
      "/assets/images/images-produtos/Dispenser_de_sabonete_liquido.jpg",
  },
  {
    id: "p7",
    title: "Balde Espremedor Doblo 30 Litros (Profissional)",
    description:
      "Balde espremedor com rodízios e divisória dupla, ideal para a limpeza profissional de grandes áreas.",
    price: 320.0,
    imageUrl:
      "/assets/images/images-produtos/Balde_Espremedor_Doblo_30litros.jpg",
  },
  {
    id: "p8",
    title: "Dispenser Toalheiro Interfolha",
    description:
      "Dispenser para papel toalha interfolhado, promovendo higiene e economia no consumo de papel.",
    price: 95.0,
    imageUrl:
      "/assets/images/images-produtos/Dispense_Toalheiro_porta_papel.jpg",
  },
  {
    id: "p9",
    title: "Bloco para Caixa Acoplada Novo Frescor (3un)",
    description:
      "Blocos sanitários para manter o vaso limpo, com água azul e fragrâncias Floral e Marine.",
    price: 16.5,
    imageUrl: "/assets/images/images-produtos/Bloco_para_Caixa_Acoplada.jpg",
  },
  {
    id: "p10",
    title: "Dispenser para Papel Toalha Bobina (Autocorte)",
    description:
      "Dispenser elegante e higiênico para papel toalha em bobina. Corte automático para controle de consumo.",
    price: 110.0,
    imageUrl: "/assets/images/images-produtos/Dispense_para_detergente.jpg",
  },

  // --- Lista 2: Luvas e Mops ---
  {
    id: "p11",
    title: "Luvas Confort Látex Danny (Amarela)",
    description:
      "Luva de segurança em látex com palma antiderrapante e forro em algodão. Maior tato e conforto.",
    price: 18.9,
    imageUrl: "/assets/images/images-produtos/Luvas_Confort_Latex.jpg",
  },
  {
    id: "p12",
    title: "Mop Giratório com Balde Inox",
    description:
      "Sistema de limpeza com balde e cesto centrifugador em inox. Acompanha dois refis de microfibra.",
    price: 129.9,
    imageUrl: "/assets/images/images-produtos/Mop_Giratorio.jpg",
  },
  {
    id: "p13",
    title: "Lixeira com Pedal de Plástico (50L)",
    description:
      "Lixeira robusta e com pedal para acionamento. Ideal para áreas internas e externas de médio volume.",
    price: 145.0,
    imageUrl: "/assets/images/images-produtos/Lixeira_com_pedal_plastico.jpg",
  },
  {
    id: "p14",
    title: "Pano Multiuso Microfibra (Kit 8 Cores)",
    description:
      "Panos de microfibra de alta absorção, ideais para limpeza geral sem deixar fiapos. Perfeito para o sistema de cores.",
    price: 25.0,
    imageUrl: "/assets/images/images-produtos/Pano_multiuso_microfibra.jpg",
  },
  {
    id: "p15",
    title: "Papel Higiênico Jumbo 100% Celulose (6 Rolos)",
    description:
      "Papel higiênico institucional de alta qualidade, 100% celulose, em rolos jumbo para máxima economia.",
    price: 89.9,
    imageUrl:
      "/assets/images/images-produtos/Papel_Higienico_100_ celulose.jpg",
  },
  {
    id: "p16",
    title: "Luva Ranhurada Volk (Limpeza Pesada)",
    description:
      "Luva de látex natural com ranhuras para melhor aderência em superfícies molhadas. Resistência e proteção.",
    price: 14.5,
    imageUrl: "/assets/images/images-produtos/Luva_Ranhurada.jpg",
  },
  {
    id: "p17",
    title: "Pano de Chão Microfibra (Azul)",
    description:
      "Pano de microfibra para chão. Ideal para absorver líquidos e coletar pó sem riscar pisos.",
    price: 11.9,
    imageUrl: "/assets/images/images-produtos/Pano_de_Chao_Microfibra.jpg",
  },
  {
    id: "p18",
    title: "Mop Pó Retangular (40cm)",
    description:
      "Mop para coleta de pó e sujidade seca. Cabo telescópico e refil em acrílico para limpeza eficiente.",
    price: 75.0,
    imageUrl: "/assets/images/images-produtos/Mop_Po.jpg",
  },
  {
    id: "p19",
    title: "Pá de Lixo Coletora com Cabo",
    description:
      "Pá coletora de lixo ergonômica com cabo longo, ideal para evitar o contato com o chão.",
    price: 49.9,
    imageUrl: "/assets/images/images-produtos/Pa_de_lixo_coletora.jpg",
  },
  {
    id: "p20",
    title: "Odorizante Ambiental Puro Ar (Capim Limão)",
    description:
      "Odorizante em aerossol de longa duração. Perfume de Capim Limão, ideal para banheiros e ambientes internos.",
    price: 15.2,
    imageUrl: "/assets/images/images-produtos/Odorizante_Ambiental.jpg",
  },

  // --- Lista 3: Sinalização e Papéis ---
  {
    id: "p21",
    title: "Papel Toalha em Bobina 100% Celulose (6 Rolos)",
    description:
      "Bobinas de papel toalha industrial de alta qualidade e absorção. Ideal para dispensers de grande volume.",
    price: 69.9,
    imageUrl: "/assets/images/images-produtos/Papel_toalha_100_celulose.jpg",
  },
  {
    id: "p22",
    title: "Papel Toalha Interfolhado 100% Celulose (3 Pacotes)",
    description:
      "Papel toalha folha dupla, macio e ultra absorvente. Perfeito para uso em dispensers interfolha.",
    price: 45.0,
    imageUrl:
      "/assets/images/images-produtos/Papel_interfolhado_100_celulose.jpg",
  },
  {
    id: "p23",
    title: "Rodo Pega Fibra com Cabo (Limpeza de Superfícies)",
    description:
      "Rodo com base plana e cabo, desenhado para fixar fibras de limpeza pesada, ideal para paredes e pisos.",
    price: 55.9,
    imageUrl: "/assets/images/images-produtos/Rodo_Pega_Fibra.jpg",
  },
  {
    id: "p24",
    title: "Placa de Sinalização 'Cuidado Piso Molhado'",
    description:
      "Placa A-frame amarela, dobrável e de alta visibilidade. Item de segurança essencial para áreas em limpeza.",
    price: 39.9,
    imageUrl: "/assets/images/images-produtos/Placa_Piso_Molhado.jpg",
  },
  {
    id: "p25",
    title: "Saco de Lixo Reforçado (100 Unidades - Vários L.)",
    description:
      "Sacos de lixo resistentes em diversos tamanhos (15L, 30L, 50L, 100L). Embalagem com 100 unidades.",
    price: 35.0,
    imageUrl: "/assets/images/images-produtos/Saco_de_lixo.jpg",
  },
  {
    id: "p26",
    title: "Pano de Limpeza Microfibra (Kit Colorido)",
    description:
      "Kit de panos de microfibra super macios e absorventes, indicados para a limpeza detalhada e polimento.",
    price: 28.5,
    imageUrl: "/assets/images/images-produtos/Pano_Micro_Fibra.jpg",
  },
];
