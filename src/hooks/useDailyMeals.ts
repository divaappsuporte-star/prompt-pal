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
        // Fallback para receitas locais se não encontrar no banco
        const fallback = FALLBACK_MEALS[dietType] || FALLBACK_MEALS['lowcarb'];
        return {
          id: 'fallback',
          diet_type: dietType,
          target_kg_loss: targetKgLoss,
          day_number: dayNumber,
          phase: "Adaptação",
          breakfast: fallback.breakfast,
          lunch: fallback.lunch,
          dinner: fallback.dinner,
          snacks: null,
          total_calories: fallback.breakfast.calories + fallback.lunch.calories + fallback.dinner.calories,
          macros: {
            protein: fallback.breakfast.protein + fallback.lunch.protein + fallback.dinner.protein,
            fat: fallback.breakfast.fat + fallback.lunch.fat + fallback.dinner.fat,
            carbs: fallback.breakfast.carbs + fallback.lunch.carbs + fallback.dinner.carbs,
          },
          daily_deficit: 500,
          cumulative_loss: 0,
          body_explanation: {
            title: "Início da Jornada",
            description: "Seu corpo está começando a se adaptar à nova distribuição de macros. Mantenha a constância!"
          },
          meal_feedbacks: {
            breakfast: "Ótimo começo de dia!",
            lunch: "Refeição nutritiva e saciante.",
            dinner: "Finalizando o dia com leveza."
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
