import { Flame, Apple, Droplets, BookOpen, AlertTriangle } from "lucide-react";

export interface EducationalChapter {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  content: {
    intro: string;
    science?: string;
    keyPoints?: string[];
    tips?: string[];
    quote?: string;
  };
}

export const UNIVERSAL_CHAPTERS: EducationalChapter[] = [
  {
    id: "ultra-processed",
    title: "O Fim dos Ultraprocessados",
    subtitle: "O que evitar e por quê",
    icon: "AlertTriangle",
    content: {
      intro: "Ultraprocessados são produtos industriais com ingredientes que você não encontra em uma cozinha comum: xaropes, emulsificantes, corantes, aromatizantes. Eles alteram hormônios, viciam o cérebro e inflamam o corpo. A regra de ouro: se tem mais de 5 ingredientes ou nomes que você não reconhece, não é comida.",
      science: "British Medical Journal (2024): consumo de ultraprocessados está associado a aumento de 29% no risco de obesidade e 31% no risco de diabetes tipo 2.",
      keyPoints: [
        "Evite: biscoitos recheados, refrigerantes, salgadinhos, margarinas",
        "Leia rótulos: açúcar escondido aparece como 'xarope de milho', 'maltodextrina', 'dextrose'",
        "Óleos vegetais refinados (soja, milho, girassol, canola) são ultraprocessados",
        "Comida de verdade não precisa de propaganda"
      ],
      quote: "Se veio de uma planta, coma. Se foi feito em uma planta industrial, evite."
    }
  },
  {
    id: "inverted-pyramid",
    title: "A Pirâmide Invertida",
    subtitle: "Nova hierarquia alimentar",
    icon: "Flame",
    content: {
      intro: "Esqueça a pirâmide dos anos 90 com base em carboidratos. A ciência moderna coloca proteínas e gorduras de qualidade no topo. A nova base: carnes, ovos, peixes, manteiga, azeite. No meio: vegetais de baixo amido. No topo (para consumo moderado): frutas e carboidratos bons.",
      science: "Harvard School of Public Health (2023) e Lancet (2024) validam que dietas ricas em proteína e gordura natural reduzem mortalidade por todas as causas.",
      keyPoints: [
        "Base: proteínas animais (30g+ por refeição principal)",
        "Centro: gorduras naturais (manteiga, banha, azeite, abacate)",
        "Suporte: vegetais não-amiláceos (couve, brócolis, abobrinha)",
        "Topo: frutas de baixo IG e carboidratos bons (ocasional)"
      ],
      quote: "A proteína é o tijolo. A gordura é o cimento. Os carboidratos são a decoração."
    }
  },
  {
    id: "real-food",
    title: "Comida de Verdade vs Produtos",
    subtitle: "Como identificar no mercado",
    icon: "Apple",
    content: {
      intro: "Comida de verdade é aquilo que sua bisavó reconheceria: carne, ovos, vegetais, frutas, manteiga. Produtos são criações da indústria alimentícia projetadas para viciar, não nutrir. A regra: compre nas bordas do supermercado (açougue, hortifruti, laticínios naturais), evite os corredores centrais.",
      science: "Cell Metabolism (2024): alimentos ultraprocessados aumentam a ingestão calórica em 500 kcal/dia comparado a comida de verdade, mesmo com mesmos macros.",
      keyPoints: [
        "Comida de verdade: não tem lista de ingredientes (é o próprio ingrediente)",
        "Produtos: embalagens coloridas, alegações de saúde, validade longa",
        "Priorize: açougue, feira, ovos caipiras, manteiga de pasto",
        "Evite: corredores de biscoitos, refrigerantes, congelados"
      ],
      tips: [
        "Se tem comercial na TV, provavelmente não é comida de verdade",
        "Quanto menor a lista de ingredientes, melhor",
        "Alimentos que estragam são os que nutrem"
      ],
      quote: "Seu corpo não foi projetado para processar o que a indústria inventa."
    }
  },
  {
    id: "fat-rehabilitation",
    title: "A Reabilitação das Gorduras",
    subtitle: "Manteiga, banha e sebo são aliados",
    icon: "Droplets",
    content: {
      intro: "Por décadas, gorduras naturais foram demonizadas. A ciência reverteu esse erro: gordura saturada de origem animal não causa doença cardíaca. O vilão real são os óleos vegetais refinados (soja, milho, girassol, canola) que oxidam facilmente e inflamam o corpo.",
      science: "Annals of Internal Medicine (2024) e American Journal of Clinical Nutrition (2023): não há associação entre gordura saturada e doença cardíaca. Óleos vegetais refinados, por outro lado, aumentam marcadores inflamatórios.",
      keyPoints: [
        "USE: manteiga de pasto, ghee, banha de porco, sebo bovino, azeite extra virgem, óleo de coco",
        "EVITE SEMPRE: óleo de soja, milho, girassol, canola, margarina",
        "Gordura animal é estável ao calor (não oxida ao cozinhar)",
        "Óleos vegetais são instáveis e formam aldeídos tóxicos quando aquecidos"
      ],
      tips: [
        "Fritar: banha de porco ou sebo bovino",
        "Cozinhar: manteiga ou ghee",
        "Finalizar: azeite de oliva extra virgem (cru)",
        "Nunca reutilizar óleo de fritura"
      ],
      quote: "A gordura que engorda não é a da manteiga — é a do óleo de soja escondido nos ultraprocessados."
    }
  },
  {
    id: "reading-labels",
    title: "Lendo Rótulos em 2026",
    subtitle: "Detectar açúcar e óleo escondidos",
    icon: "BookOpen",
    content: {
      intro: "A indústria alimentícia usa mais de 60 nomes diferentes para açúcar e esconde óleos vegetais em quase tudo. Aprender a ler rótulos é uma habilidade de sobrevivência nutricional. Regra: se os três primeiros ingredientes incluem açúcar, farinha ou óleo vegetal, devolva à prateleira.",
      science: "FDA e ANVISA exigem ordem decrescente de ingredientes. Os três primeiros representam a maior parte do produto.",
      keyPoints: [
        "Nomes do açúcar: xarope de milho, maltodextrina, dextrose, frutose, açúcar invertido, mel de milho",
        "Nomes do óleo ruim: óleo vegetal, gordura vegetal hidrogenada, margarina",
        "Alerta: 'light' ou 'zero gordura' geralmente significa mais açúcar",
        "Número de ingredientes: quanto menos, melhor (idealmente <5)"
      ],
      tips: [
        "Ingredientes são listados em ordem de quantidade",
        "Se não entende o nome, seu corpo também não",
        "Desconfie de alegações de saúde no rótulo",
        "Compare: mesma categoria, menos ingredientes = melhor escolha"
      ],
      quote: "O rótulo não mente — você só precisa aprender a lê-lo."
    }
  }
];

