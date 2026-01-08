import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DietType, UserActivePlan, CompletedMeal, DailyFeedback, MealFeedback } from "@/types/diet";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export function useActivePlan(dietType?: DietType) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's active plan for a specific diet
  const { data: activePlan, isLoading } = useQuery({
    queryKey: ['active-plan', user?.id, dietType],
    queryFn: async () => {
      if (!user || !dietType) return null;
      
      const { data, error } = await supabase
        .from('user_active_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('diet_type', dietType)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          completed_meals: (data.completed_meals as unknown as CompletedMeal[]) || [],
          daily_feedbacks: (data.daily_feedbacks as unknown as DailyFeedback[]) || [],
        } as UserActivePlan;
      }
      
      return null;
    },
    enabled: !!user && !!dietType,
  });

  // Create a new active plan
  const createPlan = useMutation({
    mutationFn: async ({ 
      targetWeightLoss 
    }: {
      targetWeightLoss: number 
    }) => {
      if (!user || !dietType || !profile?.weight_kg) {
        throw new Error('Missing required data');
      }

      const startWeight = Number(profile.weight_kg);
      const targetWeight = startWeight - targetWeightLoss;

      const { data, error } = await supabase
        .from('user_active_plans')
        .insert({
          user_id: user.id,
          diet_type: dietType,
          target_weight_loss: targetWeightLoss,
          start_weight: startWeight,
          target_weight: targetWeight,
          current_day: 1,
          status: 'active',
          completed_meals: [],
          daily_feedbacks: [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-plan', user?.id, dietType] });
      toast.success('Plano de 21 dias iniciado!');
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast.error('Erro ao criar plano');
    },
  });

  // Mark a meal as completed
  const completeMeal = useMutation({
    mutationFn: async ({ 
      day, 
      mealType, 
      recipeName,
      feedback 
    }: { 
      day: number;
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      recipeName: string;
      feedback: MealFeedback;
    }) => {
      if (!activePlan) throw new Error('No active plan');

      const newCompletedMeal: CompletedMeal = {
        day,
        meal_type: mealType,
        completed_at: new Date().toISOString(),
        recipe_name: recipeName,
      };

      const newFeedback: DailyFeedback = {
        day,
        meal_type: mealType as 'breakfast' | 'lunch' | 'dinner',
        feedback,
        received_at: new Date().toISOString(),
      };

      const updatedMeals = [...activePlan.completed_meals, newCompletedMeal];
      const updatedFeedbacks = [...activePlan.daily_feedbacks, newFeedback];

      const { error } = await supabase
        .from('user_active_plans')
        .update({
          completed_meals: updatedMeals as unknown as Json,
          daily_feedbacks: updatedFeedbacks as unknown as Json,
        })
        .eq('id', activePlan.id);

      if (error) throw error;
      
      return { meal: newCompletedMeal, feedback: newFeedback };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-plan', user?.id, dietType] });
    },
  });

  // Advance to next day
  const advanceDay = useMutation({
    mutationFn: async () => {
      if (!activePlan) throw new Error('No active plan');
      
      const newDay = activePlan.current_day + 1;
      const newStatus = newDay > 21 ? 'completed' : 'active';

      const { error } = await supabase
        .from('user_active_plans')
        .update({
          current_day: Math.min(newDay, 21),
          status: newStatus,
        })
        .eq('id', activePlan.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-plan', user?.id, dietType] });
    },
  });

  // Get today's feedbacks
  const todayFeedbacks = activePlan?.daily_feedbacks.filter(f => {
    const today = new Date().toDateString();
    return new Date(f.received_at).toDateString() === today;
  }) || [];

  // Check if a specific meal is completed for a day
  const isMealCompleted = (day: number, mealType: string): boolean => {
    return activePlan?.completed_meals.some(
      m => m.day === day && m.meal_type === mealType
    ) || false;
  };

  return {
    activePlan,
    isLoading,
    createPlan,
    completeMeal,
    advanceDay,
    todayFeedbacks,
    isMealCompleted,
  };
}
