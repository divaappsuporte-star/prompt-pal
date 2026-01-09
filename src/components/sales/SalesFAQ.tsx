import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Vou passar fome?",
    answer: "Não. O foco do Nutri21 é saciedade metabólica. As refeições são ricas em proteínas e gorduras boas que mantêm você satisfeito por mais tempo, eliminando a fome e a vontade de beliscar.",
  },
  {
    question: "Preciso cozinhar coisas difíceis?",
    answer: "Não. Todas as receitas são simples e adaptáveis à sua realidade. Você não precisa ser chef para seguir o protocolo.",
  },
  {
    question: "Funciona para homens e mulheres?",
    answer: "Sim. O sistema se adapta ao seu perfil, peso e objetivo, funcionando tanto para homens quanto para mulheres de qualquer idade.",
  },
  {
    question: "E se eu errar um dia?",
    answer: "O sistema ensina como ajustar. Um erro não arruina seu progresso. O Nutri21 te mostra como retomar sem culpa e continuar evoluindo.",
  },
  {
    question: "Preciso de acompanhamento médico?",
    answer: "Se você tem condições de saúde específicas (diabetes, hipertensão, etc.), recomendamos consultar seu médico. O sistema identifica condições e adapta recomendações, mas não substitui orientação médica.",
  },
  {
    question: "Como funciona o acesso?",
    answer: "Após o pagamento, você recebe acesso imediato ao sistema. Basta criar sua conta e começar. O acesso é vitalício, sem mensalidades.",
  },
  {
    question: "Posso usar no celular?",
    answer: "Sim! O Nutri21 funciona como um app no seu celular (Android ou iPhone) e também no computador. Você pode instalar na tela inicial sem precisar da App Store ou Google Play.",
  },
  {
    question: "E se não funcionar para mim?",
    answer: "O método é baseado em ciência e funciona quando seguido corretamente. Se você seguir o protocolo e não ver resultados, entre em contato com nosso suporte.",
  },
];

const SalesFAQ = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-bold">DÚVIDAS FREQUENTES</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Perguntas Frequentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 border border-border/50 rounded-xl px-4 data-[state=open]:border-coral/30"
              >
                <AccordionTrigger className="text-left font-display font-bold text-foreground hover:text-coral hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default SalesFAQ;