export interface FoodSubstitution {
  original: string;
  replacement: string;
  reason: string;
}

export const FOOD_SUBSTITUTIONS: FoodSubstitution[] = [
  { original: "Margarina", replacement: "Manteiga de pasto ou ghee", reason: "Gordura natural, sem óleos oxidados" },
  { original: "Óleo de soja/milho/girassol/canola", replacement: "Azeite, óleo de coco, banha ou sebo", reason: "Estáveis ao calor, anti-inflamatórios" },
  { original: "Arroz branco", replacement: "'Arroz' de couve-flor ou quinoa", reason: "Baixo índice glicêmico" },
  { original: "Macarrão de trigo", replacement: "Espaguete de abobrinha ou konjac", reason: "Sem glúten, baixo carb" },
  { original: "Pão francês", replacement: "Pão de frigideira (ovo + queijo)", reason: "Alto em proteína" },
  { original: "Refrigerante", replacement: "Água com gás + limão", reason: "Zero açúcar, refrescante" },
  { original: "Suco de caixinha", replacement: "Suco verde natural", reason: "Sem açúcar adicionado" },
  { original: "Iogurte adoçado", replacement: "Iogurte grego integral natural", reason: "Mais proteína, menos açúcar" },
  { original: "Biscoitos recheados", replacement: "Nozes, sementes ou queijo", reason: "Gordura boa, proteína" },
  { original: "Salgadinhos industriais", replacement: "Torresmo caseiro ou chips de couve", reason: "Sem óleos vegetais" },
  { original: "Molho de tomate pronto", replacement: "Tomate + azeite + alho caseiro", reason: "Sem açúcar e conservantes" },
  { original: "Temperos industriais (Sazon)", replacement: "Sal, alho, cebola, páprica, ervas", reason: "Sem glutamato e corantes" },
  { original: "Catchup/Mostarda industrial", replacement: "Versões caseiras ou naturais", reason: "Sem xarope de milho" },
  { original: "Cereal matinal", replacement: "Ovos mexidos + abacate", reason: "Proteína e gordura boa" },
  { original: "Leite desnatado", replacement: "Leite integral ou de coco", reason: "Gordura é necessária" }
];

export const APPROVED_FATS = [
  { name: "Manteiga de pasto", use: "Cozinhar, finalizar, passar no pão", temp: "Alta" },
  { name: "Ghee (manteiga clarificada)", use: "Frituras, refogados, café cetogênico", temp: "Muito alta" },
  { name: "Banha de porco", use: "Frituras, refogados, assar", temp: "Alta" },
  { name: "Sebo bovino", use: "Frituras, preparos tradicionais", temp: "Muito alta" },
  { name: "Azeite de oliva extra virgem", use: "Saladas, finalização (não fritar)", temp: "Baixa" },
  { name: "Óleo de coco virgem", use: "Cozinhar, café, receitas doces", temp: "Média-alta" },
  { name: "Gordura de pato/ganso", use: "Assar batatas, confit", temp: "Alta" }
];

export const CONDEMNED_OILS = [
  { name: "Óleo de soja", reason: "Alto em ômega-6, pró-inflamatório, instável" },
  { name: "Óleo de milho", reason: "Oxidação rápida, aldeídos tóxicos" },
  { name: "Óleo de girassol", reason: "Desequilíbrio ômega-6/ômega-3" },
  { name: "Óleo de canola", reason: "Processamento industrial pesado" },
  { name: "Margarina", reason: "Gordura trans, óleos hidrogenados" },
  { name: "Creme vegetal", reason: "Ultraprocessado, sem valor nutricional" }
];
