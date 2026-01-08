import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Brain, 
  Lightbulb, 
  MessageCircle, 
  Heart, 
  User, 
  Ghost, 
  Zap, 
  Target, 
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Play,
  Lock
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
    exercise?: string;
    quote?: string;
  };
}

const Mindset = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]);

  const chaptersData = [
    {
      id: 1,
      title: "A Mente Obesa",
      subtitle: "Como o cérebro aprende a armazenar",
      icon: Brain,
      content: {
        intro: "O excesso de peso começa na mente que associa prazer à comida. Cada vez que buscamos alívio emocional no alimento, fortalecemos um circuito neural entre emoção e consumo — o chamado loop dopaminérgico.",
        science: "Estudos de Stice et al., 2018 (Nature Neuroscience) mostram que a dopamina liberada por alimentos gordurosos ou açucarados é semelhante à de drogas leves. O cérebro então aprende a buscar comida não por necessidade, mas por alívio emocional.",
        exercise: "Identifique quais gatilhos emocionais disparam seus impulsos (solidão, ansiedade, cansaço). Substitua o ato automático de 'comer' por uma microação consciente (respiração, escrever, caminhar). Cada interrupção movimenta o cérebro da compulsão para o controle.",
      },
    },
    {
      id: 2,
      title: "Neuroplasticidade",
      subtitle: "O cérebro pode ser reprogramado",
      icon: Zap,
      content: {
        intro: "A neuroplasticidade é a capacidade do cérebro de mudar conexões a partir da repetição e da emoção. Com a prática, você altera literalmente o mapa neural do prazer, da recompensa e do sacrifício.",
        science: "Merzenich (UCSF, 2013) demonstrou que repetições mentais e emocionais criam novos hábitos cerebrais com a mesma força dos antigos hábitos físicos.",
        exercise: "Repita visualizações e frases que substituem 'eu preciso emagrecer' por 'estou reaprendendo a cuidar do meu corpo'. A mente trabalha por imagens e emoções. Quando você muda o tom emocional da frase, o cérebro troca dor por prazer.",
        quote: "O corpo segue a frequência mental. Mude a frequência e o corpo obedece.",
      },
    },
    {
      id: 3,
      title: "PNL",
      subtitle: "A linguagem como comando neural",
      icon: MessageCircle,
      content: {
        intro: "A PNL (Programação Neurolinguística) propõe que linguagem e pensamento são softwares mentais capazes de mudar comportamentos automáticos. Toda vez que dizemos 'eu não consigo', o cérebro entende isso como ordem.",
        science: "Fonte: Lakoff & Johnson, Linguistic Relativity Theory (2016). Mudar o diálogo interno transforma o comando biológico.",
        exercise: "Comando antigo: 'Eu sou ansioso.' → Comando novo: 'Eu estou aprendendo a responder com calma.' Em neurociência, isso é chamado de ressignificação semântica.",
        quote: "O que você fala é o código que o cérebro executa.",
      },
    },
    {
      id: 4,
      title: "Ciclo Emocional",
      subtitle: "A fome física vs emocional",
      icon: Heart,
      content: {
        intro: "A fome pode ser física (energética) ou emocional (afetiva). 90% das vezes em que 'só preciso de um doce', é o sistema límbico pedindo alívio, não energia.",
        science: "Estudo (Harvard, Mind-Body Medicine, 2020): o cortisol elevado aumenta a sensação de apetite, mesmo sem déficit calórico.",
        exercise: "1. Reconheça a emoção ('estou irritado, não com fome'). 2. Nomear reduz o poder da emoção → (name it to tame it, UCLA Neuroscience). 3. Substitua por ritual físico: respiração, alongamento, escrever. Em pouco tempo, o cérebro fará essa nova associação de forma automática.",
      },
    },
    {
      id: 5,
      title: "Identidade",
      subtitle: "A imagem mental do seu corpo",
      icon: User,
      content: {
        intro: "O cérebro sempre busca coerência com a identidade internalizada. Se, no inconsciente, você ainda 'se vê acima do peso', todo progresso será sabotado. A mente trabalha por congruência: ela mantém o que acredita ser verdade.",
        science: "Experimento (Boston University, 2019): pacientes que visualizavam o corpo saudável diariamente em sessões curtas apresentaram maior adesão e consistência alimentar.",
        exercise: "Técnica da 'Identidade Visualizada' (PNL): 1. Feche os olhos; imagine a versão saudável de si. 2. Observe como se veste, fala e se move. 3. Traga essa sensação para o agora. 4. Fixe a imagem com uma palavra-âncora (ex: leveza). Repita por 21 dias.",
      },
    },
    {
      id: 6,
      title: "Sabotador Interno",
      subtitle: "O diálogo invisível",
      icon: Ghost,
      content: {
        intro: "O cérebro humano possui dois 'sistemas de conversas': Sistema 1 (impulsivo) → reage emocionalmente. Sistema 2 (analítico) → decide racionalmente. No emagrecimento, o Sistema 1 comanda: 'come só hoje'. A solução é treinar o delay de reação.",
        science: "Daniel Kahneman, Thinking Fast and Slow (2011): adiar impulsos > 7 segundos muda o circuito pré-frontal que decide recompensas.",
        exercise: "Ao sentir vontade de comer algo fora do plano, respire 3 vezes, conte 7 segundos. A nova sinapse que se forma ali é a raiz do autocontrole.",
      },
    },
    {
      id: 7,
      title: "Psiconeuroimunologia",
      subtitle: "Emoções e corpo conectados",
      icon: Heart,
      content: {
        intro: "Cada emoção tem expressão bioquímica. Sentimentos reprimidos geram inflamação crônica de baixo grau, favorecendo resistência à insulina e ganho de peso.",
        science: "Referência: Candace Pert (1997) — Molecules of Emotion. A pesquisadora demonstrou que emoções são mensageiros químicos conectados aos receptores de gordura, influenciando metabolismo.",
        exercise: "1. Reconheça a emoção diariamente ('sinto raiva/tristeza'). 2. Expresse fisicamente (escrever, falar, chorar). O corpo 'limpa' o excesso hormonal quando há expressão emocional correta.",
        quote: "Emagrecer sem curar emoções é trocar de cárcere — do corpo para a mente.",
      },
    },
    {
      id: 8,
      title: "Hábito e Dopamina",
      subtitle: "Recompensa e ciclo do hábito",
      icon: Zap,
      content: {
        intro: "Todo comportamento segue o ciclo gatilho → rotina → recompensa (Charles Duhigg, The Power of Habit, 2013). Quebrar hábitos ruins não é eliminar o gatilho, mas dar outra recompensa à rotina.",
        exercise: "Exemplo: Gatilho → estresse. Rotina → comer biscoito. Recompensa → alívio rápido. Crie uma substituição: Nova rotina → andar, ouvir música relaxante. Recompensa → sensação de controle e autodomínio. O cérebro ganha o mesmo alívio com um novo comportamento.",
      },
    },
    {
      id: 9,
      title: "Propósito",
      subtitle: "O poder do sentido",
      icon: Target,
      content: {
        intro: "A neurociência comportamental mostra que o cérebro precisa de uma razão emocional forte para sustentar mudanças. 'O que' você quer (emagrecer) é fraco se não estiver ligado ao 'por quê'.",
        science: "Viktor Frankl, Man's Search for Meaning (1946): Quem tem um motivo, supera qualquer meio.",
        exercise: "Escreva seu motivo principal. Transforme-o em imagem (ex: brincar com filhos com mais energia). Ver-se nesse cenário gera dopamina motivacional intrínseca.",
        quote: "Propósito é combustível que não depende da balança.",
      },
    },
    {
      id: 10,
      title: "Constância",
      subtitle: "O fechamento do ciclo",
      icon: CheckCircle2,
      content: {
        intro: "Após 21 dias, novas sinapses formam um 'habit loop' estável. Agora o cérebro opera por prazer, não obrigação. A disciplina se torna automática.",
        science: "Dweck (2012): mentes com mentalidade de crescimento associam esforço a evolução, não sofrimento.",
        exercise: "Checklist diário de constância: [ ] Fale com respeito consigo. [ ] Escolha com intenção, não impulso. [ ] Movimente-se 20 minutos. [ ] Durma bem. [ ] Reconheça pequenas vitórias.",
        quote: "A constância não nasce da força, mas da compreensão de que você domina o processo.",
      },
    },
  ];

  const isChapterLocked = (chapterId: number) => !unlockedChapters.includes(chapterId);
  const isChapterCompleted = (chapterId: number) => completedChapters.includes(chapterId);

  const handleCompleteChapter = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters([...completedChapters, chapterId]);
      if (chapterId < 10 && !unlockedChapters.includes(chapterId + 1)) {
        setUnlockedChapters([...unlockedChapters, chapterId + 1]);
      }
    }
    setSelectedChapter(null);
  };

  const completedCount = completedChapters.length;
  const progress = Math.round((completedCount / chaptersData.length) * 100);

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
              Mentalidade
            </h1>
            <p className="text-sm text-muted-foreground">PNL & Reprogramação Mental</p>
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
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Brain className="text-gold" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seu progresso</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {completedCount} de {chaptersData.length} capítulos
                </p>
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-gold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full gradient-gold"
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
        <div className="glass-card rounded-2xl p-5 border border-gold/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-gold" size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                O Corpo é Reflexo da Mente
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Toda mudança física sustentada nasce no terreno mental. Comer, se mover, 
                dormir — tudo é consequência de padrões neurológicos e emocionais.
              </p>
              <p className="text-sm text-gold mt-3 italic">
                "Antes de transformar o corpo, é preciso reeducar a mente que o controla."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chapters List */}
      <div className="px-6 py-4">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          Capítulos
        </h2>
        <div className="space-y-3">
          {chaptersData.map((chapter, index) => {
            const locked = isChapterLocked(chapter.id);
            const completed = isChapterCompleted(chapter.id);
            
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: !locked ? 1.02 : 1 }}
                whileTap={{ scale: !locked ? 0.98 : 1 }}
                onClick={() => !locked && setSelectedChapter(chapter)}
                className={`
                  glass-card rounded-xl p-4 cursor-pointer
                  border transition-all duration-300
                  ${!locked 
                    ? "border-gold/20 hover:border-gold/40" 
                    : "border-border/30 opacity-60"
                  }
                  ${completed ? "bg-gold/5" : ""}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${completed 
                      ? "bg-gold/30" 
                      : !locked 
                        ? "bg-muted/50" 
                        : "bg-muted/30"
                    }
                  `}>
                    {locked ? (
                      <Lock size={18} className="text-muted-foreground" />
                    ) : (
                      <chapter.icon 
                        size={22} 
                        className={completed ? "text-gold" : "text-foreground/70"} 
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gold font-medium">
                        Capítulo {chapter.id}
                      </span>
                      {completed && (
                        <CheckCircle2 size={14} className="text-gold" />
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-foreground">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {chapter.subtitle}
                    </p>
                  </div>
                  {!locked && (
                    <ChevronRight size={20} className="text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

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
                    <p className="text-sm text-gold">Capítulo {selectedChapter.id}</p>
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
                  <div className="w-20 h-20 rounded-2xl bg-gold/20 flex items-center justify-center">
                    <selectedChapter.icon size={40} className="text-gold" />
                  </div>
                </div>

                {/* Intro */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lightbulb size={18} className="text-gold" />
                    Conceito
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedChapter.content.intro}
                  </p>
                </div>

                {/* Science */}
                {selectedChapter.content.science && (
                  <div className="glass-card rounded-xl p-5 border border-gold/20">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Brain size={18} className="text-gold" />
                      Base Científica
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedChapter.content.science}
                    </p>
                  </div>
                )}

                {/* Exercise */}
                {selectedChapter.content.exercise && (
                  <div className="glass-card rounded-xl p-5 border border-coral/20">
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Play size={18} className="text-coral" />
                      Exercício Prático
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedChapter.content.exercise}
                    </p>
                  </div>
                )}

                {/* Quote */}
                {selectedChapter.content.quote && (
                  <div className="glass-card rounded-xl p-5 text-center bg-gold/5">
                    <p className="text-lg text-foreground font-display italic">
                      "{selectedChapter.content.quote}"
                    </p>
                  </div>
                )}

                {/* Complete Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCompleteChapter(selectedChapter.id)}
                  disabled={isChapterCompleted(selectedChapter.id)}
                  className={`w-full py-4 rounded-xl font-display font-semibold transition-all ${
                    isChapterCompleted(selectedChapter.id)
                      ? "bg-muted text-muted-foreground"
                      : "gradient-gold text-background"
                  }`}
                >
                  {isChapterCompleted(selectedChapter.id) 
                    ? "Capítulo Concluído ✓" 
                    : "Concluir e Desbloquear Próximo"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Mindset;
