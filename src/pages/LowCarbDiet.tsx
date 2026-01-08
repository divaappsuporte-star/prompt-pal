import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Salad, 
  Brain, 
  Flame, 
  Heart, 
  Zap, 
  Clock, 
  Target, 
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Lock,
  Activity,
  Droplets,
  Scale,
  Moon,
  Dumbbell,
  Leaf,
  Calendar,
  Coffee,
  Sun,
  UtensilsCrossed,
  Unlock
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import { useProgress } from "@/hooks/useProgress";
import { loadProgress } from "@/services/progressService";

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: {
    intro: string;
    science?: string;
    benefits?: string[];
    tips?: string[];
    quote?: string;
  };
}

interface Recipe {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  instructions: string;
}

const LowCarbDiet = () => {
  const navigate = useNavigate();
  const { completeNutrition } = useProgress();
  const [activeTab, setActiveTab] = useState("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  
  // Load from localStorage
  const savedProgress = loadProgress();
  const [completedChapters, setCompletedChapters] = useState<number[]>(savedProgress.nutrition.lowcarb.completedChapters);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>(() => {
    const completed = savedProgress.nutrition.lowcarb.completedChapters;
    const unlocked = [1, 2, 3];
    completed.forEach(c => {
      if (c + 1 <= 20 && !unlocked.includes(c + 1)) unlocked.push(c + 1);
    });
    return unlocked;
  });

  const chapters: Chapter[] = [
    {
      id: 1,
      title: "A Mente Glicemizada",
      subtitle: "Como os picos de açúcar alteram seu cérebro",
      icon: Brain,
      content: {
        intro: "Quando você come pão, arroz ou açúcar refinado, ocorre uma explosão de glicose no sangue. O pâncreas libera insulina e armazena glicose extra em forma de gordura. Logo após a subida, vem a queda — e o cérebro interpreta esse declínio como 'fome urgente'. Esse ciclo cria dependência química.",
        science: "Nature Neuroscience (2018): carboidratos simples ativam as mesmas vias dopaminérgicas de drogas leves. A Dieta Low Carb quebra esse ciclo, estabilizando o humor e resetando o comando da fome.",
        benefits: ["Quebra do ciclo de dependência de açúcar", "Estabilização do humor", "Controle natural da fome"],
        tips: ["Elimine açúcar refinado gradualmente", "Substitua pão por ovos no café da manhã", "Observe seus gatilhos de 'fome urgente'"],
      },
    },
    {
      id: 2,
      title: "Mecanismo Metabólico",
      subtitle: "Mudando a fonte de energia",
      icon: Flame,
      content: {
        intro: "A Low Carb ensina o corpo a usar gordura como combustível. Ao reduzir carboidratos, há queda de insulina — o hormônio que impede queimar gordura — e aumento da lipólise (uso de gordura corporal).",
        science: "Journal of Metabolic Research (2021): 60% dos indivíduos em Low Carb mostraram aumento de 38% na oxidação de gordura após 10 dias.",
        benefits: ["Aumento de 38% na oxidação de gordura", "Queda da insulina", "Lipólise acelerada"],
      },
    },
    {
      id: 3,
      title: "Equilíbrio dos Macronutrientes",
      subtitle: "A distribuição ideal",
      icon: Scale,
      content: {
        intro: "Distribuição ideal: 20–25% carboidratos (60–100g/dia), 40% proteína, 35–40% gordura boa. Carboidratos vêm principalmente de verduras, legumes cozidos e uma fruta de baixo índice glicêmico por dia.",
        science: "Harvard School of Public Health (2023) demonstrou que adultos em regime Low Carb reduziram 34% dos triglicerídeos e 12% da gordura visceral em 8 semanas.",
        tips: ["60-100g de carboidratos por dia", "Priorize verduras e legumes cozidos", "Uma fruta de baixo IG por dia"],
        quote: "Rotina que o corpo entende, digestão leve, energia constante.",
      },
    },
    {
      id: 4,
      title: "Efeito Hormonal Benéfico",
      subtitle: "Hormônios trabalhando a seu favor",
      icon: Heart,
      content: {
        intro: "A Low Carb diminui a insulina e estabiliza leptina, o que reduz fome e compulsão. Também aumenta o GH (hormônio do crescimento) e a testosterona natural.",
        science: "Endocrine Reviews (2020): em 4 semanas de Low Carb, o GH sobe em média 27%, melhorando recuperação e tônus muscular.",
        benefits: ["Insulina reduzida", "Leptina estabilizada", "GH aumentado em 27%", "Testosterona natural elevada"],
      },
    },
    {
      id: 5,
      title: "O Mito do Carboidrato Essencial",
      subtitle: "A verdade sobre a glicose",
      icon: BookOpen,
      content: {
        intro: "O corpo não precisa de glicose externa: o fígado fabrica o que for necessário através da gliconeogênese. A falta de carboidrato não causa fadiga se há gordura e proteína suficientes.",
        science: "Frontiers in Nutrition (2021) comprova a eficiência metabólica sem carboidratos externos.",
        quote: "Seu corpo não sente falta de pão; sente falta de equilíbrio hormonal.",
      },
    },
    {
      id: 6,
      title: "Fase de Adaptação (14 Dias)",
      subtitle: "Os primeiros passos",
      icon: Calendar,
      content: {
        intro: "Durante a adaptação, o corpo reduz glicogênio e aumenta queima de gordura. Podem ocorrer dor de cabeça ou fraqueza leve — resolvidas com sal e água.",
        science: "Após dez dias, surge uma energia estável e duradoura. O corpo completa a transição metabólica.",
        tips: [
          "Aumente sal (½ colher chá/dia)",
          "Hidratação = 2 a 3 litros de água/dia",
          "Inclua ovos extras ou abacate com gordura boa"
        ],
      },
    },
    {
      id: 7,
      title: "Alimentos Base Brasileiros",
      subtitle: "O que cabe no bolso",
      icon: UtensilsCrossed,
      content: {
        intro: "Priorize o que existe em qualquer mercado: Proteínas (patinho, coxão mole, peito de frango, pernil, lombo, ovos, sardinha). Gorduras (manteiga, banha de porco, azeite de oliva, abacate). Carbos bons (abobrinha, berinjela, pepino, alface, couve, morango ou maçã verde).",
        tips: [
          "Proteínas: patinho, coxão mole, frango, pernil, ovos, sardinha",
          "Gorduras: manteiga, banha, azeite, abacate",
          "Carbos: abobrinha, berinjela, pepino, alface, couve"
        ],
        quote: "Nada de exotismos ou importados.",
      },
    },
    {
      id: 8,
      title: "Hidratação como Terapia",
      subtitle: "Água é remédio hormonal",
      icon: Droplets,
      content: {
        intro: "A água ajuda a reduzir retenção, melhora rim e fígado e regula a leptina. Adicione uma pitada de sal rosa e suco de limão na água da manhã para recuperar eletrólitos.",
        benefits: ["Reduz retenção de líquidos", "Melhora função renal e hepática", "Regula a leptina"],
        tips: ["2-3 litros de água por dia", "Sal rosa na água da manhã", "Limão para eletrólitos"],
      },
    },
    {
      id: 9,
      title: "Impacto Cardiosaúde",
      subtitle: "Coração protegido",
      icon: Heart,
      content: {
        intro: "Low Carb reduz triglicerídeos e LDL oxidado, melhora HDL e glicemia. É uma das estratégias mais eficazes para saúde cardiovascular.",
        science: "BMJ 2021: pacientes diabéticos em Low Carb diminuíram remédios em 35% sem prejuízo ao colesterol.",
        benefits: ["Triglicerídeos reduzidos", "HDL melhorado", "Glicemia controlada", "Menos remédios para diabéticos"],
      },
    },
    {
      id: 10,
      title: "Clareza Mental Cetônica",
      subtitle: "A energia do cérebro",
      icon: Brain,
      content: {
        intro: "Quando o cérebro usa corpos cetônicos (vindos da gordura), há menos oscilação de dopamina. Logo: menor vontade de doce e mais foco.",
        science: "Nature Metabolism (2020): cetonas geradas pela Low Carb aumentam produção de BDNF, proteína de memória.",
        benefits: ["Menos vontade de doce", "Foco mental aumentado", "BDNF elevado (proteína de memória)"],
      },
    },
    {
      id: 11,
      title: "Low Carb e Treinos",
      subtitle: "Performance mantida",
      icon: Dumbbell,
      content: {
        intro: "Carboidrato baixo não enche o músculo de água, mas mantém força constante. Use fruta antes do treino se precisar de impulso.",
        tips: [
          "Fruta de baixo IG antes do treino (se necessário)",
          "Pós-treino: bife magro + ovo",
          "Recuperação completa sem picos de insulina"
        ],
      },
    },
    {
      id: 12,
      title: "Vitaminas e Minerais",
      subtitle: "Os cofatores essenciais",
      icon: Leaf,
      content: {
        intro: "Zinco (do ovo e carne); magnésio (do legume verde); selênio (sardinha). Esses minerais são cofatores de enzimas metabólicas e mantêm hormônios ativos.",
        benefits: ["Zinco: ovos e carne", "Magnésio: legumes verdes", "Selênio: sardinha"],
        tips: ["Inclua sardinha 2x por semana", "Coma folhas verdes diariamente", "Ovos são fonte completa"],
      },
    },
    {
      id: 13,
      title: "Desapego Emocional",
      subtitle: "Mente e comida em paz",
      icon: Brain,
      content: {
        intro: "Sem alterações bruscas de glicose, o cérebro se liberta do reforço emocional do açúcar. Dormir melhor, pensar melhor e se relacionar melhor com a comida é efeito neuroquímico.",
        quote: "Quando a mente entende que fome não é emoção, nasce a disciplina leve.",
        benefits: ["Sono melhorado", "Pensamento mais claro", "Relação saudável com comida"],
      },
    },
    {
      id: 14,
      title: "Saída do Platô",
      subtitle: "Quando o corpo trava",
      icon: Activity,
      content: {
        intro: "Mesmo sem contar calorias, o corpo pode 'travar'. Alterne dias com carboidratos bons (1 porção de mandioquinha) a cada 7 dias para reativar o metabolismo.",
        tips: [
          "1 dia de carb bom a cada 7 dias",
          "Mandioquinha ou batata doce",
          "Não exagere na quantidade",
          "Observe a resposta do corpo"
        ],
      },
    },
    {
      id: 15,
      title: "Plano Alimentar 21 Dias",
      subtitle: "Estrutura completa",
      icon: Calendar,
      content: {
        intro: "Um plano estruturado para sua transformação. Fase 1 (1-7): Cortar açúcar e pães, incluir proteína e legumes. Fase 2 (8-14): Inserir fruta baixa IG e variação de carne. Fase 3 (15-21): Ciclar carboidratos bons 1x/semana.",
        tips: [
          "Fase 1: Cortar açúcar e pães, reduzir inchaço",
          "Fase 2: Inserir fruta baixa IG, equilibrar energia",
          "Fase 3: Ciclar carbs bons, estabilizar peso"
        ],
        benefits: ["Redução de inchaço na fase 1", "Energia equilibrada na fase 2", "Peso estabilizado na fase 3"],
      },
    },
    {
      id: 16,
      title: "Quebrar o Jejum",
      subtitle: "Como sair corretamente",
      icon: Clock,
      content: {
        intro: "Evite sair comendo carboidrato. Prefira proteína + gordura: ovo, abacate, carne magra. Assim a insulina permanece baixa e você mantém foco e energia.",
        tips: [
          "Quebrar jejum com proteína + gordura",
          "Evitar carboidrato na primeira refeição",
          "Ovo, abacate ou carne magra são ideais"
        ],
      },
    },
    {
      id: 17,
      title: "Digestão Eficiente",
      subtitle: "Absorção otimizada",
      icon: Target,
      content: {
        intro: "Coma devagar, mastigue bem. Não exagere em fibra crua no início — hortaliças cozidas melhoram absorção. Higienize tudo com vinagre ou limão.",
        tips: [
          "Comer devagar, mastigar bem",
          "Hortaliças cozidas no início",
          "Higienizar com vinagre ou limão"
        ],
      },
    },
    {
      id: 18,
      title: "Mitos Comuns",
      subtitle: "Verdades reveladas",
      icon: BookOpen,
      content: {
        intro: "'Vou perder músculo' - Falso, proteína conserva. 'Vou sentir fraqueza' - Apenas enquanto o corpo adapta. 'Não posso viver sem arroz' - Depois de 21 dias, nem vai querer.",
        benefits: [
          "❌ 'Vou perder músculo' → Proteína conserva",
          "❌ 'Vou sentir fraqueza' → Só na adaptação",
          "❌ 'Não posso viver sem arroz' → Em 21 dias você esquece"
        ],
      },
    },
    {
      id: 19,
      title: "O Papel dos Hábitos",
      subtitle: "Rotina que transforma",
      icon: Target,
      content: {
        intro: "Anotar refeições ajuda o cérebro a padronizar rotina. Use checklist de 21 dias para refeições e sono regular.",
        science: "Behavioral Psychology (2020) mostra que perder peso sem anotar é 50% menos efetivo.",
        tips: [
          "Anote todas as refeições",
          "Use checklist de 21 dias",
          "Mantenha horários regulares de sono"
        ],
      },
    },
    {
      id: 20,
      title: "Constância em 21 Dias",
      subtitle: "O cérebro reprogramado",
      icon: CheckCircle2,
      content: {
        intro: "21 dias é tempo médio para criar rotina. Repita as refeições, não a culpa. A mente aprende consistência na simplicidade.",
        quote: "Não é sobre perder peso, é sobre nunca mais voltar ao caos alimentar.",
        benefits: [
          "⬇ Perda de 2 a 6 kg sem fome",
          "📏 Redução de 5-9 cm de cintura",
          "😴 Melhoria no sono e humor",
          "🧠 Clareza mental acelerada"
        ],
      },
    },
  ];

  const breakfastRecipes: Recipe[] = [
    { name: "Omelete de ovos com queijo", calories: 250, protein: 14, fat: 20, carbs: 1, instructions: "Bater ovos, assar na frigideira com queijo." },
    { name: "Ovos mexidos com abacate", calories: 320, protein: 13, fat: 26, carbs: 3, instructions: "Misture ovos e fatias de abacate." },
    { name: "Café + ovo + queijo coalho", calories: 220, protein: 12, fat: 16, carbs: 1, instructions: "Rápido e energético." },
    { name: "Panqueca de ovo com linhaça", calories: 290, protein: 15, fat: 22, carbs: 4, instructions: "Bata tudo e asse 2 min cada lado." },
    { name: "Omelete de carne moída 100g", calories: 350, protein: 28, fat: 23, carbs: 2, instructions: "Refogue carne, misture ao ovo." },
    { name: "Ovo cozido + frango desfiado", calories: 260, protein: 22, fat: 19, carbs: 1, instructions: "Sirva morno com azeite." },
    { name: "Ovo frito no ghee + tomate", calories: 240, protein: 13, fat: 21, carbs: 2, instructions: "Refogue tomate antes do ovo." },
    { name: "Omelete duplo frango e ovo", calories: 330, protein: 25, fat: 25, carbs: 2, instructions: "Dourar 4 min." },
    { name: "Músculo desfiado + ovo cozido", calories: 280, protein: 27, fat: 18, carbs: 1, instructions: "Reaproveite carne da noite anterior." },
    { name: "Abacate com colágeno e chia", calories: 210, protein: 6, fat: 18, carbs: 5, instructions: "Misture tudo e consuma frio." },
  ];

  const lunchRecipes: Recipe[] = [
    { name: "Bife de alcatra com salada verde", calories: 380, protein: 30, fat: 25, carbs: 6, instructions: "Grelhar bife, acompanhar folhas e azeite." },
    { name: "Carne moída com abobrinha", calories: 360, protein: 27, fat: 24, carbs: 5, instructions: "Refogar carne + abobrinha ralada." },
    { name: "Frango grelhado + purê de couve-flor", calories: 390, protein: 32, fat: 20, carbs: 8, instructions: "Cozinhar couve-flor e bater com manteiga." },
    { name: "Bisteca suína + salada de repolho", calories: 420, protein: 30, fat: 30, carbs: 4, instructions: "Fritar em banha, repolho cru com azeite." },
    { name: "Coxão mole ensopado com legume", calories: 400, protein: 35, fat: 25, carbs: 7, instructions: "Cozinhe carne + cenoura em cubos." },
    { name: "Omelete de 3 ovos + folhas cozidas", calories: 290, protein: 18, fat: 21, carbs: 4, instructions: "Misture espinafre ou couve." },
    { name: "Pernil suíno grelhado + pepino", calories: 410, protein: 29, fat: 28, carbs: 3, instructions: "Grelhar 8 min + sirva com pepino." },
    { name: "Sardinha na frigideira + limão", calories: 280, protein: 26, fat: 18, carbs: 1, instructions: "15 min em fogo baixo." },
    { name: "Caldo rico de músculo + ovo", calories: 330, protein: 27, fat: 22, carbs: 2, instructions: "Cozinhar com ossos e adicionar ovo." },
    { name: "Patinho moído com berinjela", calories: 350, protein: 30, fat: 20, carbs: 6, instructions: "Refogar tudo junto, azeite." },
  ];

  const dinnerRecipes: Recipe[] = [
    { name: "Frango ensopado simples", calories: 340, protein: 28, fat: 22, carbs: 3, instructions: "Cozinhar 15 min com sal." },
    { name: "Carne moída + ovo cozido", calories: 310, protein: 26, fat: 21, carbs: 2, instructions: "Misturar em frigideira." },
    { name: "Alcatra em tiras + salada fria", calories: 360, protein: 30, fat: 24, carbs: 4, instructions: "Cozinha rápida e refrescante." },
    { name: "Pernil suíno + legumes cozidos", calories: 410, protein: 32, fat: 28, carbs: 6, instructions: "15 min de panela de pressão." },
    { name: "Ovos recheados com carne moída", calories: 340, protein: 28, fat: 23, carbs: 2, instructions: "Abrir ovos cozidos e rechear." },
    { name: "Hambúrguer caseiro duplo", calories: 420, protein: 34, fat: 29, carbs: 3, instructions: "Dois discos de carne, grelha rápida." },
    { name: "Frango assado na manteiga", calories: 350, protein: 30, fat: 25, carbs: 2, instructions: "Forno 180°C / 40 min." },
    { name: "Coxão mole cozido com alho", calories: 380, protein: 31, fat: 26, carbs: 3, instructions: "Pressão 35 min." },
    { name: "Caldo de osso + ovo mexido", calories: 260, protein: 24, fat: 17, carbs: 1, instructions: "Misturar ovo ao caldo." },
    { name: "Músculo desfiado na banha", calories: 390, protein: 32, fat: 28, carbs: 0, instructions: "Refogar até dourar." },
  ];

  const isChapterUnlocked = (chapterId: number) => unlockedChapters.includes(chapterId);
  const isChapterCompleted = (chapterId: number) => completedChapters.includes(chapterId);

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters(prev => [...prev, chapterId]);
      completeNutrition("lowcarb", chapterId);
    }
    
    const nextChapterId = chapterId + 1;
    if (nextChapterId <= chapters.length && !unlockedChapters.includes(nextChapterId)) {
      setUnlockedChapters(prev => [...prev, nextChapterId]);
    }
    
    setSelectedChapter(null);
  };

  const completedCount = completedChapters.length;
  const progress = Math.round((completedCount / chapters.length) * 100);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/nutricao")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Dieta Low Carb
            </h1>
            <p className="text-sm text-muted-foreground">Nutrição, Hormônios e Reprogramação</p>
          </div>
        </div>
      </motion.header>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-4"
      >
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Salad className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seu progresso</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {completedCount} de {chapters.length} capítulos
                </p>
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-accent">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
            />
          </div>
        </div>
      </motion.div>

      {/* Introduction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-2"
      >
        <div className="glass-card rounded-2xl p-5 border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                A Ciência do Menos
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Os maiores vilões da saúde moderna são o excesso de açúcar e de farinhas refinadas. 
                A Dieta Low Carb devolve o metabolismo ao seu modo natural: pouca glicose, mais gordura boa, muita proteína.
              </p>
              <p className="text-sm text-accent mt-3 italic">
                "Não é sobre cortar tudo; é sobre aprender a dar ao corpo o combustível certo."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === "chapters"
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            Capítulos
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === "recipes"
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === "chapters" ? (
          <motion.div
            key="chapters"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-6"
          >
            <div className="space-y-3">
              {chapters.map((chapter, index) => {
                const unlocked = isChapterUnlocked(chapter.id);
                const completed = isChapterCompleted(chapter.id);
                
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.03 }}
                    whileHover={{ scale: unlocked ? 1.02 : 1 }}
                    whileTap={{ scale: unlocked ? 0.98 : 1 }}
                    onClick={() => unlocked && setSelectedChapter(chapter)}
                    className={`
                      glass-card rounded-xl p-4 cursor-pointer
                      border transition-all duration-300
                      ${unlocked 
                        ? "border-accent/20 hover:border-accent/40" 
                        : "border-border/30 opacity-60"
                      }
                      ${completed ? "bg-accent/5" : ""}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${completed 
                          ? "bg-accent/30" 
                          : unlocked 
                            ? "bg-muted/50" 
                            : "bg-muted/30"
                        }
                      `}>
                        {unlocked ? (
                          <chapter.icon 
                            size={22} 
                            className={completed ? "text-accent" : "text-foreground/70"} 
                          />
                        ) : (
                          <Lock size={18} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-accent font-medium">
                            Capítulo {chapter.id}
                          </span>
                          {completed && (
                            <CheckCircle2 size={14} className="text-accent" />
                          )}
                        </div>
                        <h3 className="font-display font-semibold text-foreground truncate">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {chapter.subtitle}
                        </p>
                      </div>
                      {unlocked && (
                        <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="recipes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 space-y-6"
          >
            {/* Breakfast */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Coffee size={20} className="text-accent" />
                <h3 className="font-display font-bold text-foreground">Café da Manhã</h3>
              </div>
              <div className="space-y-2">
                {breakfastRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    diet="lowcarb"
                    accentColor="text-accent"
                  />
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sun size={20} className="text-accent" />
                <h3 className="font-display font-bold text-foreground">Almoço</h3>
              </div>
              <div className="space-y-2">
                {lunchRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    delay={0.5}
                    diet="lowcarb"
                    accentColor="text-accent"
                  />
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={20} className="text-accent" />
                <h3 className="font-display font-bold text-foreground">Jantar</h3>
              </div>
              <div className="space-y-2">
                {dinnerRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    delay={1}
                    diet="lowcarb"
                    accentColor="text-accent"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Detail Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="min-h-screen pb-24"
            >
              {/* Modal Header */}
              <div className="px-6 pt-12 pb-4">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChapter(null)}
                    className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
                  >
                    <ArrowLeft size={20} className="text-foreground" />
                  </motion.button>
                  <div>
                    <p className="text-sm text-accent">Capítulo {selectedChapter.id}</p>
                    <h1 className="font-display text-xl font-bold text-foreground">
                      {selectedChapter.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="px-6 space-y-4">
                {/* Icon Header */}
                <div className="flex justify-center py-4">
                  <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <selectedChapter.icon size={40} className="text-accent" />
                  </div>
                </div>

                {/* Intro */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-accent" />
                    Conceito
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedChapter.content.intro}
                  </p>
                </div>

                {/* Science */}
                {selectedChapter.content.science && (
                  <div className="glass-card rounded-xl p-5 border border-accent/20">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Brain size={18} className="text-accent" />
                      Base Científica
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedChapter.content.science}
                    </p>
                  </div>
                )}

                {/* Benefits */}
                {selectedChapter.content.benefits && selectedChapter.content.benefits.length > 0 && (
                  <div className="glass-card rounded-xl p-5">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-accent" />
                      Benefícios
                    </h3>
                    <ul className="space-y-2">
                      {selectedChapter.content.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Zap size={14} className="text-accent mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {selectedChapter.content.tips && selectedChapter.content.tips.length > 0 && (
                  <div className="glass-card rounded-xl p-5">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Target size={18} className="text-accent" />
                      Dicas Práticas
                    </h3>
                    <ul className="space-y-2">
                      {selectedChapter.content.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-accent mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quote */}
                {selectedChapter.content.quote && (
                  <div className="glass-card rounded-xl p-5 bg-accent/5 border border-accent/20">
                    <p className="text-center text-accent italic font-medium">
                      "{selectedChapter.content.quote}"
                    </p>
                  </div>
                )}

                {/* Complete Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCompleteChapter(selectedChapter.id)}
                  className={`
                    w-full py-4 rounded-xl font-medium text-accent-foreground
                    flex items-center justify-center gap-2
                    ${isChapterCompleted(selectedChapter.id)
                      ? "bg-accent/50 cursor-default"
                      : "bg-accent hover:bg-accent/90"
                    }
                  `}
                  disabled={isChapterCompleted(selectedChapter.id)}
                >
                  {isChapterCompleted(selectedChapter.id) ? (
                    <>
                      <CheckCircle2 size={20} />
                      Capítulo Concluído
                    </>
                  ) : (
                    <>
                      <Unlock size={20} />
                      Concluir e Desbloquear Próximo
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation activeTab="nutrition" onTabChange={() => {}} />
    </div>
  );
};

export default LowCarbDiet;
