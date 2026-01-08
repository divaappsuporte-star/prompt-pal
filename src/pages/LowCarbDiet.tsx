import { useState } from "react";
import { ArrowLeft, Lock, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Utensils, FlameKindling, Brain, Heart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chapter {
  id: number;
  title: string;
  icon: React.ReactNode;
  concept: string;
  science: string;
  benefits: string[];
  tips: string[];
}

interface Recipe {
  name: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  preparation: string;
}

const chapters: Chapter[] = [
  {
    id: 1,
    title: "A Mente Glicemizada",
    icon: <Brain className="w-5 h-5" />,
    concept: "Quando você come pão, arroz ou açúcar refinado, ocorre uma explosão de glicose no sangue. O pâncreas libera insulina e armazena glicose extra em forma de gordura. Logo após a subida, vem a queda — e o cérebro interpreta esse declínio como 'fome urgente'. Esse ciclo cria dependência química.",
    science: "Nature Neuroscience (2018): carboidratos simples ativam as mesmas vias dopaminérgicas de drogas leves. A Dieta Low Carb quebra esse ciclo, estabilizando o humor e resetando o comando da fome.",
    benefits: ["Quebra do ciclo de dependência de açúcar", "Estabilização do humor", "Controle natural da fome"],
    tips: ["Elimine açúcar refinado gradualmente", "Substitua pão por ovos no café da manhã", "Observe seus gatilhos de 'fome urgente'"]
  },
  {
    id: 2,
    title: "Mecanismo Metabólico",
    icon: <FlameKindling className="w-5 h-5" />,
    concept: "A Low Carb ensina o corpo a usar gordura como combustível. Ao reduzir carboidratos, há queda de insulina — o hormônio que impede queimar gordura — e aumento da lipólise (uso de gordura corporal).",
    science: "Journal of Metabolic Research (2021): 60% dos indivíduos em Low Carb mostraram aumento de 38% na oxidação de gordura após 10 dias.",
    benefits: ["Queima de gordura corporal acelerada", "Insulina controlada", "Energia mais estável"],
    tips: ["Reduza carboidratos para 60-100g/dia", "Aumente gorduras boas gradualmente", "Mantenha proteína alta"]
  },
  {
    id: 3,
    title: "Equilíbrio dos Macronutrientes",
    icon: <Zap className="w-5 h-5" />,
    concept: "Distribuição ideal: 20–25% carboidratos (60–100g/dia), 40% proteína, 35–40% gordura boa. Carboidratos vêm principalmente de verduras, legumes cozidos e uma fruta de baixo índice glicêmico por dia.",
    science: "Rotina que o corpo entende, digestão leve, energia constante. Harvard School of Public Health (2023) demonstrou que adultos em regime Low Carb reduziram 34% dos triglicerídeos.",
    benefits: ["Digestão leve", "Energia constante", "Redução de triglicerídeos"],
    tips: ["Priorize verduras e legumes cozidos", "Limite frutas a 1 porção/dia", "Escolha frutas de baixo IG: morango, maçã verde"]
  },
  {
    id: 4,
    title: "Efeito Hormonal Benéfico",
    icon: <Heart className="w-5 h-5" />,
    concept: "A Low Carb diminui a insulina e estabiliza leptina, o que reduz fome e compulsão. Também aumenta o GH (hormônio do crescimento) e a testosterona natural.",
    science: "Endocrine Reviews (2020): em 4 semanas de Low Carb, o GH sobe em média 27%, melhorando recuperação e tônus muscular.",
    benefits: ["Redução da fome e compulsão", "Aumento do GH em 27%", "Melhora do tônus muscular"],
    tips: ["Mantenha jejum noturno de 12h", "Priorize proteína no café", "Evite lanches entre refeições"]
  },
  {
    id: 5,
    title: "O Mito do Carboidrato Essencial",
    icon: <BookOpen className="w-5 h-5" />,
    concept: "O corpo não precisa de glicose externa: o fígado fabrica o que for necessário através da gliconeogênese. A falta de carboidrato não causa fadiga se há gordura e proteína suficientes.",
    science: "Seu corpo não sente falta de pão; sente falta de equilíbrio hormonal. Frontiers in Nutrition (2021) comprova a eficiência metabólica sem carboidratos externos.",
    benefits: ["Autonomia metabólica", "Fim da dependência de carboidratos", "Energia sustentável"],
    tips: ["Confie no processo de adaptação", "Aumente gorduras boas se sentir fraqueza", "O fígado produz a glicose necessária"]
  },
  {
    id: 6,
    title: "Fase de Adaptação (14 Dias)",
    icon: <Zap className="w-5 h-5" />,
    concept: "Durante a adaptação, o corpo reduz glicogênio e aumenta queima de gordura. Podem ocorrer dor de cabeça ou fraqueza leve — resolvidas com sal e água.",
    science: "Após dez dias, surge uma energia estável e duradoura. O corpo completa a transição metabólica.",
    benefits: ["Transição para queima de gordura", "Energia estável após adaptação", "Redução de retenção de líquidos"],
    tips: ["Aumente sal (½ colher chá/dia)", "Hidratação = 2 a 3 litros de água/dia", "Inclua ovos extras ou abacate"]
  },
  {
    id: 7,
    title: "Alimentos Base para Brasileiros",
    icon: <Utensils className="w-5 h-5" />,
    concept: "Priorize o que cabe no bolso: Proteínas (patinho, coxão mole, frango, pernil, ovos, sardinha), Gorduras (manteiga, banha, azeite, abacate), Carbos bons (abobrinha, berinjela, pepino, alface, couve).",
    science: "Nada de exotismos ou importados. Alimentos simples e acessíveis garantem adesão à dieta.",
    benefits: ["Economia no supermercado", "Facilidade de encontrar", "Nutrição completa"],
    tips: ["Compre cortes populares", "Use banha e manteiga para cozinhar", "Verduras cozidas são mais digestíveis"]
  },
  {
    id: 8,
    title: "Hidratação como Terapia",
    icon: <Heart className="w-5 h-5" />,
    concept: "A água ajuda a reduzir retenção, melhora rim e fígado e regula a leptina. Adicione uma pitada de sal rosa e suco de limão na água da manhã.",
    science: "Hidratação adequada é fundamental para o metabolismo de gorduras e eliminação de toxinas.",
    benefits: ["Redução de retenção", "Melhora renal e hepática", "Regulação da leptina"],
    tips: ["Beba 2-3 litros/dia", "Adicione sal rosa à água", "Limão na água da manhã"]
  },
  {
    id: 9,
    title: "Impacto Cardiosaúde",
    icon: <Heart className="w-5 h-5" />,
    concept: "Low Carb reduz triglicerídeos e LDL oxidado, melhora HDL e glicemia. É uma estratégia comprovada para saúde cardiovascular.",
    science: "BMJ 2021: pacientes diabéticos em Low Carb diminuíram remédios em 35% sem prejuízo ao colesterol.",
    benefits: ["Redução de triglicerídeos", "Melhora do HDL", "Glicemia controlada"],
    tips: ["Evite óleos vegetais refinados", "Priorize gorduras naturais", "Monitore seus exames"]
  },
  {
    id: 10,
    title: "Clareza Mental Cetônica",
    icon: <Brain className="w-5 h-5" />,
    concept: "Quando o cérebro usa corpos cetônicos (vindos da gordura), há menos oscilação de dopamina. Logo: menor vontade de doce e mais foco.",
    science: "Nature Metabolism (2020): cetonas geradas pela Low Carb aumentam produção de BDNF, proteína de memória.",
    benefits: ["Foco mental aumentado", "Menor vontade de doce", "Melhora da memória"],
    tips: ["Mantenha a dieta por 21 dias", "Observe a clareza mental", "Anote suas melhorias cognitivas"]
  },
  {
    id: 11,
    title: "Low Carb e Treinos",
    icon: <Zap className="w-5 h-5" />,
    concept: "Carboidrato baixo não enche o músculo de água, mas mantém força constante. Use fruta antes do treino se precisar de impulso.",
    science: "Pós-treino: bife magro + ovo garantem recuperação completa sem picos de insulina.",
    benefits: ["Força constante", "Recuperação eficiente", "Sem retenção muscular"],
    tips: ["Fruta antes do treino se necessário", "Proteína + gordura pós-treino", "Mantenha hidratação"]
  },
  {
    id: 12,
    title: "Vitaminas e Minerais Essenciais",
    icon: <FlameKindling className="w-5 h-5" />,
    concept: "Zinco (do ovo e carne); magnésio (do legume verde); selênio (sardinha). Esses minerais são cofatores de enzimas metabólicas.",
    science: "Cofatores enzimáticos mantêm hormônios ativos e metabolismo funcionando.",
    benefits: ["Hormônios equilibrados", "Metabolismo ativo", "Imunidade fortalecida"],
    tips: ["Inclua sardinha 2x/semana", "Coma folhas verdes diariamente", "Ovos são fonte de zinco"]
  },
  {
    id: 13,
    title: "Desapego Emocional da Comida",
    icon: <Brain className="w-5 h-5" />,
    concept: "Sem alterações bruscas de glicose, o cérebro se liberta do reforço emocional do açúcar. Dormir melhor, pensar melhor e se relacionar melhor com a comida.",
    science: "Quando a mente entende que fome não é emoção, nasce a disciplina leve. Efeito neuroquímico comprovado.",
    benefits: ["Sono melhorado", "Relação saudável com comida", "Disciplina natural"],
    tips: ["Identifique fome física vs emocional", "Não coma por tédio ou estresse", "Pratique alimentação consciente"]
  },
  {
    id: 14,
    title: "Saída do Platô",
    icon: <FlameKindling className="w-5 h-5" />,
    concept: "Mesmo sem contar calorias, o corpo pode 'travar'. Alterne dias com carboidratos bons (1 porção de mandioquinha) a cada 7 dias para reativar o metabolismo.",
    science: "Ciclagem de carboidratos reativa enzimas metabólicas e evita adaptação excessiva.",
    benefits: ["Quebra de platô", "Reativação metabólica", "Flexibilidade alimentar"],
    tips: ["1 dia de carb bom a cada 7 dias", "Mandioquinha ou batata doce", "Observe a resposta do corpo"]
  },
  {
    id: 15,
    title: "Plano Alimentar de 21 Dias",
    icon: <BookOpen className="w-5 h-5" />,
    concept: "Fase 1 (1-7): Cortar açúcar e pães, incluir proteína e legumes. Fase 2 (8-14): Inserir fruta baixa IG e variação de carne. Fase 3 (15-21): Ciclar carboidratos bons 1x/semana.",
    science: "Progressão estruturada garante adaptação suave e resultados duradouros.",
    benefits: ["Redução de inchaço (fase 1)", "Equilíbrio de energia (fase 2)", "Estabilização de peso (fase 3)"],
    tips: ["Siga as fases na ordem", "Não pule etapas", "Anote seu progresso diário"]
  },
  {
    id: 16,
    title: "Quebrar o Jejum Corretamente",
    icon: <Utensils className="w-5 h-5" />,
    concept: "Evite sair comendo carboidrato. Prefira proteína + gordura: ovo, abacate, carne magra. Assim a insulina permanece baixa.",
    science: "Manter insulina baixa ao quebrar jejum prolonga os benefícios do estado de queima de gordura.",
    benefits: ["Insulina controlada", "Energia mantida", "Foco preservado"],
    tips: ["Quebre jejum com ovos", "Adicione abacate ou azeite", "Evite frutas logo ao acordar"]
  },
  {
    id: 17,
    title: "Digestão Eficiente",
    icon: <Heart className="w-5 h-5" />,
    concept: "Coma devagar, mastigue bem. Não exagere em fibra crua no início — hortaliças cozidas melhoram absorção. Higienize com vinagre ou limão.",
    science: "Mastigação adequada ativa enzimas digestivas e melhora absorção de nutrientes.",
    benefits: ["Melhor absorção", "Menos desconforto digestivo", "Saciedade prolongada"],
    tips: ["Mastigue 20-30 vezes", "Prefira verduras cozidas", "Higienize com vinagre"]
  },
  {
    id: 18,
    title: "Mitos Comuns Desvendados",
    icon: <BookOpen className="w-5 h-5" />,
    concept: "'Vou perder músculo' - Falso, proteína conserva. 'Vou sentir fraqueza' - Apenas na adaptação. 'Não posso viver sem arroz' - Depois de 21 dias nem vai querer.",
    science: "Evidências científicas desmentem os principais medos sobre redução de carboidratos.",
    benefits: ["Confiança no processo", "Eliminação de medos", "Clareza sobre a dieta"],
    tips: ["Confie na ciência", "Dê tempo ao corpo", "Os desejos diminuem naturalmente"]
  },
  {
    id: 19,
    title: "O Papel dos Hábitos",
    icon: <Brain className="w-5 h-5" />,
    concept: "Anotar refeições ajuda o cérebro a padronizar rotina. Use checklist de 21 dias para refeições e sono regular.",
    science: "Behavioral Psychology (2020): perder peso sem anotar é 50% menos efetivo.",
    benefits: ["Rotina estabelecida", "Consciência alimentar", "Resultados 50% melhores"],
    tips: ["Anote todas as refeições", "Mantenha horários fixos", "Use checklist diário"]
  },
  {
    id: 20,
    title: "Constância: O Cérebro em 21 Dias",
    icon: <Zap className="w-5 h-5" />,
    concept: "21 dias é tempo médio para criar rotina. Repita as refeições, não a culpa. A mente aprende consistência na simplicidade.",
    science: "Não é sobre perder peso, é sobre nunca mais voltar ao caos alimentar. Neuroplasticidade consolida novos hábitos.",
    benefits: ["Hábito consolidado", "Fim do ciclo de culpa", "Autonomia alimentar"],
    tips: ["Complete os 21 dias", "Simplicidade é chave", "Celebre pequenas vitórias"]
  }
];

const breakfastRecipes: Recipe[] = [
  { name: "Omelete de ovos com queijo", calories: 250, protein: "14g", fat: "20g", carbs: "1g", preparation: "Bater ovos, assar na frigideira com queijo." },
  { name: "Ovos mexidos com abacate", calories: 320, protein: "13g", fat: "26g", carbs: "3g", preparation: "Misture ovos e fatias de abacate." },
  { name: "Café + ovo + queijo coalho", calories: 220, protein: "12g", fat: "16g", carbs: "1g", preparation: "Rápido e energético." },
  { name: "Panqueca de ovo com linhaça", calories: 290, protein: "15g", fat: "22g", carbs: "4g", preparation: "Bata tudo e asse 2 min cada lado." },
  { name: "Omelete de carne moída 100g", calories: 350, protein: "28g", fat: "23g", carbs: "2g", preparation: "Refogue carne, misture ao ovo." },
  { name: "Ovo cozido + frango desfiado", calories: 260, protein: "22g", fat: "19g", carbs: "1g", preparation: "Sirva morno com azeite." },
  { name: "Ovo frito no ghee + tomate", calories: 240, protein: "13g", fat: "21g", carbs: "2g", preparation: "Refogue tomate antes do ovo." },
  { name: "Omelete duplo frango e ovo", calories: 330, protein: "25g", fat: "25g", carbs: "2g", preparation: "Dourar 4 min." },
  { name: "Músculo desfiado + ovo cozido", calories: 280, protein: "27g", fat: "18g", carbs: "1g", preparation: "Reaproveite carne da noite anterior." },
  { name: "Abacate com colágeno e chia", calories: 210, protein: "6g", fat: "18g", carbs: "5g", preparation: "Misture tudo e consuma frio." }
];

const lunchRecipes: Recipe[] = [
  { name: "Bife de alcatra com salada verde", calories: 380, protein: "30g", fat: "25g", carbs: "6g", preparation: "Grelhar bife, acompanhar folhas e azeite." },
  { name: "Carne moída com abobrinha", calories: 360, protein: "27g", fat: "24g", carbs: "5g", preparation: "Refogar carne + abobrinha ralada." },
  { name: "Frango grelhado + purê de couve-flor", calories: 390, protein: "32g", fat: "20g", carbs: "8g", preparation: "Cozinhar couve-flor e bater com manteiga." },
  { name: "Bisteca suína + salada de repolho", calories: 420, protein: "30g", fat: "30g", carbs: "4g", preparation: "Fritar em banha, repolho cru com azeite." },
  { name: "Coxão mole ensopado com legume", calories: 400, protein: "35g", fat: "25g", carbs: "7g", preparation: "Cozinhe carne + cenoura em cubos." },
  { name: "Omelete de 3 ovos + folhas cozidas", calories: 290, protein: "18g", fat: "21g", carbs: "4g", preparation: "Misture espinafre ou couve." },
  { name: "Pernil suíno grelhado + pepino", calories: 410, protein: "29g", fat: "28g", carbs: "3g", preparation: "Grelhar 8 min + sirva com pepino." },
  { name: "Sardinha na frigideira + limão", calories: 280, protein: "26g", fat: "18g", carbs: "1g", preparation: "15 min em fogo baixo." },
  { name: "Caldo rico de músculo + ovo", calories: 330, protein: "27g", fat: "22g", carbs: "2g", preparation: "Cozinhar com ossos e adicionar ovo." },
  { name: "Patinho moído com berinjela", calories: 350, protein: "30g", fat: "20g", carbs: "6g", preparation: "Refogar tudo junto, azeite." }
];

const dinnerRecipes: Recipe[] = [
  { name: "Frango ensopado simples", calories: 340, protein: "28g", fat: "22g", carbs: "3g", preparation: "Cozinhar 15 min com sal." },
  { name: "Carne moída + ovo cozido", calories: 310, protein: "26g", fat: "21g", carbs: "2g", preparation: "Misturar em frigideira." },
  { name: "Alcatra em tiras + salada fria", calories: 360, protein: "30g", fat: "24g", carbs: "4g", preparation: "Cozinha rápida e refrescante." },
  { name: "Pernil suíno + legumes cozidos", calories: 410, protein: "32g", fat: "28g", carbs: "6g", preparation: "15 min de panela de pressão." },
  { name: "Ovos recheados com carne moída", calories: 340, protein: "28g", fat: "23g", carbs: "2g", preparation: "Abrir ovos cozidos e rechear." },
  { name: "Hambúrguer caseiro duplo", calories: 420, protein: "34g", fat: "29g", carbs: "3g", preparation: "Dois discos de carne, grelha rápida." },
  { name: "Frango assado na manteiga", calories: 350, protein: "30g", fat: "25g", carbs: "2g", preparation: "Forno 180°C / 40 min." },
  { name: "Coxão mole cozido com alho", calories: 380, protein: "31g", fat: "26g", carbs: "3g", preparation: "Pressão 35 min." },
  { name: "Caldo de osso + ovo mexido", calories: 260, protein: "24g", fat: "17g", carbs: "1g", preparation: "Misturar ovo ao caldo." },
  { name: "Músculo desfiado na banha", calories: 390, protein: "32g", fat: "28g", carbs: "0g", preparation: "Refogar até dourar." }
];

const LowCarbDiet = () => {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1, 2, 3]);

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters([...completedChapters, chapterId]);
    }
    
    const nextChapterId = chapterId + 1;
    if (nextChapterId <= chapters.length && !unlockedChapters.includes(nextChapterId)) {
      setUnlockedChapters([...unlockedChapters, nextChapterId]);
    }
    
    setSelectedChapter(null);
  };

  const isChapterUnlocked = (chapterId: number) => unlockedChapters.includes(chapterId);
  const isChapterCompleted = (chapterId: number) => completedChapters.includes(chapterId);

  const RecipeCard = ({ recipe, mealType }: { recipe: Recipe; mealType: string }) => {
    const recipeKey = `${mealType}-${recipe.name}`;
    const isExpanded = expandedRecipe === recipeKey;

    return (
      <Card 
        className="bg-card/50 border-border/50 cursor-pointer hover:bg-card/70 transition-all"
        onClick={() => setExpandedRecipe(isExpanded ? null : recipeKey)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">{recipe.name}</h4>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span className="text-orange-400">{recipe.calories} kcal</span>
                <span>P: {recipe.protein}</span>
                <span>G: {recipe.fat}</span>
                <span>C: {recipe.carbs}</span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Preparo:</span> {recipe.preparation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-900/40 to-background px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/nutricao")}
            className="text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dieta Low Carb</h1>
            <p className="text-muted-foreground text-sm">Nutrição, Hormônios e Reprogramação</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-card/30 rounded-xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progresso do Conteúdo</span>
            <span className="text-sm font-medium text-green-400">
              {completedChapters.length}/{chapters.length} capítulos
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(completedChapters.length / chapters.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 mt-4">
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="w-full bg-card/50 mb-4">
            <TabsTrigger value="chapters" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Capítulos
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex-1">
              <Utensils className="w-4 h-4 mr-2" />
              Receitas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-3">
            {chapters.map((chapter) => {
              const unlocked = isChapterUnlocked(chapter.id);
              const completed = isChapterCompleted(chapter.id);

              return (
                <Card
                  key={chapter.id}
                  className={`transition-all duration-300 ${
                    unlocked
                      ? "bg-card/50 border-border/50 cursor-pointer hover:bg-card/70"
                      : "bg-card/20 border-border/30 opacity-60"
                  } ${completed ? "border-green-500/50" : ""}`}
                  onClick={() => unlocked && setSelectedChapter(chapter)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        completed 
                          ? "bg-green-500/20 text-green-400" 
                          : unlocked 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : unlocked ? (
                          chapter.icon
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Capítulo {chapter.id}
                          </span>
                          {completed && (
                            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                              Concluído
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground">{chapter.title}</h3>
                      </div>
                      {!unlocked && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            {/* Breakfast */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">☀️</span>
                <h3 className="text-lg font-semibold text-foreground">Café da Manhã</h3>
                <Badge variant="secondary" className="ml-auto">10 receitas</Badge>
              </div>
              <div className="space-y-2">
                {breakfastRecipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} mealType="breakfast" />
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌞</span>
                <h3 className="text-lg font-semibold text-foreground">Almoço</h3>
                <Badge variant="secondary" className="ml-auto">10 receitas</Badge>
              </div>
              <div className="space-y-2">
                {lunchRecipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} mealType="lunch" />
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌙</span>
                <h3 className="text-lg font-semibold text-foreground">Jantar</h3>
                <Badge variant="secondary" className="ml-auto">10 receitas</Badge>
              </div>
              <div className="space-y-2">
                {dinnerRecipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} mealType="dinner" />
                ))}
              </div>
            </div>

            {/* Results Section */}
            <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-500/30">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">📈 Resultados em 30 Dias</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>⬇️ Perda de 2 a 6 kg sem fome</li>
                  <li>📏 Redução de 5-9 cm na cintura</li>
                  <li>😌 Melhoria no sono e humor</li>
                  <li>🩸 Glicemia e triglicerídeos mais baixos</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chapter Detail Modal */}
      <Dialog open={!!selectedChapter} onOpenChange={() => setSelectedChapter(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {selectedChapter?.icon}
              </span>
              Capítulo {selectedChapter?.id}: {selectedChapter?.title}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Concept */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Conceito
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedChapter?.concept}
                </p>
              </div>

              {/* Science */}
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <FlameKindling className="w-4 h-4 text-green-400" />
                  Base Científica
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedChapter?.science}
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Benefícios
                </h4>
                <ul className="space-y-1">
                  {selectedChapter?.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Dicas Práticas
                </h4>
                <ul className="space-y-1">
                  {selectedChapter?.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>

          {/* Complete Button */}
          <div className="pt-4 border-t border-border">
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              onClick={() => selectedChapter && handleCompleteChapter(selectedChapter.id)}
            >
              {isChapterCompleted(selectedChapter?.id || 0) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Capítulo Concluído
                </>
              ) : (
                <>
                  Concluir e Desbloquear Próximo
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LowCarbDiet;
