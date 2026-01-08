import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DietType, UserActivePlan, CompletedMeal, DailyFeedback } from "@/types/diet";

export function useAllActivePlans() {
  const { user } = useAuth();

  const { data: activePlans, isLoading } = useQuery({
    queryKey: ['all-active-plans', user?.id],
    queryFn: async () => {
      if (!user) return {};
      
      const { data, error } = await supabase
        .from('user_active_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      
      const plansMap: Partial<Record<DietType, UserActivePlan>> = {};
      
      if (data) {
        data.forEach(plan => {
          plansMap[plan.diet_type as DietType] = {
            ...plan,
            completed_meals: (plan.completed_meals as unknown as CompletedMeal[]) || [],
            daily_feedbacks: (plan.daily_feedbacks as unknown as DailyFeedback[]) || [],
          } as UserActivePlan;
        });
      }
      
      return plansMap;
    },
    enabled: !!user,
  });

  const hasActivePlan = (dietType: DietType): boolean => {
    return !!activePlans?.[dietType];
  };

  const getActivePlan = (dietType: DietType): UserActivePlan | null => {
    return activePlans?.[dietType] || null;
  };

  return {
    activePlans: activePlans || {},
    isLoading,
    hasActivePlan,
    getActivePlan,
  };
}
