import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DietType, DietAccess } from "@/types/diet";

// Flag para ativar/desativar monetização
// Quando TRUE: verifica acesso no banco de dados
// Quando FALSE: todas as dietas ficam liberadas
const MONETIZATION_ENABLED = true;

// Dietas principais que precisam ser desbloqueadas (via seleção no plano)
const MAIN_DIETS: DietType[] = ['carnivore', 'keto', 'lowcarb', 'metabolic'];

// Dietas bônus que são sempre visualizáveis (mas não podem ser usadas para criar plano)
const BONUS_DIETS: DietType[] = ['detox', 'fasting'];

export function useDietAccess() {
  const { user } = useAuth();

  // Fetch user's purchased diet access
  const { data: dietAccess, isLoading: accessLoading, refetch: refetchAccess } = useQuery({
    queryKey: ['diet-access', user?.id],
    queryFn: async () => {
      if (!user || !MONETIZATION_ENABLED) return [];
      
      const { data, error } = await supabase
        .from('user_diet_access')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data || []) as DietAccess[];
    },
    enabled: !!user && MONETIZATION_ENABLED,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Fetch user's active plan to know which diet they selected
  const { data: activePlan, isLoading: planLoading } = useQuery({
    queryKey: ['active-plan-access', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_active_plans')
        .select('diet_type, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const isLoading = accessLoading || planLoading;

  // Get the user's selected diet from their active plan
  const selectedDiet = activePlan?.diet_type as DietType | null;

  // Check if user has access to VIEW a specific diet page (educational content)
  // - Jejum and Detox are always viewable
  // - Main diets are only viewable if user selected it in their plan OR purchased it
  const canViewDiet = (dietType: DietType): boolean => {
    if (!MONETIZATION_ENABLED) return true;

    // Bonus diets (jejum/detox) are always viewable
    if (BONUS_DIETS.includes(dietType)) {
      return true;
    }

    // Main diets require either:
    // 1. Being the selected diet in active plan
    // 2. Having purchased access (admin granted)
    if (selectedDiet === dietType) {
      return true;
    }

    // Check if purchased via admin/payment
    const purchased = dietAccess?.find(a => a.diet_type === dietType);
    if (purchased) {
      if (purchased.expires_at && new Date(purchased.expires_at) < new Date()) {
        return false;
      }
      return true;
    }

    return false;
  };

  // Check if diet should show as locked on home screen
  // - Jejum and Detox are never locked (always accessible for viewing)
  // - Main diets are locked unless user has selected one
  const isDietLocked = (dietType: DietType): boolean => {
    if (!MONETIZATION_ENABLED) return false;

    // Bonus diets are never locked
    if (BONUS_DIETS.includes(dietType)) {
      return false;
    }

    // If user has a selected diet in their plan
    if (selectedDiet) {
      // Only the selected diet is unlocked
      return dietType !== selectedDiet;
    }

    // No plan yet - all main diets are locked until user creates a plan
    return true;
  };

  // Legacy function for backward compatibility
  const hasDietAccess = (dietType: DietType): boolean => {
    return canViewDiet(dietType);
  };

  // Check if user has purchased a diet (not just has active plan)
  const hasPurchasedDiet = (dietType: DietType): boolean => {
    if (!MONETIZATION_ENABLED) return true;
    
    const purchased = dietAccess?.find(a => a.diet_type === dietType);
    if (!purchased) return false;
    
    if (purchased.expires_at && new Date(purchased.expires_at) < new Date()) {
      return false;
    }
    return true;
  };

  // Check if user can select a diet for creating a plan
  // Main diets can be selected if user hasn't created a plan yet
  const canSelectDietForPlan = (dietType: DietType): boolean => {
    if (!MONETIZATION_ENABLED) return true;
    
    // Only main diets can be selected for plans
    if (!MAIN_DIETS.includes(dietType)) {
      return false;
    }

    // If user already has a plan, they can't select a new diet
    if (selectedDiet) {
      return false;
    }

    return true;
  };

  // Get list of purchased diets (admin granted)
  const purchasedDiets = MONETIZATION_ENABLED 
    ? (dietAccess?.filter(a => !a.expires_at || new Date(a.expires_at) >= new Date()).map(a => a.diet_type) || [])
    : MAIN_DIETS;

  // Get list of diets user can view
  const viewableDiets = MONETIZATION_ENABLED 
    ? [...BONUS_DIETS, ...(selectedDiet ? [selectedDiet] : []), ...purchasedDiets].filter((v, i, a) => a.indexOf(v) === i)
    : [...MAIN_DIETS, ...BONUS_DIETS];

  // Legacy: Get list of unlocked diets
  const unlockedDiets = viewableDiets;

  return {
    dietAccess,
    isLoading,
    hasDietAccess,
    hasPurchasedDiet,
    purchasedDiets,
    unlockedDiets,
    viewableDiets,
    selectedDiet,
    canViewDiet,
    isDietLocked,
    canSelectDietForPlan,
    monetizationEnabled: MONETIZATION_ENABLED,
    refetch: refetchAccess,
    mainDiets: MAIN_DIETS,
    bonusDiets: BONUS_DIETS,
  };
}

export function useUserRole() {
  const { user } = useAuth();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(r => r.role) || [];
    },
    enabled: !!user,
    staleTime: 0,
  });

  const isSuperAdmin = roles?.includes('super_admin') || false;
  const isAdmin = roles?.includes('admin') || isSuperAdmin;

  return {
    roles,
    isLoading,
    isSuperAdmin,
    isAdmin,
  };
}
