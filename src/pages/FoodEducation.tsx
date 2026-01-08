import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  BookOpen, 
  Flame, 
  Apple, 
  Droplets, 
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronRight,
  ArrowRightLeft,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  UNIVERSAL_CHAPTERS, 
  FOOD_SUBSTITUTIONS, 
  APPROVED_FATS, 
  CONDEMNED_OILS 
} from "@/data/nutritionEducation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertTriangle,
  Flame,
  Apple,
  Droplets,
  BookOpen
};

const FoodEducation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chapters");
  const [navTab, setNavTab] = useState("nutricao");

  useEffect(() => {
    if (location.pathname === "/educacao-alimentar") {
      setNavTab("nutricao");
    }
  }, [location]);

  const handleNavChange = (tab: string) => {
    setNavTab(tab);
    if (tab === "home") navigate("/");
    else if (tab === "treino") navigate("/treino");
    else if (tab === "nutricao") navigate("/nutricao");
    else if (tab === "mente") navigate("/mentalidade");
    else if (tab === "add") navigate("/meu-plano");
  };

  const chapter = UNIVERSAL_CHAPTERS.find(c => c.id === selectedChapter);
  const IconComponent = chapter ? iconMap[chapter.icon] : null;

  return (
    <div className="min-h-screen pb-24 bg-background">
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
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-card border border-border"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Educação Alimentar</h1>
            <p className="text-sm text-muted-foreground">Protocolo 2026</p>
          </div>
        </div>
      </motion.header>

      {/* Intro Card */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">A Revolução da Comida de Verdade</h3>
              <p className="text-sm text-muted-foreground">
                Baseado nas mais recentes descobertas científicas sobre nutrição, este guia ensina 
                a diferenciar alimentos reais de produtos industriais e fazer escolhas que 
                realmente nutrem seu corpo.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chapters">Capítulos</TabsTrigger>
            <TabsTrigger value="substitutions">Substituições</TabsTrigger>
            <TabsTrigger value="fats">Gorduras</TabsTrigger>
          </TabsList>

          {/* Chapters Tab */}
          <TabsContent value="chapters" className="space-y-4">
            {UNIVERSAL_CHAPTERS.map((chap, index) => {
              const Icon = iconMap[chap.icon];
              return (
                <motion.div
                  key={chap.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedChapter(chap.id)}
                  className="p-4 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      {Icon && <Icon className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{chap.title}</h3>
                      <p className="text-sm text-muted-foreground">{chap.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              );
            })}
          </TabsContent>

          {/* Substitutions Tab */}
          <TabsContent value="substitutions" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Substitua produtos industriais por comida de verdade:
            </p>
            {FOOD_SUBSTITUTIONS.map((sub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-destructive line-through">{sub.original}</span>
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-green-600">{sub.replacement}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{sub.reason}</p>
              </motion.div>
            ))}
          </TabsContent>

          {/* Fats Tab */}
          <TabsContent value="fats" className="space-y-6">
            {/* Approved Fats */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-foreground">Gorduras Aprovadas</h3>
              </div>
              <div className="space-y-3">
                {APPROVED_FATS.map((fat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-foreground">{fat.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-700">
                        {fat.temp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{fat.use}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Condemned Oils */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-foreground">Óleos Condenados</h3>
              </div>
              <div className="space-y-3">
                {CONDEMNED_OILS.map((oil, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-destructive/10 border border-destructive/30"
                  >
                    <span className="font-medium text-foreground">{oil.name}</span>
                    <p className="text-sm text-muted-foreground mt-1">{oil.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chapter Modal */}
      <AnimatePresence>
        {selectedChapter && chapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setSelectedChapter(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[85vh] bg-card rounded-t-3xl overflow-hidden"
            >
              <div className="p-6 pb-20 overflow-y-auto max-h-[85vh]">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{chapter.title}</h2>
                      <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="p-2 rounded-full bg-muted"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <p className="text-foreground leading-relaxed">{chapter.content.intro}</p>

                  {chapter.content.science && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>📊 Ciência:</strong> {chapter.content.science}
                      </p>
                    </div>
                  )}

                  {chapter.content.keyPoints && chapter.content.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Pontos-Chave</h4>
                      <ul className="space-y-2">
                        {chapter.content.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {chapter.content.tips && chapter.content.tips.length > 0 && (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                      <h4 className="font-semibold text-foreground mb-2">💡 Dicas Práticas</h4>
                      <ul className="space-y-1">
                        {chapter.content.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {chapter.content.quote && (
                    <div className="p-4 rounded-xl bg-muted border-l-4 border-primary">
                      <p className="text-sm italic text-muted-foreground">"{chapter.content.quote}"</p>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChapter(null)}
                  className="w-full mt-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Entendido
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation activeTab={navTab} onTabChange={handleNavChange} />
    </div>
  );
};

export default FoodEducation;
