import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, BookOpen, ChefHat, Lock, CheckCircle2, X, Flame, Droplets, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCard from "@/components/RecipeCard";
import { useProgress } from "@/hooks/useProgress";
import { loadProgress } from "@/services/progressService";

const IntermittentFasting = () => {
  const navigate = useNavigate();
  const { completeNutrition } = useProgress();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  
  // Load from localStorage
  const savedProgress = loadProgress();
  const [completedChapters, setCompletedChapters] = useState<number[]>(savedProgress.nutrition.fasting.completedChapters);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>(() => {
    const completed = savedProgress.nutrition.fasting.completedChapters;
    const unlocked = [1];
    completed.forEach(c => {
      if (c + 1 <= 10 && !unlocked.includes(c + 1)) unlocked.push(c + 1);
    });
    return unlocked;
  });

  const chapters = [
    {
      id: 1,
      title: "Entendendo o Código do Jejum",
      concept: "Em jejum, o corpo entra em autofagia, processo em que as células 'reciclam' partes velhas e danificadas. Isso reduz inflamações, melhora resistência à insulina e previne doenças degenerativas.",
      science: "Nature Metabolism (2020): 18h sem comida aumenta em 300% a atividade autofágica hepática. A autofagia é um mecanismo de limpeza celular essencial para longevidade.",
      benefits: ["Redução de inflamações crônicas", "Melhora da resistência à insulina", "Prevenção de doenças degenerativas", "Regeneração celular acelerada"],
      tips: ["Comece com jejum de 12h e aumente gradualmente", "Mantenha-se bem hidratado durante o jejum", "Observe como seu corpo responde"],
      quote: "O jejum é a maior cura da natureza."
    },
    {
      id: 2,
      title: "O Cérebro em Silêncio Metabólico",
      concept: "Sem digestão ativa, o fluxo sanguíneo é direcionado ao cérebro. O resultado: foco, clareza e estabilidade emocional.",
      science: "Frontiers in Neuroscience (2021) liga jejuns intermitentes à liberação de BDNF, proteína que fortalece neurônios e melhora memória.",
      benefits: ["Maior foco e concentração", "Clareza mental aprimorada", "Estabilidade emocional", "Melhora da memória"],
      tips: ["Use o período de jejum para tarefas que exigem foco", "Medite durante o jejum para potencializar benefícios", "Observe a melhora cognitiva ao longo das semanas"],
      quote: "A mente mais clara é aquela que descansa da digestão."
    },
    {
      id: 3,
      title: "Hormônios em Harmonia",
      concept: "Durante o jejum: Insulina cai (libera gordura estocada), GH sobe (mantém o músculo), Cortisol reduz (menos compulsão), Leptina e grelina se equilibram (controle real da fome).",
      science: "Endocrine Reviews (2020): O jejum intermitente otimiza o perfil hormonal, aumentando GH em até 300% e melhorando a sensibilidade à insulina em 33%.",
      benefits: ["Liberação de gordura estocada", "Preservação da massa muscular", "Redução da compulsão alimentar", "Controle real da fome"],
      tips: ["Não quebre o jejum com carboidratos simples", "Priorize proteínas na primeira refeição", "Mantenha horários consistentes"],
      quote: "Hormônios equilibrados são a base de um corpo saudável."
    },
    {
      id: 4,
      title: "Benefícios Cardiometabólicos",
      concept: "Redução de 20–35% no risco de diabetes tipo 2. Diminuição de 30% nos triglicerídeos. Estabilização de pressão arterial e batimentos cardíacos.",
      science: "British Medical Journal (2022) e American Heart Association (2020) confirmam os benefícios cardiovasculares do jejum intermitente regular.",
      benefits: ["Redução do risco de diabetes", "Melhora do perfil lipídico", "Pressão arterial estável", "Saúde cardíaca otimizada"],
      tips: ["Monitore sua pressão regularmente", "Faça exames de sangue periódicos", "Combine jejum com alimentação saudável"],
      quote: "Um coração saudável começa com um metabolismo equilibrado."
    },
    {
      id: 5,
      title: "Tipos de Jejum Mais Eficazes",
      concept: "12:12 para iniciantes, 14:10 para intermediários, 16:8 como prática principal, e 24h uma vez por semana para avançados. É essencial manter hidratação e boa nutrição nas janelas.",
      science: "Estudos mostram que o protocolo 16:8 é o mais sustentável a longo prazo, combinando eficácia metabólica com praticidade no dia a dia.",
      benefits: ["Flexibilidade de protocolos", "Adaptação ao seu estilo de vida", "Resultados progressivos", "Sustentabilidade a longo prazo"],
      tips: ["Comece com 12:12 na primeira semana", "Aumente 2h por semana até chegar ao 16:8", "Escolha janelas que se encaixem na sua rotina"],
      quote: "O melhor protocolo é aquele que você consegue manter."
    },
    {
      id: 6,
      title: "A Mudança de Mindset",
      concept: "Não é restrição, é liberdade. Após alguns dias, a relação emocional com a comida muda: fome deixa de ser ansiedade, passa a ser sinal corporal real.",
      science: "Behavioral Health (2020): O jejum reprograma a relação com a comida, reduzindo comportamentos compulsivos e melhorando a consciência alimentar.",
      benefits: ["Liberdade da compulsão", "Consciência corporal real", "Relação saudável com comida", "Controle emocional"],
      tips: ["Diferencie fome física de fome emocional", "Use o jejum como ferramenta de autoconhecimento", "Celebre pequenas vitórias"],
      quote: "O controle não nasce do esforço, mas da compreensão do próprio corpo."
    },
    {
      id: 7,
      title: "A Quebra do Jejum Perfeita",
      concept: "Ao encerrar o jejum, nunca use pães, doces ou sucos. Comece com proteínas e gorduras boas: ovos, carne magra, abacate, caldo, frango.",
      science: "Isso evita pico de insulina, estabiliza glicose e protege o fígado. A primeira refeição define o padrão metabólico do dia.",
      benefits: ["Insulina estável", "Glicose controlada", "Proteção hepática", "Energia duradoura"],
      tips: ["Prepare a primeira refeição com antecedência", "Priorize ovos e proteínas magras", "Evite carboidratos refinados"],
      quote: "Como você quebra o jejum define como seu corpo funcionará."
    },
    {
      id: 8,
      title: "O Que Comer nas Janelas",
      concept: "Baseie suas refeições em: Proteínas limpas (carne, ovo, frango), Gordura boa (manteiga, azeite, abacate), Legumes leves (abobrinha, chuchu, couve).",
      science: "A combinação de proteína e gordura mantém a saciedade por mais tempo, facilitando o próximo período de jejum.",
      benefits: ["Saciedade prolongada", "Nutrição completa", "Facilidade no jejum", "Energia estável"],
      tips: ["Evite ultraprocessados mesmo nas janelas", "Priorize comida de verdade", "Planeje suas refeições"],
      quote: "Coma para nutrir, não para encher."
    },
    {
      id: 9,
      title: "Melhora da Resposta Insulínica",
      concept: "Quando o corpo passa horas sem glicose, a insulina cai e os receptores se reequilibram. Em poucas semanas, há normalização da sensibilidade celular.",
      science: "Diabetes Care (2021): jejuns curtos (14–18h) por 8 semanas melhoraram em +33% a sensibilidade à insulina.",
      benefits: ["Sensibilidade à insulina restaurada", "Menos picos glicêmicos", "Prevenção de diabetes", "Metabolismo otimizado"],
      tips: ["Monitore sua glicemia se possível", "Observe a redução da fome ao longo do tempo", "Mantenha consistência"],
      quote: "Insulina equilibrada é a chave para queimar gordura."
    },
    {
      id: 10,
      title: "Adaptação das Primeiras Semanas",
      concept: "Você pode sentir dores de cabeça leves e menor rendimento nos primeiros dias. Use água com pitada de sal, descanso e ajuste gradual das janelas.",
      science: "A adaptação metabólica leva de 7 a 14 dias. O corpo precisa aprender a usar gordura como combustível principal.",
      benefits: ["Adaptação gradual", "Sintomas temporários", "Melhora progressiva", "Energia estável após adaptação"],
      tips: ["Beba água com sal ao sentir dor de cabeça", "Comece com 12:12 para facilitar", "Seja paciente com seu corpo"],
      quote: "A adaptação é o preço da transformação."
    },
    {
      id: 11,
      title: "Jejum e Autoimagem",
      concept: "O processo silencia impulsos psicológicos. A pessoa redescobre prazer em se manter leve.",
      science: "Behavioral Health (2020): O jejum reprograma hormônios ligados à dopamina, diminuindo a necessidade de recompensas calóricas.",
      benefits: ["Autocontrole fortalecido", "Menos dependência de recompensas", "Autoimagem positiva", "Leveza física e mental"],
      tips: ["Observe como você se sente mais leve", "Celebre a independência da comida", "Use o espelho como aliado"],
      quote: "A verdadeira liberdade é não precisar da comida para se sentir bem."
    },
    {
      id: 12,
      title: "Jejum + Low Carb: Sinergia",
      concept: "Low Carb mantém estáveis os níveis de insulina e facilita entrar em jejum sem fome. Combinar ambas acelera a queima de gordura sem perda muscular.",
      science: "A combinação potencializa a cetose e maximiza a oxidação de gordura, criando um ambiente metabólico ideal.",
      benefits: ["Jejum mais fácil", "Queima de gordura acelerada", "Preservação muscular", "Resultados potencializados"],
      tips: ["Reduza carboidratos gradualmente", "Priorize gorduras boas e proteínas", "Observe a facilidade crescente no jejum"],
      quote: "Duas estratégias, um objetivo: eficiência metabólica."
    },
    {
      id: 13,
      title: "O Cérebro em Estado Ceto-Foco",
      concept: "O cérebro, ao usar corpos cetônicos, trabalha 'limpo'. Há uma sensação de introspecção natural.",
      science: "Nature Neuroscience (2020): Cetonas fornecem 25% mais energia ao cérebro que a glicose, com menos resíduos metabólicos.",
      benefits: ["Foco intensificado", "Clareza mental", "Produtividade aumentada", "Menos névoa cerebral"],
      tips: ["Use o estado de foco para tarefas importantes", "Aproveite a clareza mental pela manhã", "Observe padrões de produtividade"],
      quote: "Um cérebro limpo é um cérebro poderoso."
    },
    {
      id: 14,
      title: "Jejum e Performance Física",
      concept: "Treinar levemente em jejum (caminhada, abdominal, HIIT curto) ativa enzimas de lipólise. Resultados: incremento de energia e maior EPOC.",
      science: "Exercício em jejum aumenta a oxidação de gordura em até 20% comparado ao exercício alimentado.",
      benefits: ["Maior queima de gordura", "Energia sustentada", "EPOC aumentado", "Performance otimizada"],
      tips: ["Comece com exercícios leves em jejum", "Hidrate-se bem antes do treino", "Observe sua energia durante o exercício"],
      quote: "O corpo em jejum é uma máquina de queimar gordura."
    },
    {
      id: 15,
      title: "Bebidas Permitidas no Jejum",
      concept: "Água natural ou com limão, café sem açúcar, chá verde, preto ou de hortelã. Sem adoçantes, sem colágeno e sem creme — quebram o jejum.",
      science: "Qualquer caloria ou estímulo insulínico interrompe os benefícios metabólicos do jejum.",
      benefits: ["Jejum mantido corretamente", "Hidratação adequada", "Benefícios preservados", "Variedade de opções"],
      tips: ["Beba água com limão pela manhã", "Use café para suprimir a fome", "Experimente diferentes chás"],
      quote: "Água é a melhor companheira do jejum."
    },
    {
      id: 16,
      title: "Jejum e Longevidade",
      concept: "Jejuar ativa genes SIRT1 e FOXO3 — os 'genes da reparação celular'.",
      science: "Nature Aging (2022): pessoas que praticavam 16:8 duas vezes por semana tinham 38% menos marcadores de envelhecimento celular.",
      benefits: ["Ativação de genes de longevidade", "Reparação celular", "Menos envelhecimento", "Vitalidade prolongada"],
      tips: ["Pratique jejum regularmente", "Combine com sono de qualidade", "Mantenha estilo de vida saudável"],
      quote: "Jejuar é dar ao corpo tempo para se reparar."
    },
    {
      id: 17,
      title: "Segurança e Contraindicações",
      concept: "Evite se: hipoglicemia severa, gravidez, doença renal avançada, uso de insulina sem supervisão médica.",
      science: "O jejum é seguro para a maioria das pessoas, mas algumas condições exigem acompanhamento profissional.",
      benefits: ["Prática segura", "Conhecimento dos limites", "Autocuidado responsável", "Orientação adequada"],
      tips: ["Consulte um médico se tiver dúvidas", "Monitore sintomas incomuns", "Respeite os limites do seu corpo"],
      quote: "Segurança em primeiro lugar, sempre."
    },
    {
      id: 18,
      title: "Como Monitorar sua Evolução",
      concept: "Olhe menos a balança; observe energia, sono e humor. Fotografias semanais e controle de medidas são melhores indicadores.",
      science: "A composição corporal muda antes do peso. Medidas e fotos capturam mudanças que a balança não mostra.",
      benefits: ["Visão realista do progresso", "Motivação sustentada", "Foco no que importa", "Celebração de vitórias reais"],
      tips: ["Tire fotos semanais", "Meça cintura e quadril", "Anote níveis de energia e humor"],
      quote: "O progresso real nem sempre aparece na balança."
    },
    {
      id: 19,
      title: "O Papel da Disciplina Leve",
      concept: "Manter uma rotina previsível — mesmo nos finais de semana — ajuda o corpo a entender seu novo padrão de horário. É disciplina sem sofrimento.",
      science: "A consistência hormonal depende de padrões regulares. O corpo aprende e se adapta a rotinas previsíveis.",
      benefits: ["Adaptação facilitada", "Hormônios estáveis", "Menos esforço mental", "Resultados consistentes"],
      tips: ["Mantenha horários similares todo dia", "Planeje exceções com antecedência", "Volte à rotina rapidamente após deslizes"],
      quote: "Constância é liberdade aprendida."
    },
    {
      id: 20,
      title: "Viver em Ritmo Biológico",
      concept: "Ao alinhar tempo de comer, dormir e se mover, você reconecta corpo, mente e relógio interno. A biologia volta a cooperar com você.",
      science: "O ritmo circadiano governa metabolismo, hormônios e regeneração. Alinhar-se a ele potencializa todos os benefícios do jejum.",
      benefits: ["Harmonia corpo-mente", "Metabolismo otimizado", "Sono de qualidade", "Energia natural"],
      tips: ["Coma nas horas de luz", "Durma em horários regulares", "Exponha-se ao sol pela manhã"],
      quote: "Não coma no relógio da ansiedade, coma no relógio do corpo."
    }
  ];

  const recipes = {
    breakfast: [
      { id: 1, name: "Omelete de dois ovos + manteiga", calories: 270, protein: 16, fat: 24, carbs: 1, instructions: "Bater ovos, assar com manteiga. Ideal p/ reanexar energia." },
      { id: 2, name: "Ovo cozido + abacate 3 colh.", calories: 340, protein: 13, fat: 30, carbs: 3, instructions: "Ótimo para retomar cetose." },
      { id: 3, name: "Café com nata (sem açúcar)", calories: 200, protein: 2, fat: 22, carbs: 1, instructions: "Misturar nata ao café quente, bater 20s." },
      { id: 4, name: "Panqueca proteica (ovo + farelo)", calories: 290, protein: 16, fat: 20, carbs: 4, instructions: "Assar 3 min cada lado." },
      { id: 5, name: "Frango desfiado com ovo mexido", calories: 340, protein: 28, fat: 23, carbs: 1, instructions: "Refogar frango + ovos." },
      { id: 6, name: "Músculo desfiado na banha", calories: 320, protein: 26, fat: 22, carbs: 0, instructions: "Aqueça lentamente, adicione sal." },
      { id: 7, name: "Queijo coalho + ovo frito", calories: 330, protein: 20, fat: 25, carbs: 2, instructions: "Grelhar queijo + fritar ovo." },
      { id: 8, name: "Caldo de ossos + 2 ovos", calories: 250, protein: 22, fat: 16, carbs: 0, instructions: "Fortalece intestino." },
      { id: 9, name: "Abacate c/ cacau + stevia", calories: 180, protein: 3, fat: 17, carbs: 4, instructions: "Misture e sirva frio." },
      { id: 10, name: "Sardinha + ovo cozido", calories: 310, protein: 28, fat: 21, carbs: 0, instructions: "Omega-3 + proteína." }
    ],
    lunch: [
      { id: 11, name: "Bife de patinho", calories: 370, protein: 30, fat: 26, carbs: 1, instructions: "Grelhar 4 min, sal." },
      { id: 12, name: "Frango assado com azeite", calories: 380, protein: 32, fat: 28, carbs: 2, instructions: "Assar 40 min." },
      { id: 13, name: "Carne moída c/ abobrinha", calories: 350, protein: 28, fat: 24, carbs: 4, instructions: "Refogue juntos." },
      { id: 14, name: "Bisteca suína + salada verde", calories: 420, protein: 33, fat: 30, carbs: 3, instructions: "Fritar 7 min." },
      { id: 15, name: "Coxão mole + couve refogada", calories: 400, protein: 33, fat: 25, carbs: 5, instructions: "Pressão 35 min." },
      { id: 16, name: "Pernil suíno grelhado", calories: 390, protein: 29, fat: 28, carbs: 0, instructions: "Grelha com banha." },
      { id: 17, name: "Músculo + repolho cozido", calories: 340, protein: 27, fat: 23, carbs: 5, instructions: "Cozinhar juntos." },
      { id: 18, name: "Hambúrguer duplo caseiro", calories: 410, protein: 35, fat: 28, carbs: 1, instructions: "Chapa quente sem óleo." },
      { id: 19, name: "Caldo rico de osso e carne", calories: 230, protein: 20, fat: 15, carbs: 1, instructions: "Cozinhar 3h." },
      { id: 20, name: "Patinho moído + queijo ralado", calories: 370, protein: 31, fat: 26, carbs: 2, instructions: "Refogue e finalize." }
    ],
    dinner: [
      { id: 21, name: "Omelete noite leve", calories: 280, protein: 18, fat: 21, carbs: 1, instructions: "Dois ovos, manteiga." },
      { id: 22, name: "Frango ensopado pós-treino", calories: 340, protein: 27, fat: 23, carbs: 3, instructions: "Peito em cubos no azeite." },
      { id: 23, name: "Coxão mole + salada fria", calories: 360, protein: 29, fat: 25, carbs: 4, instructions: "Refogar com alho." },
      { id: 24, name: "Carne moída de panela", calories: 350, protein: 30, fat: 24, carbs: 2, instructions: "Cozinhar 10 min." },
      { id: 25, name: "Ovos mexidos + manteiga ghee", calories: 280, protein: 14, fat: 25, carbs: 1, instructions: "Rápido e saciante." },
      { id: 26, name: "Caldo leve com frango e ovos", calories: 260, protein: 20, fat: 17, carbs: 1, instructions: "Ideal à noite." },
      { id: 27, name: "Pernil desfiado + azeite", calories: 370, protein: 30, fat: 28, carbs: 0, instructions: "Aqueça lentamente." },
      { id: 28, name: "Frango aos cubos no abacate", calories: 390, protein: 32, fat: 29, carbs: 3, instructions: "Misture após grelhar." },
      { id: 29, name: "Hambúrguer simples + ovo", calories: 420, protein: 34, fat: 30, carbs: 0, instructions: "Grelha rápida." },
      { id: 30, name: "Músculo desfiado com couve", calories: 350, protein: 28, fat: 27, carbs: 3, instructions: "Refogar e servir." }
    ]
  };

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters([...completedChapters, chapterId]);
      if (chapterId < 20 && !unlockedChapters.includes(chapterId + 1)) {
        setUnlockedChapters([...unlockedChapters, chapterId + 1]);
      }
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
            <h1 className="text-xl font-bold">Jejum Intermitente</h1>
            <p className="text-sm text-white/60">Reprograme seu metabolismo</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/10 border border-[#9b87f5]/30 p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#9b87f5]/10 rounded-full blur-3xl" />
          <Clock className="w-10 h-10 text-[#9b87f5] mb-4" />
          <h2 className="text-2xl font-bold mb-2">A Ciência do Intervalo</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            O jejum intermitente não é apenas "ficar sem comer". É um exercício de eficiência metabólica e hormonal. 
            Enquanto você descansa o sistema digestivo, o corpo limpa células usadas, regula insulina e estimula a regeneração neuronal.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#9b87f5]">
            <BookOpen className="w-4 h-4" />
            <span>Harvard Medical School (2023)</span>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold text-[#9b87f5]">{completedChapters.length}</div>
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
              className="flex-1 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white rounded-lg"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Capítulos
            </TabsTrigger>
            <TabsTrigger 
              value="recipes"
              className="flex-1 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white rounded-lg"
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
                    ? "bg-[#9b87f5]/20 border-[#9b87f5]/40"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#9b87f5]/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isChapterCompleted(chapter.id)
                      ? "bg-[#9b87f5]"
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
            {/* Breakfast */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">☀️</span> Quebrando o Jejum
              </h3>
              <div className="space-y-2">
                {recipes.breakfast.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{recipe.name}</h4>
                      <span className="text-xs text-[#9b87f5]">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF6B6B]" /> {recipe.protein}g prot
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-[#FFD580]" /> {recipe.fat}g gord
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#9b87f5]" /> {recipe.carbs}g carb
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌞</span> Almoço
              </h3>
              <div className="space-y-2">
                {recipes.lunch.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{recipe.name}</h4>
                      <span className="text-xs text-[#9b87f5]">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF6B6B]" /> {recipe.protein}g prot
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-[#FFD580]" /> {recipe.fat}g gord
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#9b87f5]" /> {recipe.carbs}g carb
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌙</span> Jantar
              </h3>
              <div className="space-y-2">
                {recipes.dinner.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{recipe.name}</h4>
                      <span className="text-xs text-[#9b87f5]">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF6B6B]" /> {recipe.protein}g prot
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-[#FFD580]" /> {recipe.fat}g gord
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#9b87f5]" /> {recipe.carbs}g carb
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
                    <h3 className="text-xl font-bold text-[#9b87f5] mb-2">
                      {chapters.find(c => c.id === selectedChapter)?.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-[#FFD580] mb-2">💡 Conceito</h4>
                      <p className="text-sm text-white/70">{chapters.find(c => c.id === selectedChapter)?.concept}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-[#9b87f5] mb-2">🔬 Base Científica</h4>
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
                      <h4 className="text-sm font-semibold text-green-400 mb-2">🎯 Dicas Práticas</h4>
                      <ul className="space-y-1">
                        {chapters.find(c => c.id === selectedChapter)?.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-white/70">• {tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-[#9b87f5]/20 to-transparent rounded-xl p-4 border-l-4 border-[#9b87f5]">
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
                        : "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90"
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
                const recipe = [...recipes.breakfast, ...recipes.lunch, ...recipes.dinner].find(r => r.id === selectedRecipe);
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
                      <div className="bg-[#9b87f5]/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#9b87f5]">{recipe.calories}</div>
                        <div className="text-xs text-white/60">kcal</div>
                      </div>
                      <div className="bg-[#FF6B6B]/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#FF6B6B]">{recipe.protein}g</div>
                        <div className="text-xs text-white/60">prot</div>
                      </div>
                      <div className="bg-[#FFD580]/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#FFD580]">{recipe.fat}g</div>
                        <div className="text-xs text-white/60">gord</div>
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-green-400">{recipe.carbs}g</div>
                        <div className="text-xs text-white/60">carb</div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-[#9b87f5] mb-2">📝 Modo de Preparo</h4>
                      <p className="text-sm text-white/70">{recipe.instructions}</p>
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

export default IntermittentFasting;
