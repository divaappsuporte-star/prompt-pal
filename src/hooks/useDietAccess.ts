import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DietType, DietAccess } from "@/types/diet";

// Flag para ativar/desativar monetização
// Quando TRUE: verifica acesso no banco de dados
// Quando FALSE: todas as dietas ficam liberadas
const MONETIZATION_ENABLED = true;

export function useDietAccess() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's purchased diet access
  const { data: dietAccess, isLoading: accessLoading } = useQuery({
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
    staleTime: 0, // Always refetch when component mounts
    refetchOnWindowFocus: true,
  });

  // Set up realtime subscription for diet access changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('diet-access-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_diet_access',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate and refetch diet access when changes occur
          queryClient.invalidateQueries({ queryKey: ['diet-access', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Fetch user's active plan
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
  });

  const isLoading = accessLoading || planLoading;

  // Check if user has access to a specific diet
  const hasDietAccess = (dietType: DietType): boolean => {
    // Se monetização desativada, todas as dietas são liberadas
    if (!MONETIZATION_ENABLED) return true;
    
    // Check if purchased
    const purchased = dietAccess?.find(a => a.diet_type === dietType);
    if (purchased) {
      // Check if access has expired
      if (purchased.expires_at && new Date(purchased.expires_at) < new Date()) {
        return false;
      }
      return true;
    }

    // Check if has active plan with this diet
    if (activePlan?.diet_type === dietType && activePlan?.status === 'active') {
      return true;
    }

    return false;
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

  // Get list of purchased diets
  const purchasedDiets = MONETIZATION_ENABLED 
    ? (dietAccess?.filter(a => !a.expires_at || new Date(a.expires_at) >= new Date()).map(a => a.diet_type) || [])
    : ['carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting'] as DietType[];

  // Get list of unlocked diets (purchased + active plan)
  const unlockedDiets = MONETIZATION_ENABLED 
    ? [...new Set([
        ...(dietAccess?.filter(a => !a.expires_at || new Date(a.expires_at) >= new Date()).map(a => a.diet_type) || []),
        ...(activePlan?.diet_type ? [activePlan.diet_type as DietType] : [])
      ])]
    : ['carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting'] as DietType[];

  return {
    dietAccess,
    isLoading,
    hasDietAccess,
    hasPurchasedDiet,
    purchasedDiets,
    unlockedDiets,
    monetizationEnabled: MONETIZATION_ENABLED,
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
