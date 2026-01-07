import { useState } from "react";
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
  UtensilsCrossed
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

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
  completed: boolean;
  unlocked: boolean;
}

interface Recipe {
  name: string;
  description?: string;
}

const CarnivoreDiet = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Proteína e Gordura",
      subtitle: "Por que o corpo foi feito para isso",
      icon: Beef,
      content: {
        intro: "O sistema digestivo humano é ácido e curto, projetado para digerir carne. O estômago humano atinge pH 1,5 — equivalente ao de carnívoros predadores. O intestino é mais curto do que o dos herbívoros, facilitando a absorção de aminoácidos e gorduras.",
        science: "Moléculas essenciais como vitamina B12, ferro-heme, creatina, carnitina e taurina só existem em forma biodisponível em alimentos de origem animal.",
        quote: "Ao se afastar da carne, o corpo entra em déficit nutricional crônico.",
      },
      completed: false,
      unlocked: true,
    },
    {
      id: 2,
      title: "Bioquímica Metabólica",
      subtitle: "Gordura como combustível limpo",
      icon: Flame,
      content: {
        intro: "Gorduras naturais (saturadas e monoinsaturadas) não são vilãs — são substratos energéticos de alta eficiência. A Dieta da Carne induz cetose fisiológica, um estado em que o corpo utiliza gordura como energia primária.",
        science: "Cell Metabolism, 2019 — corpos cetônicos (beta-hidroxibutirato e acetoacetato) formados pela oxidação da gordura fornecem 25% mais energia ao cérebro que a glicose, reduzindo inflamação e melhorando foco.",
        benefits: ["Estabilização da glicemia", "Controle natural do apetite", "Energia cerebral superior"],
      },
      completed: false,
      unlocked: true,
    },
    {
      id: 3,
      title: "Como Funciona",
      subtitle: "Princípios da dieta carnívora",
      icon: Target,
      content: {
        intro: "O princípio é simples: exclusão total de carboidratos processados e vegetais fibrosos desnecessários; consumo de carnes de todos os tipos, ovos e gorduras naturais.",
        tips: ["65–70% calorias de gordura", "30–35% de proteína", "0–5% de carboidratos (traços em ovos e laticínios)"],
        science: "Essa proporção ativa lipólise constante, otimizando o uso de gordura corporal e reduzindo picos de insulina a níveis mínimos.",
      },
      completed: false,
      unlocked: true,
    },
    {
      id: 4,
      title: "Benefícios Comprovados",
      subtitle: "Evidências científicas",
      icon: CheckCircle2,
      content: {
        intro: "A dieta carnívora oferece uma série de benefícios comprovados por estudos científicos de instituições renomadas.",
        benefits: [
          "Redução da inflamação crônica (Frontiers in Nutrition, 2020)",
          "Melhora da sensibilidade à insulina (Harvard Medical Review, 2022)",
          "Clareza mental e foco prolongado (Nature Neuroscience, 2019)",
          "Aumento da testosterona e GH (Journal of Endocrinology, 2021)",
          "Redução de gordura visceral (Metabolism Journal, 2021)"
        ],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 5,
      title: "Carnes e Gorduras Ideais",
      subtitle: "Tipos e fontes essenciais",
      icon: Beef,
      content: {
        intro: "Conhecer os tipos de carnes e gorduras ideais é fundamental para maximizar os benefícios da dieta carnívora.",
        tips: [
          "🥩 Carnes vermelhas: Bovino, cordeiro, veado — ricas em ferro-heme e creatina",
          "🍗 Carnes brancas: Frango, pato, peru — proteína leve e colágeno",
          "🦴 Vísceras: Fígado, coração, rim — supernutrientes (vitamina A, cobre, zinco)",
          "🧈 Gorduras: Manteiga, tallow, azeite e toucinho"
        ],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 6,
      title: "Psicologia do Apetite",
      subtitle: "Normalização natural da fome",
      icon: Brain,
      content: {
        intro: "Um dos impactos mais rápidos na Dieta da Carne é a normalização da fome. Sem glicose oscilando, o cérebro reduz os impulsos emocionais ligados à comida.",
        science: "American Journal of Clinical Nutrition (2020): reduzir carboidratos por 21 dias regula grelina (fome) e leptina (saciedade).",
        quote: "A fome deixa de ser emocional e volta a ser instinto.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 7,
      title: "Adaptação 21 Dias",
      subtitle: "As fases da transição",
      icon: Calendar,
      content: {
        intro: "No início, o corpo atravessa o que chamamos de fase de adaptação carnívora. É fundamental entender e respeitar cada fase.",
        tips: [
          "Dias 1–5: queda de glicose percebida (fadiga leve)",
          "Dias 6–10: aumento de energia e início da perda de peso visível",
          "Dias 11–21: adaptação completa ao uso de gordura como energia"
        ],
        science: "Hidratação e sal mineral são fundamentais nessa fase para evitar os sintomas de adaptação.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 8,
      title: "Suplementação",
      subtitle: "Componentes essenciais",
      icon: Droplets,
      content: {
        intro: "Mesmo numa dieta de base animal, alguns ajustes otimizam resultados e garantem o equilíbrio mineral.",
        tips: [
          "Sal rosa e magnésio (evitam câimbras)",
          "Colágeno hidrolisado (mantém articulações)",
          "Vitamina D3 e ômega-3 (potencializam efeito anti-inflamatório)"
        ],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 9,
      title: "Cérebro e Cetose",
      subtitle: "Clareza mental potencializada",
      icon: Brain,
      content: {
        intro: "O aumento de cetona cerebral diminui microinflamações neurais. A serotonina estabiliza-se sem picos artificiais de açúcar.",
        science: "Frontiers in Human Neuroscience (2022) — corpos cetônicos regulam GABA e dopamina, reduzindo ansiedade e melhorando foco.",
        benefits: ["Clareza mental", "Constância emocional", "Sono mais profundo"],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 10,
      title: "Mito do Colesterol",
      subtitle: "A verdade sobre gordura animal",
      icon: Heart,
      content: {
        intro: "Décadas de demonização da gordura animal foram baseadas em estudos mal interpretados. Hoje sabemos que colesterol não é vilão, mas base estrutural de hormônios e membranas celulares.",
        science: "British Medical Journal (2021): não há correlação direta entre colesterol total e mortalidade; o relevante é o equilíbrio HDL/Triglicerídeos. A dieta carnívora, ao baixar triglicerídeos e manter HDL alto, melhora marcadores cardíacos.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 11,
      title: "Perfil Ideal",
      subtitle: "Para quem é indicado",
      icon: Target,
      content: {
        intro: "A dieta carnívora é especialmente indicada para pessoas com condições específicas que se beneficiam da eliminação de carboidratos e vegetais.",
        benefits: [
          "Pessoas resistentes à insulina ou com pré-diabetes",
          "Portadores de inflamação crônica",
          "Quem busca foco, clareza e simplificação alimentar",
          "Indivíduos com má adaptação a fibras vegetais"
        ],
        tips: ["Contraindicado em: Doenças renais agudas e gravidez sem acompanhamento médico"],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 12,
      title: "Cronobiologia",
      subtitle: "Melhor horário para comer",
      icon: Clock,
      content: {
        intro: "Nosso relógio biológico é adaptado a longos intervalos de alimento. Por isso, a Dieta da Carne combina perfeitamente com um ciclo alimentar de 2 ou 3 refeições por dia.",
        tips: [
          "1ª refeição: 10h–12h",
          "2ª refeição: 18h–20h"
        ],
        science: "O corpo entra em jejum fisiológico natural sem perda de energia, otimizando a queima de gordura.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 13,
      title: "Jejum Intermitente",
      subtitle: "Combinação poderosa",
      icon: Moon,
      content: {
        intro: "Após 3 semanas de adaptação, é possível intercalar janelas alimentares (16:8 ou 20:4), reduzindo inflamação e maximizando queima de gordura.",
        science: "O organismo adaptado à gordura mantém performance estável mesmo sem glicose, permitindo jejuns mais longos sem desconforto.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 14,
      title: "Mente-Corpo",
      subtitle: "Simplicidade alimentar",
      icon: Brain,
      content: {
        intro: "Remover variedade excessiva diminui a ansiedade alimentar. A previsibilidade reduz decisões repetitivas.",
        science: "Behavioral Neuroscience (2020): quanto menos decisões alimentares diárias, mais foco e disciplina geral.",
        quote: "Simplificar o prato é libertar a mente.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 15,
      title: "Performance Física",
      subtitle: "Força e resistência",
      icon: Dumbbell,
      content: {
        intro: "A energia estável das gorduras permite treinos mais intensos e recuperação mais rápida.",
        science: "Simulações em atletas ('The Carnivore Study', Univ. Texas 2021) mostraram:",
        benefits: [
          "Aumento de força e tempo de resistência de 15–20%",
          "Redução do tempo de recuperação muscular",
          "Maior densidade óssea"
        ],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 16,
      title: "Indicadores Biológicos",
      subtitle: "Resultados após 30 dias",
      icon: Activity,
      content: {
        intro: "Após 30 dias de dieta carnívora, os indicadores biológicos mostram melhorias significativas.",
        benefits: [
          "Triglicerídeos ↓ 30–40%",
          "HDL ↑ 20%",
          "Glicemia ↓ 15%",
          "Marcadores inflamatórios (CRP) ↓ 25%"
        ],
        science: "Dados de metanálises clínicas da American Journal of Clinical Nutrition (2022).",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 17,
      title: "Sustentabilidade",
      subtitle: "Ética e consciência",
      icon: Leaf,
      content: {
        intro: "A Dieta da Carne moderna pode (e deve) ser feita com consciência ambiental.",
        tips: [
          "Prefira carnes de pasto",
          "Use partes integrais (nariz ao rabo)",
          "Apoie produtores sustentáveis"
        ],
        science: "O equilíbrio ético é parte da saúde integral.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 18,
      title: "Plano 21 Dias",
      subtitle: "Cardápio estruturado",
      icon: Calendar,
      content: {
        intro: "Um plano estruturado de 21 dias para sua adaptação completa à dieta carnívora.",
        tips: [
          "Semana 1 - Adaptação: Ovos + carne moída + gordura natural",
          "Semana 2 - Consolidação: Cortes variados (costela, músculo) + ovos",
          "Semana 3 - Performance: Carnes gordas e vísceras"
        ],
        benefits: [
          "💧 Hidratação: 2,5 L/dia + sal marinho + magnésio",
          "☀️ Luz solar: 15 min/dia — regula hormônios e sono"
        ],
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 19,
      title: "30 Receitas",
      subtitle: "Café, almoço e jantar",
      icon: UtensilsCrossed,
      content: {
        intro: "Uma coleção completa de 30 receitas carnívoras divididas em café da manhã, almoço e jantar para variar seu cardápio.",
      },
      completed: false,
      unlocked: false,
    },
    {
      id: 20,
      title: "Constância e Liberdade",
      subtitle: "O fechamento do ciclo",
      icon: CheckCircle2,
      content: {
        intro: "Emagrecer e viver bem não é punir o corpo, é ajustá-lo à sua biologia natural. Com algumas semanas, o corpo e a mente se tornam autorregulados: sem desejos compulsivos, sem culpa, sem fadiga.",
        quote: "A carne devolve ao corpo a clareza e à mente a estabilidade. A verdadeira liberdade não é comer de tudo; é não precisar mais lutar contra o próprio corpo.",
      },
      completed: false,
      unlocked: false,
    },
  ];

  const breakfastRecipes: Recipe[] = [
    { name: "Ovos mexidos com manteiga e fígado picado" },
    { name: "Omelete de três ovos com queijo e toucinho" },
    { name: "Café preto + bife de 100g com manteiga" },
    { name: "Ovo frito na gordura bovina" },
    { name: "Burguer matinal com ovo e queijo" },
    { name: "Língua bovina grelhada com manteiga" },
    { name: "Panceta dourada com ovos" },
    { name: "Fígado salteado com coração de boi" },
    { name: "Ensopado matinal de carne com osso" },
    { name: "Ovo pochê com sal rosa e azeite" },
  ];

  const lunchRecipes: Recipe[] = [
    { name: "Costela bovina lentamente assada" },
    { name: "Picanha na manteiga de ervas" },
    { name: "Frango ao curry com nata animal" },
    { name: "Lombo suíno com crosta de toucinho" },
    { name: "Hambúrguer duplo com queijo curado" },
    { name: "Fígado ao alho com ovo cozido" },
    { name: "Músculo cozido em caldo de osso" },
    { name: "Peito de pato confitado" },
    { name: "Cordeiro ao azeite" },
    { name: "Almôndegas de carne pura com manteiga clarificada" },
  ];

  const dinnerRecipes: Recipe[] = [
    { name: "Peixe gordo (salmão ou tainha) com ghee" },
    { name: "Bisteca de porco com banha derretida" },
    { name: "Ensopado de ossobuco com tutano" },
    { name: "Ovo cozido em caldo de osso" },
    { name: "Frango com pele crocante" },
    { name: "Linguiça artesanal com gema mole" },
    { name: "Costela suína assada por 3 horas" },
    { name: "Estrogonofe carnívoro (sem creme vegetal)" },
    { name: "Músculo desfiado no tallow" },
    { name: "Fígado com queijo curado ralado" },
  ];

  const completedCount = chapters.filter(c => c.completed).length;
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
              Dieta Carnívora
            </h1>
            <p className="text-sm text-muted-foreground">Ciência, Energia e Performance</p>
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
                O Retorno ao Alimento Original
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Antes de panelas, indústria e rótulos, o ser humano era um caçador. 
                Os alimentos que moldaram nossa espécie eram carne, gordura, vísceras e ossos.
              </p>
              <p className="text-sm text-coral mt-3 italic">
                "Não existe proteína demais para um corpo que foi feito para caçar."
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
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  whileHover={{ scale: chapter.unlocked ? 1.02 : 1 }}
                  whileTap={{ scale: chapter.unlocked ? 0.98 : 1 }}
                  onClick={() => chapter.unlocked && setSelectedChapter(chapter)}
                  className={`
                    glass-card rounded-xl p-4 cursor-pointer
                    border transition-all duration-300
                    ${chapter.unlocked 
                      ? "border-coral/20 hover:border-coral/40" 
                      : "border-border/30 opacity-60"
                    }
                    ${chapter.completed ? "bg-coral/5" : ""}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      ${chapter.completed 
                        ? "bg-coral/30" 
                        : chapter.unlocked 
                          ? "bg-muted/50" 
                          : "bg-muted/30"
                      }
                    `}>
                      {chapter.unlocked ? (
                        <chapter.icon 
                          size={22} 
                          className={chapter.completed ? "text-coral" : "text-foreground/70"} 
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
                        {chapter.completed && (
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
                    {chapter.unlocked && (
                      <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-xl p-3 border border-border/50"
                  >
                    <p className="text-sm text-foreground">{recipe.name}</p>
                  </motion.div>
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="glass-card rounded-xl p-3 border border-border/50"
                  >
                    <p className="text-sm text-foreground">{recipe.name}</p>
                  </motion.div>
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className="glass-card rounded-xl p-3 border border-border/50"
                  >
                    <p className="text-sm text-foreground">{recipe.name}</p>
                  </motion.div>
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
