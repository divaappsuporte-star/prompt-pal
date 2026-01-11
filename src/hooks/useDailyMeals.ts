import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DietType } from "@/types/diet";
import { FALLBACK_MEALS } from "@/data/fallbackRecipes";

interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  prep_time: number;
  ingredients: string[];
  instructions: string[];
}

interface Snack {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface BodyExplanation {
  title: string;
  description: string;
}

interface MealFeedbacks {
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface DailyMealPlan {
  id: string;
  diet_type: DietType;
  target_kg_loss: number;
  day_number: number;
  phase: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Snack[] | null;
  total_calories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
  daily_deficit: number;
  cumulative_loss: number | null;
  body_explanation: BodyExplanation;
  meal_feedbacks: MealFeedbacks;
}

export const useDailyMeals = (
  dietType: DietType | undefined,
  targetKgLoss: number | undefined,
  dayNumber: number | undefined
) => {
  const { data: dailyPlan, isLoading, error } = useQuery({
    queryKey: ['daily-meal-plan', dietType, targetKgLoss, dayNumber],
    queryFn: async () => {
      if (!dietType || !targetKgLoss || !dayNumber) return null;

      const { data, error } = await supabase
        .from('diet_meal_plans')
        .select('*')
        .eq('diet_type', dietType)
        .eq('target_kg_loss', targetKgLoss)
        .eq('day_number', dayNumber)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily meal plan:', error);
        return null;
      }

      if (!data) {
        // Cérebro 2.0: Seleção inteligente baseada no dia e tipo de dieta
        const dietPool = FALLBACK_MEALS[dietType] || FALLBACK_MEALS['lowcarb'];
        
        // Função para selecionar receita baseada no dia (ciclo rotativo)
        const selectMeal = (meals: any[], day: number) => {
          if (!Array.isArray(meals)) return meals;
          return meals[(day - 1) % meals.length];
        };

        const breakfast = selectMeal(dietPool.breakfast, dayNumber);
        const lunch = selectMeal(dietPool.lunch, dayNumber);
        const dinner = selectMeal(dietPool.dinner, dayNumber);

        return {
          id: `fallback-${dietType}-${dayNumber}`,
          diet_type: dietType,
          target_kg_loss: targetKgLoss,
          day_number: dayNumber,
          phase: dayNumber <= 7 ? "Adaptação" : dayNumber <= 14 ? "Otimização" : "Aceleração",
          breakfast,
          lunch,
          dinner,
          snacks: null,
          total_calories: breakfast.calories + lunch.calories + dinner.calories,
          macros: {
            protein: breakfast.protein + lunch.protein + dinner.protein,
            fat: breakfast.fat + lunch.fat + dinner.fat,
            carbs: breakfast.carbs + lunch.carbs + dinner.carbs,
          },
          daily_deficit: 500,
          cumulative_loss: (dayNumber * 0.2).toFixed(1),
          body_explanation: {
            title: dayNumber <= 7 ? "Fase de Adaptação" : "Queima Ativa",
            description: dayNumber <= 7 
              ? "Seu corpo está aprendendo a usar gordura como fonte primária de energia." 
              : "A lipólise está em ritmo acelerado. Você está queimando gordura estocada agora."
          },
          meal_feedbacks: {
            breakfast: "Energia estável para começar o dia.",
            lunch: "Foco total na saciedade e nutrição.",
            dinner: "Reparação celular e queima noturna."
          }
        } as DailyMealPlan;
      }

      return {
        ...data,
        breakfast: data.breakfast as unknown as Meal,
        lunch: data.lunch as unknown as Meal,
        dinner: data.dinner as unknown as Meal,
        snacks: data.snacks as unknown as Snack[] | null,
        macros: data.macros as unknown as { protein: number; fat: number; carbs: number },
        body_explanation: data.body_explanation as unknown as BodyExplanation,
        meal_feedbacks: data.meal_feedbacks as unknown as MealFeedbacks,
      } as DailyMealPlan;
    },
    enabled: !!dietType && !!targetKgLoss && !!dayNumber,
  });

  return {
    dailyPlan,
    isLoading,
    error,
    hasMealPlan: !!dailyPlan,
  };
};
