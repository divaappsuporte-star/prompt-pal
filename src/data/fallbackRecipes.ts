import { DietType } from "@/types/diet";

export const FALLBACK_MEALS: Record<string, any> = {
  carnivore: {
    breakfast: {
      name: "Ovos com Bacon Crocante",
      description: "3 ovos fritos na manteiga com fatias de bacon artesanal.",
      calories: 450,
      protein: 35,
      fat: 32,
      carbs: 1,
      prep_time: 10,
      ingredients: ["3 ovos", "4 fatias de bacon", "1 colher de sopa de manteiga"],
      instructions: ["Frite o bacon até ficar crocante", "Use a gordura do bacon para fritar os ovos", "Tempere com sal a gosto"]
    },
    lunch: {
      name: "Picanha na Manteiga",
      description: "Fatias de picanha grelhadas com sal grosso e manteiga.",
      calories: 650,
      protein: 55,
      fat: 48,
      carbs: 0,
      prep_time: 20,
      ingredients: ["300g de picanha", "Sal grosso", "1 colher de sopa de manteiga"],
      instructions: ["Grelhe a picanha no ponto desejado", "Finalize com manteiga por cima", "Deixe descansar 2 minutos antes de cortar"]
    },
    dinner: {
      name: "Sobrecoxa de Frango com Pele",
      description: "Sobrecoxas assadas até a pele ficar dourada e crocante.",
      calories: 500,
      protein: 45,
      fat: 35,
      carbs: 0,
      prep_time: 45,
      ingredients: ["2 sobrecoxas de frango", "Sal", "Pimenta do reino"],
      instructions: ["Tempere o frango", "Leve ao forno a 200°C por 40 minutos", "Aumente o fogo no final para pururucar a pele"]
    }
  },
  lowcarb: {
    breakfast: {
      name: "Omelete de Queijo e Espinafre",
      description: "Omelete fofinho recheado com queijo e folhas de espinafre.",
      calories: 350,
      protein: 25,
      fat: 26,
      carbs: 4,
      prep_time: 12,
      ingredients: ["3 ovos", "50g de queijo", "1 xícara de espinafre"],
      instructions: ["Bata os ovos", "Refogue o espinafre rapidamente", "Faça o omelete e recheie com queijo e espinafre"]
    },
    lunch: {
      name: "Frango Grelhado com Brócolis",
      description: "Peito de frango suculento com brócolis no vapor e azeite.",
      calories: 400,
      protein: 40,
      fat: 22,
      carbs: 8,
      prep_time: 15,
      ingredients: ["150g de frango", "2 xícaras de brócolis", "Azeite de oliva"],
      instructions: ["Grelhe o frango temperado", "Cozinhe o brócolis no vapor", "Regue com bastante azeite e sal"]
    },
    dinner: {
      name: "Salmão com Aspargos",
      description: "Filé de salmão grelhado acompanhado de aspargos frescos.",
      calories: 450,
      protein: 35,
      fat: 30,
      carbs: 5,
      prep_time: 20,
      ingredients: ["150g de salmão", "6 aspargos", "Limão"],
      instructions: ["Grelhe o salmão começando pela pele", "Refogue os aspargos no azeite", "Finalize com suco de limão"]
    }
  },
  keto: {
    breakfast: {
      name: "Abacate com Ovos e Azeite",
      description: "Meio abacate com ovos cozidos e um fio generoso de azeite.",
      calories: 400,
      protein: 15,
      fat: 35,
      carbs: 6,
      prep_time: 10,
      ingredients: ["1/2 abacate", "2 ovos cozidos", "Azeite de oliva"],
      instructions: ["Corte o abacate em fatias", "Adicione os ovos por cima", "Tempere com sal, pimenta e azeite"]
    },
    lunch: {
      name: "Hambúrguer Caseiro sem Pão",
      description: "Dois blends de carne com queijo derretido e salada verde.",
      calories: 600,
      protein: 45,
      fat: 45,
      carbs: 5,
      prep_time: 15,
      ingredients: ["200g de carne moída", "2 fatias de queijo", "Alface e tomate"],
      instructions: ["Molde os hambúrgueres", "Grelhe com o queijo por cima", "Sirva sobre uma cama de alface"]
    },
    dinner: {
      name: "Zucchini Noodles à Bolonhesa",
      description: "Macarrão de abobrinha com molho de carne moída e tomate.",
      calories: 380,
      protein: 30,
      fat: 25,
      carbs: 10,
      prep_time: 20,
      ingredients: ["1 abobrinha grande", "150g de carne moída", "Molho de tomate caseiro"],
      instructions: ["Faça tiras de abobrinha", "Refogue a carne com o molho", "Misture a abobrinha rapidamente no molho quente"]
    }
  }
};
