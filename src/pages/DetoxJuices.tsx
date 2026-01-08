import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Leaf, BookOpen, ChefHat, Lock, CheckCircle2, X, Flame, Droplets, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCard from "@/components/RecipeCard";
import { useProgress } from "@/hooks/useProgress";
import { loadProgress, completeOnboardingStep } from "@/services/progressService";

const DetoxJuices = () => {
  const navigate = useNavigate();
  const { completeNutrition } = useProgress();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  
  // Load from localStorage
  const savedProgress = loadProgress();
  const [completedChapters, setCompletedChapters] = useState<number[]>(savedProgress.nutrition.detox.completedChapters);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>(() => {
    const completed = savedProgress.nutrition.detox.completedChapters;
    const unlocked = [1];
    completed.forEach(c => {
      if (c + 1 <= 10 && !unlocked.includes(c + 1)) unlocked.push(c + 1);
    });
    return unlocked;
  });

  const chapters = [
    {
      id: 1,
      title: "O Que É Detox de Verdade",
      concept: "'Detox' vem de detoxificação, processo natural em duas fases: Fase I (o fígado transforma toxinas em substâncias intermediárias) e Fase II (o corpo elimina essas substâncias via bile, urina e suor).",
      science: "Nutrientes essenciais a esse ciclo: vitaminas A, C, E, zinco, magnésio, selênio, clorofila, fibras e água. Harvard Public Health (2022) comprova eficácia.",
      benefits: ["Limpeza celular natural", "Eliminação de toxinas", "Melhora da função hepática", "Regeneração celular"],
      tips: ["Priorize ingredientes frescos", "Beba logo após preparar", "Combine com hidratação adequada"],
      quote: "O detox verdadeiro não vem do extrato milagroso, mas da biologia feita por você."
    },
    {
      id: 2,
      title: "A Neurobiologia da Desintoxicação",
      concept: "Quando o corpo acumula toxinas e glicemia instável, o cérebro responde com fadiga e ansiedade. O detox fornece cetonas leves, antioxidantes e eletrólitos que restauram a neurocomunicação.",
      science: "Frontiers in Nutrition (2020) mostra que flavonoides presentes em couve, gengibre e limão exibem efeito protetor neural semelhante ao ômega-3.",
      benefits: ["Redução da fadiga mental", "Menos ansiedade", "Clareza cognitiva", "Neuroproteção"],
      tips: ["Inclua gengibre nos sucos", "Prefira couve fresca", "Use limão diariamente"],
      quote: "A mente clara é reflexo de um corpo limpo."
    },
    {
      id: 3,
      title: "Benefícios Cardíacos e Metabólicos",
      concept: "Sucos funcionais reduzem colesterol oxidado, inflamam menos o fígado e aliviam o retorno venoso.",
      science: "Journal of Cardiology (2022): suco verde diário por um mês reduziu triglicerídeos médios de 150 → 108 mg/dL.",
      benefits: ["Redução do colesterol", "Menos inflamação hepática", "Melhora circulatória", "Triglicerídeos controlados"],
      tips: ["Tome um suco verde por dia", "Mantenha consistência por 30 dias", "Combine com alimentação saudável"],
      quote: "O coração agradece cada gole de saúde."
    },
    {
      id: 4,
      title: "Fases Bioquímicas do Detox",
      concept: "Fase Hepática (enxofre, clorofila, vit. B6 e C), Renal (potássio, água, magnésio), Intestinal (fibras solúveis), Cutânea (zinco, selênio, vit. E), Linfática (vitamina C, clorofila, catequinas).",
      science: "Cada órgão tem nutrientes-chave específicos para otimizar sua função de eliminação de toxinas.",
      benefits: ["Suporte multi-orgânico", "Eliminação completa", "Equilíbrio sistêmico", "Limpeza profunda"],
      tips: ["Varie os ingredientes", "Cubra todas as fases", "Respeite o tempo de cada fase"],
      quote: "O corpo sabe se limpar — basta dar as ferramentas certas."
    },
    {
      id: 5,
      title: "Sucos e Queima de Gordura",
      concept: "Detox não é apenas 'limpar', mas também acelerar mitocôndrias e regular hormônios da saciedade. Vitaminas do complexo B e magnésio melhoram a oxidação de gordura.",
      science: "Metabolism Journal (2021): bebidas funcionais ricas em clorofila + ácido ascórbico aumentam em 17% o gasto energético pós-refeição.",
      benefits: ["Aceleração metabólica", "Maior queima calórica", "Regulação hormonal", "Energia sustentada"],
      tips: ["Adicione clorofila (couve, espinafre)", "Inclua vitamina C", "Tome pela manhã"],
      quote: "Queimar gordura começa com alimentar as mitocôndrias."
    },
    {
      id: 6,
      title: "Mitos e Verdades do Detox",
      concept: "❌ Ficar em jejum tomando sucos por dias = erro. ✅ Adicionar 1–2 copos por dia é suficiente para estimular o fígado sem perder massa magra.",
      science: "O detox extremo pode causar perda muscular e desequilíbrios. O moderado é cientificamente comprovado.",
      benefits: ["Abordagem equilibrada", "Preservação muscular", "Resultados sustentáveis", "Sem efeitos colaterais"],
      tips: ["Não substitua refeições completas", "Mantenha proteína adequada", "Use sucos como complemento"],
      quote: "O equilíbrio é a verdadeira sabedoria nutricional."
    },
    {
      id: 7,
      title: "Os Ingredientes do Povo",
      concept: "Tudo que está neste livro é barato e facilmente encontrado: couve, pepino, limão, maçã verde, gengibre, beterraba, cenoura, laranja, abacaxi, hortelã, chia, linhaça, vinagre de maçã.",
      science: "Não há necessidade de superfoods caros. Ingredientes locais têm o mesmo poder nutricional.",
      benefits: ["Economia real", "Acesso fácil", "Ingredientes frescos", "Sustentabilidade"],
      tips: ["Compre em feiras locais", "Prefira sazonais", "Armazene corretamente"],
      quote: "O poder está no simples, não no caro."
    },
    {
      id: 8,
      title: "Hidratação e Equilíbrio Mineral",
      concept: "A água é o 'solvente da vida'. Sem ela, o detox não funciona. Beba 30 a 35 ml por kg de peso corporal por dia.",
      science: "Pode incluir água com limão e sal rosa pela manhã para repor eletrólitos essenciais.",
      benefits: ["Hidratação celular", "Equilíbrio eletrolítico", "Função renal otimizada", "Eliminação eficiente"],
      tips: ["Calcule sua necessidade hídrica", "Comece o dia com água", "Adicione eletrólitos naturais"],
      quote: "Água é o primeiro ingrediente do detox."
    },
    {
      id: 9,
      title: "O Cuidado com o Açúcar Natural",
      concept: "Frutas têm frutose. Quando excedem 2 unidades por suco, o efeito detox reverte-se. Sempre prefira frutas ácidas ou verdes e acrescente fibras (chia/linhaça).",
      science: "O excesso de frutose sobrecarrega o fígado, anulando os benefícios do detox.",
      benefits: ["Glicemia estável", "Fígado preservado", "Efeito detox mantido", "Energia equilibrada"],
      tips: ["Limite a 1-2 frutas por suco", "Prefira maçã verde e limão", "Sempre adicione fibras"],
      quote: "Natural não significa ilimitado."
    },
    {
      id: 10,
      title: "A Psicologia da Desintoxicação",
      concept: "A liberação de toxinas é também emocional. Estudos em psicossomática mostram que a alimentação leve reduz cortisol, melhorando humor e concentração.",
      science: "A conexão intestino-cérebro influencia diretamente o bem-estar emocional.",
      benefits: ["Redução do cortisol", "Humor melhorado", "Maior concentração", "Bem-estar geral"],
      tips: ["Crie rituais de preparo", "Aprecie o momento", "Observe mudanças emocionais"],
      quote: "Não é o suco que cura, é o ritual de cuidar de si."
    },
    {
      id: 11,
      title: "O Balanço Entre Fibra e Líquido",
      concept: "Liquidificar demais sem fibras reduz o efeito. Use mix de folha + raiz + fruta + fonte de gordura boa para otimizar absorção de carotenos e vit. K.",
      science: "Fibras são essenciais para a eliminação intestinal e absorção de nutrientes lipossolúveis.",
      benefits: ["Absorção otimizada", "Eliminação intestinal", "Saciedade prolongada", "Nutrientes preservados"],
      tips: ["Não coe completamente", "Adicione chia ou linhaça", "Mantenha as fibras"],
      quote: "A fibra é o veículo do detox intestinal."
    },
    {
      id: 12,
      title: "Planejamento de 21 Dias",
      concept: "Fase 1 (1–7): limpar café, refri, álcool. Fase 2 (8–14): 1 suco detox por dia + Low Carb. Fase 3 (15–21): manter 2 sucos/dia (um de manhã, outro à noite).",
      science: "A progressão gradual permite adaptação do corpo e resultados sustentáveis.",
      benefits: ["Transição suave", "Adaptação gradual", "Resultados duradouros", "Hábitos formados"],
      tips: ["Siga as fases com disciplina", "Não pule etapas", "Anote seu progresso"],
      quote: "21 dias constroem um novo você."
    },
    {
      id: 13,
      title: "O Sistema Hepático",
      concept: "O fígado trabalha com glutationa. Alimentos ricos em enxofre (couve, alho, cebola) ajudam a formá-la.",
      science: "Liver Health Rev (2020): aumento de 23% na detoxificação hepática após 14 dias de sucos ricos em clorofila.",
      benefits: ["Glutationa elevada", "Fígado fortalecido", "Detox acelerado", "Proteção celular"],
      tips: ["Inclua couve diariamente", "Adicione alho quando possível", "Prefira ingredientes ricos em enxofre"],
      quote: "O fígado é o general da limpeza corporal."
    },
    {
      id: 14,
      title: "Detox e Cérebro Ansioso",
      concept: "O intestino é a fábrica de serotonina. Quando você limpa a alimentação, a mente fica leve.",
      science: "95% da serotonina é produzida no intestino. Saúde intestinal = saúde mental.",
      benefits: ["Mais serotonina", "Menos ansiedade", "Humor estável", "Clareza mental"],
      tips: ["Cuide do intestino primeiro", "Evite alimentos inflamatórios", "Mantenha regularidade"],
      quote: "A clareza mental é efeito colateral de um intestino saudável."
    },
    {
      id: 15,
      title: "Equilíbrio de Sódio e Potássio",
      concept: "Adicionar pitadas de sal rosa ou ½ banana verde mantém eletrólitos em ordem durante períodos de jejum leve.",
      science: "O equilíbrio sódio-potássio é crucial para função celular e hidratação adequada.",
      benefits: ["Eletrólitos balanceados", "Função celular otimizada", "Sem câimbras", "Energia estável"],
      tips: ["Use sal rosa com moderação", "Inclua potássio natural", "Monitore sinais de desequilíbrio"],
      quote: "Minerais são os maestros do corpo."
    },
    {
      id: 16,
      title: "Detox e Sono",
      concept: "Clorofila + magnésio aumentam melatonina endógena. Tome suco verde duas horas antes de dormir para sono profundo.",
      science: "O magnésio é cofator na produção de melatonina e relaxamento muscular.",
      benefits: ["Sono mais profundo", "Melatonina natural", "Relaxamento", "Recuperação noturna"],
      tips: ["Tome suco verde à noite", "Evite frutas muito doces", "Mantenha horário regular"],
      quote: "O sono é quando o corpo faz a limpeza profunda."
    },
    {
      id: 17,
      title: "Suco Não É Milagre",
      concept: "Ele otimiza sistemas existentes; não cura sozinho. O resultado depende de rotina alimentar, sono e hidratação.",
      science: "Sucos são ferramentas, não soluções mágicas. O contexto completo importa.",
      benefits: ["Expectativas realistas", "Resultados sustentáveis", "Abordagem holística", "Sem frustrações"],
      tips: ["Combine com boa alimentação", "Durma bem", "Mantenha hidratação"],
      quote: "O suco é o aliado, não o salvador."
    },
    {
      id: 18,
      title: "O Sistema Linfático",
      concept: "Movimento + sucos naturais facilitam a eliminação de toxinas via linfa. Caminhar ou dançar 15 min pós-suco aumenta em 20% a limpeza celular.",
      science: "O sistema linfático não tem bomba própria — depende do movimento para circular.",
      benefits: ["Linfa ativada", "Eliminação acelerada", "Imunidade fortalecida", "Desinchaço"],
      tips: ["Mova-se após o suco", "Faça alongamentos", "Caminhe 15 minutos"],
      quote: "Movimento é o bombeador da linfa."
    },
    {
      id: 19,
      title: "Sustentabilidade",
      concept: "Aproveite talos, folhas e casca de frutas (com limpeza adequada). Reduz lixo orgânico e mantém fibras ativas.",
      science: "Talos e cascas contêm alta concentração de nutrientes e fibras.",
      benefits: ["Zero desperdício", "Mais nutrientes", "Economia", "Consciência ambiental"],
      tips: ["Lave bem as cascas", "Use talos de couve", "Aproveite tudo"],
      quote: "Sustentabilidade começa na cozinha."
    },
    {
      id: 20,
      title: "O Corpo Que Volta a Confiar em Você",
      concept: "Ao final de 21 dias, o paladar se reeduca. O cérebro associa leveza a prazer.",
      science: "Neuroplasticidade permite que novos hábitos se tornem preferências genuínas.",
      benefits: ["Paladar reeducado", "Novos hábitos", "Prazer na leveza", "Liberdade alimentar"],
      tips: ["Celebre a conclusão", "Mantenha os hábitos", "Observe as mudanças"],
      quote: "Você não perde peso, você ganha liberdade."
    }
  ];

  const recipes = {
    morning: [
      { id: 1, name: "Couve + limão + gengibre", calories: 65, protein: 2, carbs: 10, fat: 1, instructions: "1 folha couve, ½ limão, 1 cm gengibre, 300 ml água; bata e coe.", benefit: "Ativa fígado" },
      { id: 2, name: "Pepino + maçã verde + hortelã", calories: 70, protein: 1, carbs: 13, fat: 0, instructions: "Bata todos os ingredientes com água gelada.", benefit: "Diurético" },
      { id: 3, name: "Abacaxi + couve + chia", calories: 95, protein: 2, carbs: 15, fat: 3, instructions: "Adicione 1 colher de chia ao suco batido.", benefit: "Fibras + vit. C" },
      { id: 4, name: "Cenoura + gengibre + limão", calories: 80, protein: 1, carbs: 14, fat: 1, instructions: "Processe a cenoura com gengibre e limão.", benefit: "Betacaroteno" },
      { id: 5, name: "Melancia + hortelã + limão", calories: 85, protein: 1, carbs: 16, fat: 0, instructions: "Bata a melancia com hortelã fresca.", benefit: "Hidratante" },
      { id: 6, name: "Laranja + couve + linhaça", calories: 110, protein: 2, carbs: 18, fat: 4, instructions: "Adicione 1 colher de linhaça triturada.", benefit: "Colesterol" },
      { id: 7, name: "Maçã verde + pepino + limão", calories: 70, protein: 1, carbs: 12, fat: 0, instructions: "Bata com água gelada e sirva.", benefit: "Glicemia" },
      { id: 8, name: "Beterraba + cenoura + limão", calories: 90, protein: 2, carbs: 17, fat: 0, instructions: "Processe tudo junto.", benefit: "Óxido nítrico" },
      { id: 9, name: "Couve + abacate pequeno", calories: 150, protein: 4, carbs: 8, fat: 12, instructions: "Bata até ficar cremoso.", benefit: "Saciedade" },
      { id: 10, name: "Água de coco + limão + chia", calories: 95, protein: 1, carbs: 10, fat: 4, instructions: "Misture e deixe a chia hidratar.", benefit: "Reidratação" },
      { id: 11, name: "Couve + maçã + hortelã", calories: 75, protein: 1, carbs: 12, fat: 1, instructions: "Bata com água gelada.", benefit: "Detox matinal" },
      { id: 12, name: "Pepino + limão + gengibre", calories: 60, protein: 1, carbs: 10, fat: 0, instructions: "Processe e coe levemente.", benefit: "Anti-inflamatório" },
      { id: 13, name: "Maçã verde + couve + gengibre", calories: 80, protein: 2, carbs: 14, fat: 1, instructions: "Bata todos os ingredientes.", benefit: "Imunidade" },
      { id: 14, name: "Abacaxi + hortelã + pepino", calories: 85, protein: 1, carbs: 15, fat: 0, instructions: "Sirva bem gelado.", benefit: "Digestivo" },
      { id: 15, name: "Laranja + cenoura + gengibre", calories: 90, protein: 2, carbs: 16, fat: 1, instructions: "Processe e beba fresco.", benefit: "Energia matinal" }
    ],
    hepatic: [
      { id: 16, name: "Couve + alecrim + limão", calories: 70, protein: 2, carbs: 12, fat: 0, instructions: "Bata couve com chá de alecrim frio.", benefit: "Hepatoprotetor" },
      { id: 17, name: "Maçã verde + vinagre de maçã + gengibre", calories: 65, protein: 0, carbs: 12, fat: 0, instructions: "Adicione 1 colher de vinagre.", benefit: "Gordura hepática" },
      { id: 18, name: "Abacaxi + hortelã + pepino", calories: 80, protein: 1, carbs: 14, fat: 0, instructions: "Bata e sirva gelado.", benefit: "Diurético" },
      { id: 19, name: "Laranja + cenoura + couve", calories: 100, protein: 2, carbs: 18, fat: 1, instructions: "Processe tudo junto.", benefit: "Vitaminas A e C" },
      { id: 20, name: "Beterraba + limão + chia", calories: 95, protein: 2, carbs: 17, fat: 3, instructions: "Adicione chia ao final.", benefit: "Circulação" },
      { id: 21, name: "Couve + água de coco + salsão", calories: 85, protein: 2, carbs: 14, fat: 0, instructions: "Bata com água de coco.", benefit: "pH equilibrado" },
      { id: 22, name: "Maçã + aipo + gengibre", calories: 90, protein: 1, carbs: 16, fat: 0, instructions: "Processe e sirva.", benefit: "Anti-inflamatório" },
      { id: 23, name: "Pepino + limão + hortelã", calories: 60, protein: 1, carbs: 11, fat: 0, instructions: "Bata com gelo.", benefit: "Drenante" },
      { id: 24, name: "Couve + cenoura + chia", calories: 90, protein: 2, carbs: 14, fat: 3, instructions: "Adicione chia triturada.", benefit: "Ômega-3" },
      { id: 25, name: "Mamão pequeno + linhaça", calories: 110, protein: 1, carbs: 16, fat: 5, instructions: "Bata até cremoso.", benefit: "Intestino" },
      { id: 26, name: "Couve + maçã + limão", calories: 80, protein: 1, carbs: 14, fat: 0, instructions: "Clássico detox.", benefit: "Regeneração" },
      { id: 27, name: "Abacaxi + couve + gengibre", calories: 85, protein: 2, carbs: 15, fat: 1, instructions: "Bata com água gelada.", benefit: "Digestão" },
      { id: 28, name: "Cenoura + beterraba + laranja", calories: 95, protein: 2, carbs: 18, fat: 0, instructions: "Processe tudo.", benefit: "Energia" },
      { id: 29, name: "Pepino + maçã + aipo", calories: 70, protein: 1, carbs: 12, fat: 0, instructions: "Sirva bem frio.", benefit: "Detox leve" },
      { id: 30, name: "Couve + abacaxi + hortelã", calories: 90, protein: 2, carbs: 16, fat: 1, instructions: "Refrescante e detox.", benefit: "Fígado" }
    ],
    night: [
      { id: 31, name: "Couve + camomila + limão", calories: 60, protein: 1, carbs: 10, fat: 0, instructions: "Bata com chá frio de camomila.", benefit: "Relaxante" },
      { id: 32, name: "Pepino + maçã + hortelã", calories: 75, protein: 1, carbs: 13, fat: 0, instructions: "Servir gelado.", benefit: "Calmante" },
      { id: 33, name: "Abacate + leite de coco + cacau", calories: 180, protein: 3, carbs: 8, fat: 15, instructions: "Mistura cremosa.", benefit: "Saciante" },
      { id: 34, name: "Beterraba + laranja", calories: 95, protein: 1, carbs: 16, fat: 0, instructions: "Processar sem coar.", benefit: "Relaxar circulação" },
      { id: 35, name: "Maçã verde + limão", calories: 70, protein: 1, carbs: 13, fat: 0, instructions: "Simples e efetivo.", benefit: "Alcalino" },
      { id: 36, name: "Suco verde com chá verde", calories: 65, protein: 2, carbs: 10, fat: 0, instructions: "Misture chá verde pronto + couve.", benefit: "Queima noturna" },
      { id: 37, name: "Cenoura + abacate", calories: 120, protein: 2, carbs: 7, fat: 9, instructions: "Bata cremoso.", benefit: "Antioxidante" },
      { id: 38, name: "Água de coco + limão + capim-limão", calories: 80, protein: 1, carbs: 12, fat: 0, instructions: "Bata e beba frio.", benefit: "Sono profundo" },
      { id: 39, name: "Couve + hortelã + abacate", calories: 150, protein: 3, carbs: 7, fat: 11, instructions: "Textura creme.", benefit: "Refaz fibras" },
      { id: 40, name: "Chuchu + maçã", calories: 70, protein: 1, carbs: 13, fat: 0, instructions: "Cozinhe rapidamente e liquidifique.", benefit: "Leve digestão" },
      { id: 41, name: "Limão + pepino + hortelã", calories: 60, protein: 1, carbs: 9, fat: 0, instructions: "Clássico frescor.", benefit: "Drenante" },
      { id: 42, name: "Laranja + cenoura + linhaça", calories: 110, protein: 2, carbs: 17, fat: 4, instructions: "Fonte de vitaminas.", benefit: "Vit. A + E" },
      { id: 43, name: "Maçã verde + chá hortelã", calories: 70, protein: 1, carbs: 12, fat: 0, instructions: "Bata com chá gelado.", benefit: "Calmante" },
      { id: 44, name: "Abacaxi + couve + erva-doce", calories: 95, protein: 1, carbs: 16, fat: 0, instructions: "Adicione erva-doce fresca.", benefit: "Digestivo" },
      { id: 45, name: "Água morning", calories: 15, protein: 0, carbs: 2, fat: 0, instructions: "Água + limão + sal rosa em jejum.", benefit: "Reposição mineral" },
      { id: 46, name: "Couve + maçã + camomila", calories: 75, protein: 1, carbs: 13, fat: 0, instructions: "Bata com chá de camomila.", benefit: "Sono" },
      { id: 47, name: "Pepino + limão + gengibre", calories: 55, protein: 1, carbs: 9, fat: 0, instructions: "Refrescante noturno.", benefit: "Digestão" },
      { id: 48, name: "Beterraba + maçã + limão", calories: 85, protein: 1, carbs: 15, fat: 0, instructions: "Processe tudo.", benefit: "Relaxamento" },
      { id: 49, name: "Couve + água de coco", calories: 70, protein: 2, carbs: 11, fat: 0, instructions: "Hidratante noturno.", benefit: "Eletrólitos" },
      { id: 50, name: "Abacate + cacau + mel", calories: 160, protein: 2, carbs: 12, fat: 12, instructions: "Sobremesa saudável.", benefit: "Saciedade" }
    ]
  };

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters([...completedChapters, chapterId]);
      completeNutrition("detox", chapterId);
      if (chapterId < 20 && !unlockedChapters.includes(chapterId + 1)) {
        setUnlockedChapters([...unlockedChapters, chapterId + 1]);
      }
      // Marca o passo de onboarding (nutrição = step 1)
      completeOnboardingStep(1);
    }
    setSelectedChapter(null);
  };

  const isChapterLocked = (chapterId: number) => !unlockedChapters.includes(chapterId);
  const isChapterCompleted = (chapterId: number) => completedChapters.includes(chapterId);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={() => navigate("/nutricao")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Sucos Detox</h1>
            <p className="text-sm text-white/60">Limpeza celular inteligente</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
          <Leaf className="w-10 h-10 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">A Ciência da Limpeza Celular</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            O detox verdadeiro não vem do extrato milagroso, mas da soma entre nutrição, leveza e biologia feita por você. 
            Sucos naturais são ferramentas para reacender o metabolismo de limpeza.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
            <BookOpen className="w-4 h-4" />
            <span>Harvard Public Health (2022)</span>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold text-green-400">{completedChapters.length}</div>
            <div className="text-xs text-white/60">Concluídos</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold text-[#FFD580]">{20 - completedChapters.length}</div>
            <div className="text-xs text-white/60">Restantes</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold text-[#FF6B6B]">{Math.round((completedChapters.length / 20) * 100)}%</div>
            <div className="text-xs text-white/60">Progresso</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="chapters" 
              className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Capítulos
            </TabsTrigger>
            <TabsTrigger 
              value="recipes"
              className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg"
            >
              <ChefHat className="w-4 h-4 mr-2" />
              Receitas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="mt-4 space-y-3">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isChapterLocked(chapter.id) && setSelectedChapter(chapter.id)}
                className={`relative overflow-hidden rounded-xl p-4 border transition-all cursor-pointer ${
                  isChapterLocked(chapter.id)
                    ? "bg-white/5 border-white/10 opacity-50"
                    : isChapterCompleted(chapter.id)
                    ? "bg-green-500/20 border-green-500/40"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-500/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isChapterCompleted(chapter.id)
                      ? "bg-green-500"
                      : isChapterLocked(chapter.id)
                      ? "bg-white/10"
                      : "bg-white/10"
                  }`}>
                    {isChapterLocked(chapter.id) ? (
                      <Lock className="w-5 h-5 text-white/40" />
                    ) : isChapterCompleted(chapter.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-bold">{chapter.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{chapter.title}</h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-1">{chapter.concept}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="recipes" className="mt-4 space-y-6">
            {/* Morning */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌅</span> Fase Matinal
              </h3>
              <div className="space-y-2">
                {recipes.morning.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{recipe.name}</h4>
                      <span className="text-xs text-green-400">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF6B6B]" /> {recipe.protein}g prot
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#FFD580]" /> {recipe.carbs}g carb
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-green-400" /> {recipe.fat}g gord
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hepatic */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌞</span> Fase Hepática
              </h3>
              <div className="space-y-2">
                {recipes.hepatic.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{recipe.name}</h4>
                      <span className="text-xs text-green-400">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF6B6B]" /> {recipe.protein}g prot
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#FFD580]" /> {recipe.carbs}g carb
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-green-400" /> {recipe.fat}g gord
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Night */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌙</span> Fase Noturna
              </h3>
              <div className="space-y-2">
                {recipes.night.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{recipe.name}</h4>
                      <span className="text-xs text-green-400">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF6B6B]" /> {recipe.protein}g prot
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#FFD580]" /> {recipe.carbs}g carb
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-green-400" /> {recipe.fat}g gord
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chapter Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSelectedChapter(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#1A1A1A] rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#1A1A1A] p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-bold">Capítulo {selectedChapter}</h2>
                <button 
                  onClick={() => setSelectedChapter(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {chapters.find(c => c.id === selectedChapter) && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">
                      {chapters.find(c => c.id === selectedChapter)?.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-[#FFD580] mb-2">💡 Conceito</h4>
                      <p className="text-sm text-white/70">{chapters.find(c => c.id === selectedChapter)?.concept}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-green-400 mb-2">🔬 Base Científica</h4>
                      <p className="text-sm text-white/70">{chapters.find(c => c.id === selectedChapter)?.science}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-[#FF6B6B] mb-2">✨ Benefícios</h4>
                      <ul className="space-y-1">
                        {chapters.find(c => c.id === selectedChapter)?.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#FF6B6B]" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-emerald-400 mb-2">🎯 Dicas Práticas</h4>
                      <ul className="space-y-1">
                        {chapters.find(c => c.id === selectedChapter)?.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-white/70">• {tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-transparent rounded-xl p-4 border-l-4 border-green-500">
                      <p className="text-sm italic text-white/80">
                        "{chapters.find(c => c.id === selectedChapter)?.quote}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCompleteChapter(selectedChapter)}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      isChapterCompleted(selectedChapter)
                        ? "bg-white/10 text-white/50"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                    }`}
                    disabled={isChapterCompleted(selectedChapter)}
                  >
                    {isChapterCompleted(selectedChapter) ? "Capítulo Concluído ✓" : "Concluir e Desbloquear Próximo"}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#1A1A1A] rounded-t-3xl"
            >
              {(() => {
                const recipe = [...recipes.morning, ...recipes.hepatic, ...recipes.night].find(r => r.id === selectedRecipe);
                if (!recipe) return null;
                
                return (
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{recipe.name}</h3>
                      <button 
                        onClick={() => setSelectedRecipe(null)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-green-500/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-green-400">{recipe.calories}</div>
                        <div className="text-xs text-white/60">kcal</div>
                      </div>
                      <div className="bg-[#FF6B6B]/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#FF6B6B]">{recipe.protein}g</div>
                        <div className="text-xs text-white/60">prot</div>
                      </div>
                      <div className="bg-[#FFD580]/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#FFD580]">{recipe.carbs}g</div>
                        <div className="text-xs text-white/60">carb</div>
                      </div>
                      <div className="bg-emerald-500/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">{recipe.fat}g</div>
                        <div className="text-xs text-white/60">gord</div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-green-400 mb-2">📝 Modo de Preparo</h4>
                      <p className="text-sm text-white/70">{recipe.instructions}</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-transparent rounded-xl p-4 border-l-4 border-green-500">
                      <h4 className="text-sm font-semibold text-green-400 mb-1">✨ Benefício</h4>
                      <p className="text-sm text-white/70">{recipe.benefit}</p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetoxJuices;
