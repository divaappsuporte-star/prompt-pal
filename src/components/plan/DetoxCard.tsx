import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Droplets,
  CheckCircle2, 
  Circle,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetoxRecipe {
  name: string;
  description: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
}

interface DetoxCardProps {
  recipe: DetoxRecipe;
  time: string;
  completed: boolean;
  onComplete: () => void;
}

// Default detox recipes that rotate based on day
const DETOX_RECIPES: DetoxRecipe[] = [
  {
    name: "Suco Verde Detox Clássico",
    description: "Suco refrescante com couve, limão e gengibre para acelerar o metabolismo",
    calories: 85,
    ingredients: [
      "2 folhas de couve manteiga",
      "1 maçã verde",
      "1/2 limão (suco)",
      "1 pedaço pequeno de gengibre",
      "200ml de água de coco",
      "Hortelã a gosto"
    ],
    instructions: [
      "Lave bem todos os ingredientes",
      "Corte a maçã em pedaços (pode deixar a casca)",
      "Coloque todos os ingredientes no liquidificador",
      "Bata por 2-3 minutos até ficar homogêneo",
      "Coe se preferir e sirva gelado"
    ],
    benefits: [
      "Acelera o metabolismo",
      "Desintoxica o fígado",
      "Rica em clorofila e antioxidantes",
      "Auxilia na digestão"
    ]
  },
  {
    name: "Suco Anti-inflamatório",
    description: "Combinação poderosa de abacaxi, gengibre e açafrão para reduzir inflamação",
    calories: 95,
    ingredients: [
      "2 fatias de abacaxi",
      "1 cenoura média",
      "1 pedaço de gengibre (2cm)",
      "1/4 colher de açafrão em pó",
      "200ml de água",
      "Gelo a gosto"
    ],
    instructions: [
      "Descasque a cenoura e corte em pedaços",
      "Adicione o abacaxi e a cenoura no liquidificador",
      "Acrescente o gengibre, açafrão e água",
      "Bata até ficar cremoso",
      "Sirva com gelo"
    ],
    benefits: [
      "Reduz inflamação no corpo",
      "Melhora a digestão",
      "Fortalece o sistema imune",
      "Rico em vitamina C e bromelina"
    ]
  },
  {
    name: "Suco Emagrecedor Noturno",
    description: "Suco leve com pepino e limão ideal para o período noturno",
    calories: 65,
    ingredients: [
      "1/2 pepino",
      "1 limão inteiro (suco)",
      "1 talo de salsão",
      "5 folhas de hortelã",
      "200ml de água gelada"
    ],
    instructions: [
      "Lave e corte o pepino em rodelas",
      "Pique o salsão em pedaços",
      "Esprema o limão",
      "Bata tudo no liquidificador",
      "Sirva bem gelado"
    ],
    benefits: [
      "Diurético natural",
      "Baixíssimas calorias",
      "Hidrata profundamente",
      "Auxilia no sono reparador"
    ]
  }
];

const DetoxCard = ({ recipe, time, completed, onComplete }: DetoxCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`glass-card rounded-xl overflow-hidden transition-colors border ${
        completed 
          ? 'border-mint/50 bg-mint/5' 
          : 'border-mint/30'
      }`}
    >
      {/* Header */}
      <motion.button
        layout="position"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-mint/5 transition-colors"
      >
        {completed ? (
          <CheckCircle2 className="w-6 h-6 text-mint flex-shrink-0" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-mint flex items-center justify-center">
            <Droplets className="w-3.5 h-3.5 text-mint" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Leaf className="w-4 h-4 text-mint" />
            <span className="text-xs font-semibold uppercase tracking-wide text-mint">
              Suco Detox
            </span>
          </div>
          <p className="font-medium text-foreground truncate">{recipe.name}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-lg bg-mint/10 text-mint text-xs font-medium">
            {recipe.calories} kcal
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {recipe.description}
              </p>

              {/* Benefits */}
              <div className="flex gap-2 flex-wrap">
                {recipe.benefits.map((benefit, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 rounded-full bg-mint/10 text-mint text-xs"
                  >
                    ✓ {benefit}
                  </span>
                ))}
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Ingredientes</h4>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-mint mt-1">•</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Modo de Preparo</h4>
                <ol className="space-y-2">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-mint/20 text-mint text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Complete Button */}
              {!completed && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                  className="w-full bg-mint hover:bg-mint/90 text-background"
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Marcar Suco como Feito
                </Button>
              )}

              {completed && (
                <div className="text-center text-sm text-mint font-medium">
                  ✓ Suco detox concluído
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { DetoxCard, DETOX_RECIPES };
export type { DetoxRecipe };
