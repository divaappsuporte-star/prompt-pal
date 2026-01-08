import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Flame, 
  Brain, 
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
  Unlock,
  Battery
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
}

interface Recipe {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  instructions: string;
}

const KetoDiet = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1, 2, 3]);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: "O Mecanismo da Queima Limpa",
      subtitle: "Como a gordura vira energia",
      icon: Flame,
      content: {
        intro: "Quando os carboidratos caem, a insulina cai — abrindo o caminho para que a gordura seja usada como energia. A mitocôndria converte triglicerídeos em β-hidroxibutirato (BHB), molécula que fornece 25% mais energia ao cérebro do que a glicose.",
        science: "Cell Metabolism (2020): o BHB aumenta a produção de energia neuronal e reduz o estresse oxidativo.",
        benefits: ["25% mais energia cerebral", "Redução do estresse oxidativo", "Queima de gordura otimizada"],
      },
    },
    {
      id: 2,
      title: "O Cérebro na Cetose",
      subtitle: "Foco e clareza mental",
      icon: Brain,
      content: {
        intro: "Na cetose, o cérebro funciona com energia estável. Menos glicose = menos oscilações de dopamina; logo, mais foco e bom humor.",
        science: "Nature Neuroscience (2021) constatou aumento de 28% no nível de BDNF (proteína ligada à memória).",
        benefits: ["Foco mental constante", "Bom humor estável", "BDNF aumentado em 28%"],
      },
    },
    {
      id: 3,
      title: "Benefícios Cardíacos",
      subtitle: "Coração protegido",
      icon: Heart,
      content: {
        intro: "A dieta cetogênica reduz triglicerídeos em 50%, melhora resistência à insulina e aumenta o HDL ('bom colesterol').",
        science: "British Medical Journal (2021) – revisões com mais de 3.000 pacientes comprovam os benefícios cardiovasculares.",
        benefits: ["Triglicerídeos reduzidos em 50%", "Resistência à insulina melhorada", "HDL aumentado"],
      },
    },
    {
      id: 4,
      title: "Impacto na Inflamação",
      subtitle: "Menos dor, mais saúde",
      icon: Activity,
      content: {
        intro: "Com menos glicose, há menos formação de radicais livres. O corpo reduz inflamações em articulações, pele e intestino.",
        science: "Frontiers in Nutrition (2022) observou 40% de redução em marcadores inflamatórios (CRP).",
        benefits: ["40% menos inflamação", "Articulações mais saudáveis", "Pele e intestino melhorados"],
      },
    },
    {
      id: 5,
      title: "Alimentos Base Acessíveis",
      subtitle: "O que comer na prática",
      icon: UtensilsCrossed,
      content: {
        intro: "Proteínas: carne moída, patinho, coxão mole, frango, bisteca, ovos (400-600g/dia). Gorduras boas: manteiga, banha, azeite, abacate (3-4 colheres). Verduras: couve, espinafre, chuchu, abobrinha (à vontade). Queijos curados: minas, coalho, mussarela (50-60g).",
        tips: [
          "Proteínas: 400-600g de carnes e ovos",
          "Gorduras: manteiga, banha, azeite, abacate",
          "Verduras: couve, espinafre, chuchu, abobrinha",
          "Frutas low carb: abacate, morango, limão"
        ],
      },
    },
    {
      id: 6,
      title: "Fase de Adaptação (Cetoflu)",
      subtitle: "Os primeiros 5-10 dias",
      icon: Calendar,
      content: {
        intro: "Nos primeiros 5 a 10 dias pode haver dor de cabeça e fadiga leve, sede e micção aumentadas. Em uma semana, o corpo entra em plenitude energética.",
        tips: [
          "Beber água com sal",
          "Aumentar ingestão de gordura até saciar",
          "Comer ovo extra quando sentir fome repentina"
        ],
        science: "A adaptação é temporária e indica transição metabólica bem-sucedida.",
      },
    },
    {
      id: 7,
      title: "Macronutrientes Ideais",
      subtitle: "A proporção perfeita",
      icon: Scale,
      content: {
        intro: "Padrão diário sugerido: 70-75% gordura, 20-25% proteína, 5-10% carboidrato. O objetivo não é comer muito mais gordura, mas reduzir carboidrato a ponto de forçar a oxidação de gordura.",
        tips: [
          "70-75% das calorias de gordura",
          "20-25% de proteína",
          "5-10% de carboidrato (menos de 50g/dia)"
        ],
      },
    },
    {
      id: 8,
      title: "Gordura Natural ≠ Fritura",
      subtitle: "A diferença crucial",
      icon: Droplets,
      content: {
        intro: "Manteiga, banha e azeite são alimentos inteiros. Óleos vegetais (refinados) são inflamatórios por conta da oxidação.",
        tips: [
          "Use banha de porco ou azeite para cozinhar",
          "Evite óleos vegetais refinados",
          "Prefira baixa temperatura ao fritar"
        ],
        quote: "Gordura natural é nutrição. Óleo refinado é inflamação.",
      },
    },
    {
      id: 9,
      title: "A Mente da Simples Decisão",
      subtitle: "Rotina que funciona",
      icon: Brain,
      content: {
        intro: "Comer igual todos os dias não é tédio, é melhor neuroplasticidade. A previsibilidade reduz decisões e aumenta adesão.",
        quote: "Rotina é o caminho mais curto entre a intenção e o resultado.",
        benefits: ["Menos decisões diárias", "Maior adesão à dieta", "Neuroplasticidade otimizada"],
      },
    },
    {
      id: 10,
      title: "Transformação da Saciedade",
      subtitle: "Fome regulada naturalmente",
      icon: Target,
      content: {
        intro: "Em cetose, a grelina (causa da fome) se equilibra. O corpo passa a pedir comida em intervalos longos. Três refeições por dia viram duas naturalmente.",
        benefits: ["Grelina equilibrada", "Intervalos longos sem fome", "Transição natural para 2 refeições"],
      },
    },
    {
      id: 11,
      title: "Suplementação Básica",
      subtitle: "O essencial para o sucesso",
      icon: Leaf,
      content: {
        intro: "Magnésio (300mg/dia) evita cãimbras. Sal rosa mantém pressão estável. Ômega-3 de sardinha ou linhaça ajuda na memória.",
        tips: [
          "Magnésio: 300mg/dia para evitar cãimbras",
          "Sal rosa: pressão estável",
          "Ômega-3: sardinha ou linhaça para memória"
        ],
      },
    },
    {
      id: 12,
      title: "Cetose e Resiliência Emocional",
      subtitle: "Ansiedade e sono melhorados",
      icon: Moon,
      content: {
        intro: "Corpos cetônicos controlam cortisol (hormônio do estresse). Por isso a cetogênica melhora ansiedade e sono.",
        science: "Journal of Psychiatric Research (2020) — redução de sintomas de depressão em pacientes Low Carb/Cetogênica.",
        benefits: ["Cortisol controlado", "Ansiedade reduzida", "Sono mais profundo"],
      },
    },
    {
      id: 13,
      title: "Plano de 21 Dias",
      subtitle: "Estrutura completa",
      icon: Calendar,
      content: {
        intro: "Fase 1 – Adaptação (1-7): Corte açúcar totalmente, coma carne e ovos à saciedade. Fase 2 – Ceto ativa (8-14): Inclua abacate e verduras leves. Fase 3 – Manutenção (15-21): Repita cardápio, adapte para rotina familiar.",
        tips: [
          "Fase 1 (1-7): Cortar açúcar, carne e ovos à vontade",
          "Fase 2 (8-14): Adicionar abacate e verduras",
          "Fase 3 (15-21): Manutenção e adaptação familiar"
        ],
      },
    },
    {
      id: 14,
      title: "Indicadores de Sucesso",
      subtitle: "Métricas que importam",
      icon: Activity,
      content: {
        intro: "Após 21 dias você verá mudanças claras em glicemia, triglicerídeos, fome e clareza mental.",
        benefits: [
          "Glicemia em jejum: de >95 para <85 mg/dL",
          "Triglicerídeos: de >150 para <100 mg/dL",
          "Fome entre refeições: de alta para quase nula",
          "Foco e clareza: de baixos para constantes"
        ],
      },
    },
    {
      id: 15,
      title: "Água e Eletrólitos",
      subtitle: "A base da cetose saudável",
      icon: Droplets,
      content: {
        intro: "Sódio, potássio e magnésio precisam ser repostos. Beba um copão de água com pitada de sal ao acordar. Isso previne 'ceto flu' e mantém pressão estável.",
        tips: [
          "Água com sal ao acordar",
          "Repor sódio, potássio e magnésio",
          "Prevenir sintomas de adaptação"
        ],
      },
    },
    {
      id: 16,
      title: "Controle de Peso",
      subtitle: "Além da balança",
      icon: Scale,
      content: {
        intro: "O peso cai antes pela redução de líquido — depois se estabiliza em gordura. O importante é monitorar medidas abdominais, não a balança.",
        tips: [
          "Medir cintura é mais importante que pesar",
          "Primeira perda é líquido, depois gordura",
          "Foco em medidas, não números"
        ],
      },
    },
    {
      id: 17,
      title: "Erros Comuns",
      subtitle: "O que evitar",
      icon: Target,
      content: {
        intro: "Os erros mais comuns que sabotam a cetose: comer muito laticínio ultraprocessado, pouca água, exagerar em frutas ou amendoim.",
        tips: [
          "❌ Evitar laticínios ultraprocessados",
          "❌ Não esquecer da hidratação",
          "❌ Não exagerar em frutas ou amendoim"
        ],
      },
    },
    {
      id: 18,
      title: "Transição de Saída",
      subtitle: "Voltando à alimentação moderada",
      icon: Clock,
      content: {
        intro: "Para voltar à alimentação moderada: reintroduza 1 refeição com carboidrato bom (dia sim, dia não) por uma semana.",
        tips: [
          "Reintroduzir carb bom gradualmente",
          "1 refeição alternada por semana",
          "Observar resposta do corpo"
        ],
      },
    },
    {
      id: 19,
      title: "Psicologia da Constância",
      subtitle: "21 dias para o corpo, 40 para a mente",
      icon: Brain,
      content: {
        intro: "21 dias para o corpo, 40 para a mente. Crie uma rotina: mesmos horários e pratos variando gorduras.",
        tips: [
          "Manter horários fixos de refeição",
          "Variar gorduras, não a estrutura",
          "Consistência supera perfeição"
        ],
      },
    },
    {
      id: 20,
      title: "Filosofia da Energia Limpa",
      subtitle: "Mais que nutrição",
      icon: Battery,
      content: {
        intro: "Comer gordura limpa é mais que nutrição; é estabilidade mental. A cetogênica é o retorno à eficiência biológica.",
        quote: "Quando o corpo está em paz com a energia que o move, a mente finalmente silencia.",
        benefits: [
          "⬇ Perda de 2-6 kg de gordura",
          "💪 Ganho de energia constante",
          "🧠 Foco mental aguçado",
          "❤️ Melhoria em colesterol e pressão"
        ],
      },
    },
  ];

  const breakfastRecipes: Recipe[] = [
    { name: "Omelete de 3 ovos com queijo", calories: 310, protein: 20, fat: 26, carbs: 1, instructions: "Bater e assar com manteiga." },
    { name: "Café ceto (café + manteiga)", calories: 200, protein: 0, fat: 22, carbs: 0, instructions: "Bater 300ml café + 1 colh. manteiga até formar creme." },
    { name: "Ovos mexidos com abacate", calories: 350, protein: 14, fat: 30, carbs: 4, instructions: "Refogar ovos + abacate picado." },
    { name: "Panqueca lowcarb (ovo + queijo)", calories: 270, protein: 16, fat: 22, carbs: 1, instructions: "Misture e asse 2 min por lado." },
    { name: "Ovo frito na banha + presunto", calories: 320, protein: 16, fat: 27, carbs: 1, instructions: "Frite lentamente." },
    { name: "Ovos cozidos com azeite e sal", calories: 210, protein: 12, fat: 18, carbs: 0, instructions: "Cozinhar 8 min, regar com azeite." },
    { name: "Frango desfiado + ovo", calories: 310, protein: 27, fat: 20, carbs: 1, instructions: "Refogar frango com manteiga." },
    { name: "Queijo coalho grelhado + ovo", calories: 330, protein: 21, fat: 26, carbs: 2, instructions: "Grelhar e servir quente." },
    { name: "Abacate batido com cacau", calories: 180, protein: 3, fat: 16, carbs: 3, instructions: "Misturar em tigela manual." },
    { name: "Crepioca ceto (ovo + farelo)", calories: 250, protein: 13, fat: 20, carbs: 4, instructions: "Assar como pão fino." },
  ];

  const lunchRecipes: Recipe[] = [
    { name: "Bife de patinho com manteiga", calories: 370, protein: 30, fat: 26, carbs: 1, instructions: "Grelhar 4 min, finalizar com manteiga." },
    { name: "Frango ao creme de nata", calories: 390, protein: 32, fat: 27, carbs: 3, instructions: "Cozinhar frango + nata até encorpar." },
    { name: "Carne moída com queijo ralado", calories: 360, protein: 29, fat: 25, carbs: 2, instructions: "Refogue carne + polvilhe queijo." },
    { name: "Bisteca suína + salada verde", calories: 420, protein: 33, fat: 30, carbs: 4, instructions: "Fritar com banha e acrescentar folhas." },
    { name: "Omelete de frango e espinafre", calories: 350, protein: 28, fat: 24, carbs: 4, instructions: "Bater 3 ovos + frango + espinafre." },
    { name: "Músculo ensopado com chuchu", calories: 330, protein: 27, fat: 22, carbs: 5, instructions: "Cozinhar 45 min." },
    { name: "Hambúrguer duplo + queijo", calories: 410, protein: 35, fat: 28, carbs: 2, instructions: "Grelhar e sobrepor." },
    { name: "Caldo rico de ossos", calories: 250, protein: 22, fat: 15, carbs: 0, instructions: "Cozinhar 3h em pressão." },
    { name: "Peito de frango + abobrinha", calories: 300, protein: 30, fat: 18, carbs: 5, instructions: "Refogue juntos." },
    { name: "Patinho moído + creme de queijo", calories: 380, protein: 31, fat: 26, carbs: 3, instructions: "Adicionar 50ml nata no final." },
  ];

  const dinnerRecipes: Recipe[] = [
    { name: "Frango assado com pele", calories: 390, protein: 31, fat: 29, carbs: 0, instructions: "Forno 180°C 40 min." },
    { name: "Carne moída + ovo mexido", calories: 340, protein: 28, fat: 24, carbs: 1, instructions: "Misture na frigideira." },
    { name: "Coxão mole cozido com couve", calories: 400, protein: 33, fat: 26, carbs: 4, instructions: "Pressão 35 min, acrescente couve." },
    { name: "Lombo suíno na banha", calories: 420, protein: 30, fat: 32, carbs: 0, instructions: "Fritar lentamente." },
    { name: "Omelete noturno (2 ovos + queijo)", calories: 280, protein: 18, fat: 21, carbs: 1, instructions: "Rápido e leve." },
    { name: "Pernil desfiado com nata", calories: 390, protein: 31, fat: 27, carbs: 2, instructions: "Cozinhar e finalizar nata." },
    { name: "Abacate com coco ralado", calories: 190, protein: 2, fat: 17, carbs: 4, instructions: "Sobremesa cetogênica." },
    { name: "Caldo de frango com ovo", calories: 260, protein: 21, fat: 18, carbs: 1, instructions: "Cozinhar juntos." },
    { name: "Ovo frito + sardinha em azeite", calories: 300, protein: 25, fat: 22, carbs: 0, instructions: "Refogar 5 min." },
    { name: "Músculo desfiado + brócolis", calories: 340, protein: 29, fat: 23, carbs: 5, instructions: "Misturar no prato único." },
  ];

  const isChapterUnlocked = (chapterId: number) => unlockedChapters.includes(chapterId);
  const isChapterCompleted = (chapterId: number) => completedChapters.includes(chapterId);

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters(prev => [...prev, chapterId]);
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
              Dieta Cetogênica
            </h1>
            <p className="text-sm text-muted-foreground">Queime gordura, ganhe clareza mental</p>
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
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Flame className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seu progresso</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {completedCount} de {chapters.length} capítulos
                </p>
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
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
        <div className="glass-card rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                A Ciência do Estado Cetogênico
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A Dieta Cetogênica leva o corpo ao estado de cetose, no qual a principal fonte de energia deixa de ser o açúcar e passa a ser a gordura.
              </p>
              <p className="text-sm text-primary mt-3 italic">
                "Seu corpo tem duas usinas de energia: glicose e gordura. A cetogênica liga a que sempre esteve adormecida."
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
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            Capítulos
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === "recipes"
                ? "bg-primary text-primary-foreground"
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
                        ? "border-primary/20 hover:border-primary/40" 
                        : "border-border/30 opacity-60"
                      }
                      ${completed ? "bg-primary/5" : ""}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${completed 
                          ? "bg-primary/30" 
                          : unlocked 
                            ? "bg-muted/50" 
                            : "bg-muted/30"
                        }
                      `}>
                        {unlocked ? (
                          <chapter.icon 
                            size={22} 
                            className={completed ? "text-primary" : "text-foreground/70"} 
                          />
                        ) : (
                          <Lock size={18} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-primary font-medium">
                            Capítulo {chapter.id}
                          </span>
                          {completed && (
                            <CheckCircle2 size={14} className="text-primary" />
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
                <Coffee size={20} className="text-primary" />
                <h3 className="font-display font-bold text-foreground">Café da Manhã</h3>
              </div>
              <div className="space-y-2">
                {breakfastRecipes.map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-xl p-4 border border-border/50"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">{recipe.name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                      <span>{recipe.calories} kcal</span>
                      <span>•</span>
                      <span>{recipe.protein}g prot</span>
                      <span>•</span>
                      <span>{recipe.fat}g gord</span>
                      <span>•</span>
                      <span>{recipe.carbs}g carb</span>
                    </div>
                    <p className="text-xs text-primary">{recipe.instructions}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sun size={20} className="text-primary" />
                <h3 className="font-display font-bold text-foreground">Almoço</h3>
              </div>
              <div className="space-y-2">
                {lunchRecipes.map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="glass-card rounded-xl p-4 border border-border/50"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">{recipe.name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                      <span>{recipe.calories} kcal</span>
                      <span>•</span>
                      <span>{recipe.protein}g prot</span>
                      <span>•</span>
                      <span>{recipe.fat}g gord</span>
                      <span>•</span>
                      <span>{recipe.carbs}g carb</span>
                    </div>
                    <p className="text-xs text-primary">{recipe.instructions}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={20} className="text-primary" />
                <h3 className="font-display font-bold text-foreground">Jantar</h3>
              </div>
              <div className="space-y-2">
                {dinnerRecipes.map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className="glass-card rounded-xl p-4 border border-border/50"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">{recipe.name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                      <span>{recipe.calories} kcal</span>
                      <span>•</span>
                      <span>{recipe.protein}g prot</span>
                      <span>•</span>
                      <span>{recipe.fat}g gord</span>
                      <span>•</span>
                      <span>{recipe.carbs}g carb</span>
                    </div>
                    <p className="text-xs text-primary">{recipe.instructions}</p>
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
                    <p className="text-sm text-primary">Capítulo {selectedChapter.id}</p>
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
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <selectedChapter.icon size={40} className="text-primary" />
                  </div>
                </div>

                {/* Intro */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" />
                    Conceito
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedChapter.content.intro}
                  </p>
                </div>

                {/* Science */}
                {selectedChapter.content.science && (
                  <div className="glass-card rounded-xl p-5 border border-primary/20">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Brain size={18} className="text-primary" />
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
                      <CheckCircle2 size={18} className="text-primary" />
                      Benefícios
                    </h3>
                    <ul className="space-y-2">
                      {selectedChapter.content.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Zap size={14} className="text-primary mt-1 flex-shrink-0" />
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
                      <Target size={18} className="text-primary" />
                      Dicas Práticas
                    </h3>
                    <ul className="space-y-2">
                      {selectedChapter.content.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quote */}
                {selectedChapter.content.quote && (
                  <div className="glass-card rounded-xl p-5 bg-primary/5 border border-primary/20">
                    <p className="text-center text-primary italic font-medium">
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
                    w-full py-4 rounded-xl font-medium text-primary-foreground
                    flex items-center justify-center gap-2
                    ${isChapterCompleted(selectedChapter.id)
                      ? "bg-primary/50 cursor-default"
                      : "bg-primary hover:bg-primary/90"
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

export default KetoDiet;
