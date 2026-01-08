import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Beef, 
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
import { loadProgress, completeOnboardingStep } from "@/services/progressService";

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
  instructions: string;
}

const CarnivoreDiet = () => {
  const navigate = useNavigate();
  const { completeNutrition } = useProgress();
  const [activeTab, setActiveTab] = useState("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  
  // Load from localStorage
  const savedProgress = loadProgress();
  const [completedChapters, setCompletedChapters] = useState<number[]>(savedProgress.nutrition.carnivore.completedChapters);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>(() => {
    const completed = savedProgress.nutrition.carnivore.completedChapters;
    const unlocked = [1, 2, 3];
    completed.forEach(c => {
      if (c + 1 <= 20 && !unlocked.includes(c + 1)) unlocked.push(c + 1);
    });
    return unlocked;
  });

  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Por Que a Carne é Perfeita",
      subtitle: "O alimento ideal para o corpo humano",
      icon: Beef,
      content: {
        intro: "Nosso sistema digestivo é curto e altamente ácido, projetado para a digestão de carne. A proteína animal contém todos os aminoácidos essenciais sem necessidade de combinação com vegetais. Toda a vitamina B12, ferro-heme, creatina e colina só existem de forma biodisponível em produtos de origem animal.",
        science: "Frontiers in Nutrition (2021): dietas ricas em proteínas magras e gordura natural preservam músculos e reduzem risco cardiovascular.",
        quote: "O ser humano pode viver décadas com carne, ovos e água, mas nenhuma civilização sobreviveu só de açúcar e farináceos.",
      },
    },
    {
      id: 2,
      title: "Metabolismo da Gordura",
      subtitle: "Gordura como combustível limpo",
      icon: Flame,
      content: {
        intro: "Gorduras naturais (manteiga, banha, gordura intramuscular) são combustíveis eficientes. Quando o corpo diminui carboidratos, passa a oxidar gordura — própria e alimentar — como fonte primária de energia.",
        science: "Cell Metabolism (2019) mostrou que essa 'cetose leve' aumenta a função mitocondrial e reduz a fadiga. O resultado é energia estável, sem picos de sono após as refeições.",
        benefits: ["Energia estável o dia todo", "Sem picos de sono pós-refeição", "Função mitocondrial otimizada"],
      },
    },
    {
      id: 3,
      title: "Hormônios da Fome",
      subtitle: "Proteína que controla o apetite",
      icon: Scale,
      content: {
        intro: "Toda refeição rica em proteína estimula dois hormônios cruciais: Leptina (controla saciedade) e Grelina (diminui fome quando bem regulada).",
        science: "American Journal of Physiology (2020) comprovou que refeições com patinho, frango ou ovo reduzem a grelina em até 40%. Fome emocional diminui, e o apetite se torna biológico.",
        benefits: ["Redução de 40% na grelina", "Fim da fome emocional", "Apetite biológico equilibrado"],
      },
    },
    {
      id: 4,
      title: "Benefício Cardíaco Real",
      subtitle: "A verdade sobre gordura e coração",
      icon: Heart,
      content: {
        intro: "Durante décadas, a gordura animal foi culpada pelo colesterol. Hoje, revisões do British Medical Journal derrubam esse mito: o problema não é a gordura, mas o açúcar.",
        science: "A carne com gordura natural melhora o HDL (colesterol bom) e reduz triglicerídeos. O verdadeiro vilão inflamatório são os óleos vegetais refinados.",
        tips: ["Evitar óleos vegetais refinados", "Preferir gorduras animais naturais", "Focar em HDL e triglicerídeos, não colesterol total"],
      },
    },
    {
      id: 5,
      title: "Ferro e Creatina",
      subtitle: "Energia do trabalhador",
      icon: Zap,
      content: {
        intro: "Quem sente fraqueza, anemia e cansaço crônico costuma ter deficiência de ferro-heme (animal). 100g de patinho grelhado = 40% do ferro diário recomendado.",
        science: "Journal of Neuroscience (2019) observou 15% melhor desempenho cognitivo após 6 semanas de consumo de creatina natural da carne.",
        benefits: ["40% do ferro diário em 100g de patinho", "Creatina melhora força e memória", "15% melhor desempenho cognitivo"],
      },
    },
    {
      id: 6,
      title: "O Superalimento: Ovo",
      subtitle: "Completo, acessível e versátil",
      icon: Target,
      content: {
        intro: "O ovo é completo: contém proteína perfeita, gordura boa e micronutrientes. É acessível, rápido, barato e versátil. 2 ovos = 140 kcal, 12g proteína, 10g gordura.",
        science: "Harvard Brain Studies (2020): a colina dos ovos é precursora da acetilcolina – neurotransmissor do foco mental.",
        benefits: ["Proteína perfeita e completa", "Rico em colina para foco mental", "Custo-benefício excelente"],
      },
    },
    {
      id: 7,
      title: "Primeiras 2 Semanas",
      subtitle: "Início prático da adaptação",
      icon: Calendar,
      content: {
        intro: "Durante os primeiros dias, pode ocorrer leve dor de cabeça ou fraqueza — transição natural ao abandono do açúcar. Em 7 dias, o corpo já ativa totalmente o metabolismo de gordura.",
        tips: [
          "Beber 2,5L de água por dia",
          "Acrescentar sal rosa ou comum",
          "Incluir 2 ovos extras ou mais gordura natural"
        ],
        science: "A transição é temporária e indica que o corpo está mudando de combustível (glicose para gordura).",
      },
    },
    {
      id: 8,
      title: "Minerais da Longevidade",
      subtitle: "Zinco e selênio essenciais",
      icon: Droplets,
      content: {
        intro: "Carne, suíno e frango são ricos em zinco e selênio. Esses minerais reforçam sistema imunológico e tratam queda de cabelo e unhas fracas.",
        science: "European Journal of Nutrition (2021) comprovou melhora na imunidade com 15mg zinco/dia — valor coberto por 200g de carne.",
        benefits: ["Sistema imunológico reforçado", "Cabelo e unhas fortalecidos", "15mg zinco em 200g de carne"],
      },
    },
    {
      id: 9,
      title: "Cérebro Sem Neblina",
      subtitle: "Clareza mental potencializada",
      icon: Brain,
      content: {
        intro: "Quando o corpo usa gordura como combustível, há menos glicose oscilando no sangue, logo menos variações emocionais. O humor se estabiliza.",
        science: "Frontiers in Human Neuroscience (2020): dietas carnívoras elevam níveis de GABA — neurotransmissor calmante — reduzindo ansiedade alimentar.",
        benefits: ["Clareza mental", "Humor estável", "Redução da ansiedade alimentar"],
      },
    },
    {
      id: 10,
      title: "Cortes do Povo",
      subtitle: "Opções acessíveis e saborosas",
      icon: Beef,
      content: {
        intro: "Conhecer os cortes populares e acessíveis é fundamental para manter a dieta de forma econômica.",
        tips: [
          "Patinho (R$30-35/kg): magro e macio, ideal para moído e bifes",
          "Coxão mole (R$28-33/kg): sabor suave, ótimo para cozidos",
          "Músculo (R$25-28/kg): alto colágeno, perfeito para sopas",
          "Frango coxa/sobrecoxa (R$14-18/kg): suculento e econômico",
          "Suíno pernil/bisteca (R$20-25/kg): sabor intenso"
        ],
      },
    },
    {
      id: 11,
      title: "Simplicidade Funciona",
      subtitle: "Menos decisões, mais constância",
      icon: Target,
      content: {
        intro: "O corpo humano é um mecanismo que adora previsibilidade. Reduzir variedade alimentar diminui impulsos e facilita a adesão.",
        science: "Behavioral Science (2020) provou: quanto menos decisões sobre comida, maior constância e disciplina geral.",
        quote: "Simplificar o prato é libertar a mente.",
      },
    },
    {
      id: 12,
      title: "Termogênese",
      subtitle: "Gasto energético aumentado",
      icon: Flame,
      content: {
        intro: "A digestão de proteína aumenta o Efeito Térmico dos Alimentos em até 30%, o que significa que a carne literalmente faz o corpo gastar calorias para digeri-la.",
        science: "Metabolism Journal (2021): indivíduos em dieta carne + ovos atingem gasto extra de 170 kcal/dia apenas pela digestão.",
        benefits: ["30% mais gasto calórico na digestão", "170 kcal extras gastas por dia", "Metabolismo acelerado naturalmente"],
      },
    },
    {
      id: 13,
      title: "Temperos e Conservação",
      subtitle: "Simplicidade no preparo",
      icon: UtensilsCrossed,
      content: {
        intro: "Use apenas sal, alho, páprica ou alecrim. Evite molhos prontos, temperos industrializados e óleo de soja.",
        tips: [
          "Sal, alho, páprica e alecrim são suficientes",
          "Evitar molhos prontos e industrializados",
          "Nunca usar óleo de soja",
          "Comida fresca dura até 3 dias refrigerada"
        ],
      },
    },
    {
      id: 14,
      title: "Plano 21 Dias",
      subtitle: "Cardápio estruturado",
      icon: Calendar,
      content: {
        intro: "Um plano estruturado de 21 dias para sua adaptação completa à dieta carnívora. Foco em saciedade e consistência, não restrição.",
        tips: [
          "Fase 1 (1-7): Carne + ovos + água",
          "Fase 2 (8-14): Introduzir queijo e frango alternado",
          "Fase 3 (15-21): Manter 3 refeições com variação leve de cortes"
        ],
        benefits: [
          "💧 Hidratação: 2,5L/dia + sal marinho",
          "☀️ Luz solar: 15 min/dia para hormônios"
        ],
      },
    },
    {
      id: 15,
      title: "Mulheres e Idosos",
      subtitle: "Ajustes específicos",
      icon: Heart,
      content: {
        intro: "Mulheres podem necessitar mais ferro e colágeno (não dispensar músculo e ovos). Idosos devem priorizar proteína bem tratada: carne moída, bem cozida, com gordura.",
        tips: [
          "Mulheres: focar em ferro e colágeno",
          "Idosos: carne moída bem cozida com gordura",
          "Todos: manter hidratação adequada"
        ],
      },
    },
    {
      id: 16,
      title: "Contraindicações",
      subtitle: "Cuidados importantes",
      icon: Activity,
      content: {
        intro: "A dieta carnívora é segura para a maioria das pessoas, mas alguns casos requerem supervisão médica.",
        tips: [
          "Evitar sem supervisão em doença renal grave",
          "Gravidez requer acompanhamento médico",
          "Consultar profissional para ajuste individual"
        ],
        science: "A maioria das pessoas pode seguir a dieta com segurança, mas condições específicas exigem monitoramento.",
      },
    },
    {
      id: 17,
      title: "Sustentabilidade Popular",
      subtitle: "Apoiando produtores locais",
      icon: Leaf,
      content: {
        intro: "A carne de pasto, ovos caipiras e suínos locais apoiam pequenos produtores e reduzem impacto ambiental. Usar até o caldo dos ossos gera nutrição sem desperdício.",
        tips: [
          "Preferir carne de pasto",
          "Comprar ovos caipiras locais",
          "Usar ossos para caldo nutritivo",
          "Apoiar pequenos produtores"
        ],
      },
    },
    {
      id: 18,
      title: "Horário e Ritmo",
      subtitle: "Quando e como comer",
      icon: Clock,
      content: {
        intro: "Comer 2 a 3 vezes ao dia é suficiente para sustentar energia constante. Evite beliscos. A carne libera energia lenta e de longa duração.",
        tips: [
          "2-3 refeições por dia são suficientes",
          "Evitar beliscos entre refeições",
          "A carne libera energia de longa duração"
        ],
      },
    },
    {
      id: 19,
      title: "Jejum e Dieta",
      subtitle: "Combinação natural",
      icon: Moon,
      content: {
        intro: "Após duas semanas, as pessoas naturalmente fazem jejum de 12-16h sem fome. Isso amplifica a queima de gordura e descanso digestivo.",
        science: "O corpo adaptado à gordura não sente fome com a mesma frequência, permitindo jejuns mais longos naturalmente.",
        benefits: ["Jejum natural de 12-16h", "Queima de gordura amplificada", "Descanso digestivo completo"],
      },
    },
    {
      id: 20,
      title: "Constância é Luxo",
      subtitle: "O fechamento do ciclo",
      icon: CheckCircle2,
      content: {
        intro: "Projetos curtos não transformam hábitos. Comer carne de verdade por 90 dias reeduca hormônios e sistema nervoso. A verdadeira liberdade não é comer de tudo; é não precisar mais lutar contra o próprio corpo.",
        quote: "Firmeza é melhor que força. É ela que mantém o processo vivo.",
        benefits: [
          "⬇ Redução de 2-6kg sem fome",
          "💪 Mais força e disposição",
          "😌 Sono profundo e humor estável",
          "🧠 Clareza mental acelerada"
        ],
      },
    },
  ];

  const breakfastRecipes: Recipe[] = [
    { name: "Ovos mexidos clássicos", calories: 260, protein: 14, fat: 20, instructions: "Bater 2 ovos com sal, manteiga na frigideira, mexer lento." },
    { name: "Omelete de carne moída (100g patinho)", calories: 340, protein: 27, fat: 24, instructions: "Refogue carne, misture ovos, tampe 2 min." },
    { name: "Ovo frito + 2 tiras bacon", calories: 310, protein: 18, fat: 26, instructions: "Aquecer gordura natural, fritar até média cozura." },
    { name: "Bife rápido 200g alcatra", calories: 390, protein: 28, fat: 29, instructions: "Grelha 3 min de cada lado, sal rosa." },
    { name: "Ovo cozido + queijo coalho 50g", calories: 280, protein: 17, fat: 22, instructions: "Cozer 8 min e dourar queijo na frigideira." },
    { name: "Frango desfiado com ovos", calories: 290, protein: 25, fat: 19, instructions: "Refogar 50g frango, adicionar 2 ovos." },
    { name: "Carne moída + ovo cozido", calories: 310, protein: 27, fat: 21, instructions: "Misturar fora do fogo para textura sólida." },
    { name: "Queijo prato com ovo frito", calories: 300, protein: 20, fat: 23, instructions: "Fritar ovo, colocar fatias de queijo sobre." },
    { name: "Músculo desfiado aquecido", calories: 280, protein: 26, fat: 18, instructions: "Reaproveite resto do almoço." },
    { name: "Omelete duplo frango e ovos", calories: 350, protein: 32, fat: 22, instructions: "Frango picado, mexer com ovos, assar leve." },
  ];

  const lunchRecipes: Recipe[] = [
    { name: "Bife de patinho grelhado", calories: 370, protein: 31, fat: 26, instructions: "Grelhar 4 min, manteiga ghee." },
    { name: "Coxa e sobrecoxa assadas", calories: 420, protein: 32, fat: 30, instructions: "Forno 200°C 40 min, sal e páprica." },
    { name: "Carne moída com ovo", calories: 360, protein: 27, fat: 25, instructions: "Fritar 150g carne + 2 ovos." },
    { name: "Bisteca suína", calories: 410, protein: 30, fat: 29, instructions: "Frigir em banha 6 min cada lado." },
    { name: "Músculo cozido", calories: 330, protein: 26, fat: 20, instructions: "Pressão 40 min com sal e alho." },
    { name: "Pernil grelhado", calories: 390, protein: 27, fat: 27, instructions: "Selar em frigideira de ferro." },
    { name: "Frango na manteiga", calories: 320, protein: 26, fat: 22, instructions: "Refogar peito em ghee 10 min." },
    { name: "Hambúrguer simples caseiro", calories: 270, protein: 23, fat: 18, instructions: "Carne moída + sal + chapa quente." },
    { name: "Caldo de osso com carne", calories: 230, protein: 20, fat: 15, instructions: "Cozinhar 3h." },
    { name: "Frango picado coxa/sobrecoxa", calories: 350, protein: 32, fat: 25, instructions: "Grelhar frango picado até dourar." },
  ];

  const dinnerRecipes: Recipe[] = [
    { name: "Coxão mole refogado", calories: 390, protein: 30, fat: 27, instructions: "Picar carne, refogar com banha." },
    { name: "Carne moída com queijo", calories: 340, protein: 26, fat: 23, instructions: "Cozinhar carne + colocar queijo ralado." },
    { name: "Pernil suíno ao forno", calories: 420, protein: 31, fat: 32, instructions: "200°C 40 min." },
    { name: "Ovos mexidos c/restos de carne", calories: 290, protein: 24, fat: 20, instructions: "Aqueça restos, adicione ovos." },
    { name: "Músculo desfiado c/gordura", calories: 360, protein: 28, fat: 28, instructions: "Reaquecido em frigideira." },
    { name: "Frango ensopado", calories: 340, protein: 26, fat: 23, instructions: "Cozer 15 min com água e sal." },
    { name: "Bisteca com ovo frito", calories: 420, protein: 33, fat: 31, instructions: "Fritar bisteca, adicionar ovo." },
    { name: "Patinho moído refogado", calories: 310, protein: 27, fat: 20, instructions: "Refogue com alho e sal." },
    { name: "Ovo cozido + peito frango", calories: 270, protein: 25, fat: 14, instructions: "Cozinhar 10 min." },
    { name: "Caldo de ossos e restos", calories: 230, protein: 20, fat: 16, instructions: "Cozinhar 2h – beba quente." },
  ];

  const isChapterUnlocked = (chapterId: number) => unlockedChapters.includes(chapterId);
  const isChapterCompleted = (chapterId: number) => completedChapters.includes(chapterId);

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters(prev => [...prev, chapterId]);
      completeNutrition("carnivore", chapterId);
      // Marca o passo de onboarding (nutrição = step 1)
      completeOnboardingStep(1);
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
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Dieta Carnívora
            </h1>
            <p className="text-sm text-muted-foreground">Ciência, Energia e Praticidade</p>
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
              <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center">
                <Beef className="text-coral" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seu progresso</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {completedCount} de {chapters.length} capítulos
                </p>
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-coral">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-coral to-coral/70"
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
        <div className="glass-card rounded-2xl p-5 border border-coral/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-coral" size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                O Poder da Comida de Verdade
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A força do corpo brasileiro está na simplicidade: arroz, feijão e carne. 
                Agora, tiramos o excesso e deixamos o essencial — a carne como combustível natural.
              </p>
              <p className="text-sm text-coral mt-3 italic">
                "A carne sustentou trabalhadores, lavradores e atletas por séculos."
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
                ? "bg-coral text-white"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            Capítulos
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === "recipes"
                ? "bg-coral text-white"
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
                        ? "border-coral/20 hover:border-coral/40" 
                        : "border-border/30 opacity-60"
                      }
                      ${completed ? "bg-coral/5" : ""}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${completed 
                          ? "bg-coral/30" 
                          : unlocked 
                            ? "bg-muted/50" 
                            : "bg-muted/30"
                        }
                      `}>
                        {unlocked ? (
                          <chapter.icon 
                            size={22} 
                            className={completed ? "text-coral" : "text-foreground/70"} 
                          />
                        ) : (
                          <Lock size={18} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-coral font-medium">
                            Capítulo {chapter.id}
                          </span>
                          {completed && (
                            <CheckCircle2 size={14} className="text-coral" />
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
                <Coffee size={20} className="text-coral" />
                <h3 className="font-display font-bold text-foreground">Café da Manhã</h3>
              </div>
              <div className="space-y-2">
                {breakfastRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    diet="carnivore"
                    mealType="breakfast"
                    accentColor="text-coral"
                  />
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sun size={20} className="text-coral" />
                <h3 className="font-display font-bold text-foreground">Almoço</h3>
              </div>
              <div className="space-y-2">
                {lunchRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    delay={0.5}
                    diet="carnivore"
                    mealType="lunch"
                    accentColor="text-coral"
                  />
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={20} className="text-coral" />
                <h3 className="font-display font-bold text-foreground">Jantar</h3>
              </div>
              <div className="space-y-2">
                {dinnerRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    delay={1}
                    diet="carnivore"
                    mealType="dinner"
                    accentColor="text-coral"
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
                    <p className="text-sm text-coral">Capítulo {selectedChapter.id}</p>
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
                  <div className="w-20 h-20 rounded-2xl bg-coral/20 flex items-center justify-center">
                    <selectedChapter.icon size={40} className="text-coral" />
                  </div>
                </div>

                {/* Intro */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-coral" />
                    Conceito
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedChapter.content.intro}
                  </p>
                </div>

                {/* Science */}
                {selectedChapter.content.science && (
                  <div className="glass-card rounded-xl p-5 border border-coral/20">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Brain size={18} className="text-coral" />
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
                      <CheckCircle2 size={18} className="text-coral" />
                      Benefícios
                    </h3>
                    <ul className="space-y-2">
                      {selectedChapter.content.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Zap size={14} className="text-coral mt-1 flex-shrink-0" />
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
                      <Target size={18} className="text-coral" />
                      Dicas Práticas
                    </h3>
                    <ul className="space-y-2">
                      {selectedChapter.content.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-coral mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quote */}
                {selectedChapter.content.quote && (
                  <div className="glass-card rounded-xl p-5 bg-coral/5 border border-coral/20">
                    <p className="text-center text-coral italic font-medium">
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
                    w-full py-4 rounded-xl font-medium text-white
                    flex items-center justify-center gap-2
                    ${isChapterCompleted(selectedChapter.id)
                      ? "bg-coral/50 cursor-default"
                      : "bg-coral hover:bg-coral/90"
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

export default CarnivoreDiet;
