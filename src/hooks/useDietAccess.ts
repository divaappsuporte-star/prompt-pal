import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DietType, DietAccess } from "@/types/diet";

export function useDietAccess() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's diet access
  const { data: dietAccess, isLoading } = useQuery({
    queryKey: ['diet-access', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_diet_access')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data || []) as DietAccess[];
    },
    enabled: !!user,
  });

  // Check if user has access to a specific diet
  const hasDietAccess = (dietType: DietType): boolean => {
    if (!dietAccess) return false;
    
    const access = dietAccess.find(a => a.diet_type === dietType);
    if (!access) return false;

    // Check if access has expired
    if (access.expires_at && new Date(access.expires_at) < new Date()) {
      return false;
    }

    return true;
  };

  // Get list of unlocked diets
  const unlockedDiets = dietAccess?.map(a => a.diet_type) || [];

  return {
    dietAccess,
    isLoading,
    hasDietAccess,
    unlockedDiets,
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
