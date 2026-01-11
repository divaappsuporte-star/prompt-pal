import { DietType } from "@/types/diet";

export const FALLBACK_MEALS: Record<string, any> = {
  carnivore: {
    breakfast: [
      {
        name: "Ovos com Bacon Artesanal",
        description: "3 ovos fritos na própria gordura do bacon. 100% Carnívoro.",
        calories: 450, protein: 35, fat: 32, carbs: 0, prep_time: 10,
        ingredients: ["3 ovos grandes", "4 fatias de bacon sem açúcar", "Sal marinho"],
        instructions: ["Frite o bacon até soltar a gordura", "Quebre os ovos na mesma frigideira", "Tempere apenas com sal"]
      },
      {
        name: "Omelete de Carne Moída",
        description: "Omelete recheado com carne moída refogada na banha.",
        calories: 500, protein: 42, fat: 38, carbs: 0, prep_time: 15,
        ingredients: ["3 ovos", "100g de carne moída (patinho ou acém)", "Banha de porco"],
        instructions: ["Refogue a carne com sal", "Bata os ovos e jogue por cima", "Dobre e sirva"]
      }
    ],
    lunch: [
      {
        name: "Picanha com Sal Grosso",
        description: "Corte nobre grelhado apenas com sal grosso. Gordura preservada.",
        calories: 700, protein: 50, fat: 55, carbs: 0, prep_time: 20,
        ingredients: ["300g de picanha", "Sal grosso"],
        instructions: ["Grelhe a gordura primeiro", "Sele os dois lados da carne", "Deixe descansar antes de fatiar"]
      },
      {
        name: "Costela Bovina Assada",
        description: "Costela assada lentamente, soltando do osso.",
        calories: 800, protein: 45, fat: 65, carbs: 0, prep_time: 180,
        ingredients: ["400g de costela janela", "Sal grosso"],
        instructions: ["Envolva no papel alumínio com sal", "Asse por 2h30", "Retire o papel e doure por 30 min"]
      }
    ],
    dinner: [
      {
        name: "Fígado Acebolado (Opcional) ou Maminha",
        description: "Maminha suculenta na manteiga clarificada.",
        calories: 550, protein: 48, fat: 40, carbs: 0, prep_time: 25,
        ingredients: ["250g de maminha", "Manteiga Ghee", "Sal"],
        instructions: ["Aqueça a frigideira com Ghee", "Grelhe a maminha em bifes grossos", "Tempere com sal após grelhar"]
      },
      {
        name: "Coração de Galinha na Chapa",
        description: "Corações de galinha grelhados com sal e banha.",
        calories: 480, protein: 38, fat: 35, carbs: 0, prep_time: 15,
        ingredients: ["250g de coração de galinha", "Banha de porco", "Sal"],
        instructions: ["Limpe os corações", "Grelhe em fogo alto até dourar", "Sirva bem quente"]
      }
    ]
  },
  keto: {
    breakfast: [
      {
        name: "Abacate com Ovos e Azeite",
        description: "Combinação perfeita de gorduras boas e proteínas.",
        calories: 420, protein: 14, fat: 38, carbs: 5, prep_time: 5,
        ingredients: ["1/2 abacate", "2 ovos cozidos", "2 colheres de azeite extra virgem"],
        instructions: ["Amasse levemente o abacate", "Pique os ovos por cima", "Regue com azeite e sal"]
      },
      {
        name: "Café à Prova de Balas (Bulletproof)",
        description: "Café com manteiga e óleo de coco para energia mental.",
        calories: 300, protein: 1, fat: 34, carbs: 0, prep_time: 5,
        ingredients: ["1 xícara de café preto", "1 colher de manteiga Ghee", "1 colher de óleo de coco"],
        instructions: ["Prepare o café quente", "Bata tudo no liquidificador até espumar", "Beba imediatamente"]
      }
    ],
    lunch: [
      {
        name: "Salmão com Aspargos e Manteiga",
        description: "Peixe rico em ômega-3 com vegetais de baixo amido.",
        calories: 550, protein: 35, fat: 45, carbs: 4, prep_time: 20,
        ingredients: ["150g de salmão", "100g de aspargos", "Manteiga"],
        instructions: ["Grelhe o salmão na manteiga", "Refogue os aspargos na mesma gordura", "Tempere com limão e sal"]
      },
      {
        name: "Coxa de Frango com Couve-Flor Gratinada",
        description: "Frango suculento com 'arroz' de couve-flor rico em gordura.",
        calories: 600, protein: 38, fat: 48, carbs: 7, prep_time: 40,
        ingredients: ["2 coxas de frango", "200g de couve-flor", "Creme de leite fresco"],
        instructions: ["Asse o frango", "Rale a couve-flor e refogue com creme de leite", "Finalize com queijo parmesão"]
      }
    ],
    dinner: [
      {
        name: "Salada de Atum com Maionese Caseira",
        description: "Atum, ovos e maionese de azeite. Zero carbo líquido.",
        calories: 480, protein: 32, fat: 38, carbs: 2, prep_time: 10,
        ingredients: ["1 lata de atum em óleo", "2 ovos cozidos", "Maionese de azeite caseira"],
        instructions: ["Misture o atum com os ovos picados", "Adicione a maionese", "Sirva sobre folhas de alface"]
      },
      {
        name: "Espaguete de Abobrinha ao Pesto",
        description: "Abobrinha em tiras com molho pesto rico em nozes e azeite.",
        calories: 450, protein: 12, fat: 42, carbs: 6, prep_time: 15,
        ingredients: ["1 abobrinha", "Molho pesto (manjericão, azeite, nozes)", "Parmesão"],
        instructions: ["Faça o espaguete de abobrinha", "Refogue por 2 minutos", "Misture o pesto e o queijo"]
      }
    ]
  },
  lowcarb: {
    breakfast: [
      {
        name: "Iogurte Grego com Mix de Castanhas",
        description: "Iogurte natural sem açúcar com gorduras boas.",
        calories: 320, protein: 18, fat: 22, carbs: 12, prep_time: 5,
        ingredients: ["150g de iogurte grego natural", "30g de castanhas do pará", "Sementes de chia"],
        instructions: ["Coloque o iogurte em uma tigela", "Adicione as castanhas picadas", "Finalize com a chia"]
      }
    ],
    lunch: [
      {
        name: "Sobrecoxa com Purê de Abóbora",
        description: "Frango assado com purê de abóbora cabotiá.",
        calories: 450, protein: 35, fat: 28, carbs: 15, prep_time: 45,
        ingredients: ["2 sobrecoxas", "150g de abóbora cabotiá", "Azeite"],
        instructions: ["Asse o frango", "Cozinhe a abóbora e amasse com azeite", "Tempere com ervas finas"]
      }
    ],
    dinner: [
      {
        name: "Sopa de Legumes com Carne",
        description: "Sopa leve com legumes de baixo índice glicêmico.",
        calories: 350, protein: 28, fat: 18, carbs: 18, prep_time: 30,
        ingredients: ["100g de carne em cubos", "Chuchu, vagem e cenoura", "Caldo de carne natural"],
        instructions: ["Cozinhe a carne na pressão", "Adicione os legumes picados", "Cozinhe até ficarem macios"]
      }
    ]
  }
};
