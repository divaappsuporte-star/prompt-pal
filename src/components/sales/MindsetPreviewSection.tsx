import { motion } from "framer-motion";
import { Brain, BookOpen, Lock, Check, ChevronRight } from "lucide-react";
import MockupPhone from "./MockupPhone";

const chapters = [
  { title: "A Psicologia do Emagrecimento", completed: true },
  { title: "Crenças Limitantes", completed: true },
  { title: "Neuroplasticidade", completed: true },
  { title: "Gatilhos Emocionais", completed: false, locked: false },
  { title: "Hábitos Atômicos", completed: false, locked: true },
  { title: "Autossabotagem", completed: false, locked: true },
];

const MindsetPreviewSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-gold/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-4">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-bold">MENTALIDADE</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            10 Capítulos de Reprogramação Mental
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Baseado em PNL, neurociência e psicologia comportamental. Desbloqueie progressivamente conforme avança.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <MockupPhone className="max-w-[280px]">
              <div className="p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display font-bold">Mentalidade</h3>
                  <p className="text-xs text-muted-foreground">3 de 10 capítulos</p>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="w-[30%] h-full bg-gold rounded-full" />
                  </div>
                </div>

                {/* Chapters list */}
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2.5 rounded-xl ${
                        chapter.locked
                          ? "bg-muted/30 opacity-60"
                          : chapter.completed
                          ? "bg-gold/10 border border-gold/20"
                          : "bg-card border border-border/50"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        chapter.completed
                          ? "bg-mint text-background"
                          : chapter.locked
                          ? "bg-muted"
                          : "bg-gold/20"
                      }`}>
                        {chapter.completed ? (
                          <Check className="w-3 h-3" />
                        ) : chapter.locked ? (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <BookOpen className="w-3 h-3 text-gold" />
                        )}
                      </div>
                      <span className={`text-xs flex-1 ${
                        chapter.locked ? "text-muted-foreground" : "text-foreground"
                      }`}>
                        {chapter.title}
                      </span>
                      {!chapter.locked && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </MockupPhone>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-4"
          >
            <div className="bg-card/50 border border-border/50 rounded-2xl p-5">
              <h4 className="font-display font-bold text-lg mb-3">O que você vai aprender:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-gold">✦</span>
                  <span className="text-muted-foreground">Como identificar e neutralizar crenças sabotadoras que te impedem de emagrecer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✦</span>
                  <span className="text-muted-foreground">Técnicas de PNL para reprogramar sua relação com a comida</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✦</span>
                  <span className="text-muted-foreground">Como usar a neuroplasticidade a seu favor para criar novos hábitos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✦</span>
                  <span className="text-muted-foreground">Estratégias para eliminar a fome emocional de vez</span>
                </li>
              </ul>
            </div>

            <div className="bg-gold/10 border border-gold/20 rounded-2xl p-5">
              <p className="text-gold font-display font-bold">
                "Emagrecimento duradouro começa na mente, não no prato."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MindsetPreviewSection;
