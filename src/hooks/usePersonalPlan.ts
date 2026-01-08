import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DietType } from "@/types/diet";
import { toast } from "@/hooks/use-toast";

interface IntegratedModule {
  type: DietType;
  added_at: string;
  is_primary: boolean;
}

interface PersonalPlan {
  id: string;
  user_id: string;
  diet_type: DietType;
  target_weight_loss: number;
  start_weight: number;
  target_weight: number;
  current_day: number;
  status: string;
  started_at: string;
  completed_meals: any[];
  daily_feedbacks: any[];
  integrated_modules?: IntegratedModule[];
}

export const usePersonalPlan = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch the user's active personal plan
  const { data: personalPlan, isLoading } = useQuery({
    queryKey: ['personal-plan', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_active_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching personal plan:', error);
        return null;
      }

      return data as PersonalPlan | null;
    },
    enabled: !!user?.id,
  });

  // Create a new personal plan
  const createPlan = useMutation({
    mutationFn: async ({ 
      dietType, 
      targetWeightLoss 
    }: { 
      dietType: DietType; 
      targetWeightLoss: number;
    }) => {
      if (!user?.id || !profile) {
        throw new Error('User not authenticated');
      }

      const startWeight = profile.weight_kg || 70;
      const targetWeight = startWeight - targetWeightLoss;

      const initialModules: IntegratedModule[] = [
        {
          type: dietType,
          added_at: new Date().toISOString(),
          is_primary: true,
        }
      ];

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
          integrated_modules: initialModules,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-plan'] });
      queryClient.invalidateQueries({ queryKey: ['active-plans'] });
      toast({
        title: "Plano criado!",
        description: "Seu plano personalizado de 21 dias foi criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast({
        title: "Erro ao criar plano",
        description: "Não foi possível criar seu plano. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Integrate a new module to the existing plan
  const integrateModule = useMutation({
    mutationFn: async (moduleType: DietType) => {
      if (!personalPlan) {
        throw new Error('No active plan found');
      }

      const currentModules = (personalPlan.integrated_modules || []) as IntegratedModule[];
      
      // Check if module is already integrated
      if (currentModules.some(m => m.type === moduleType)) {
        throw new Error('Module already integrated');
      }

      const newModule: IntegratedModule = {
        type: moduleType,
        added_at: new Date().toISOString(),
        is_primary: false,
      };

      const { error } = await supabase
        .from('user_active_plans')
        .update({
          integrated_modules: [...currentModules, newModule],
        })
        .eq('id', personalPlan.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-plan'] });
      toast({
        title: "Módulo integrado!",
        description: "O protocolo foi adicionado ao seu plano.",
      });
    },
    onError: (error) => {
      console.error('Error integrating module:', error);
      toast({
        title: "Erro ao integrar",
        description: "Não foi possível adicionar o módulo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Remove a module from the plan
  const removeModule = useMutation({
    mutationFn: async (moduleType: DietType) => {
      if (!personalPlan) {
        throw new Error('No active plan found');
      }

      const currentModules = (personalPlan.integrated_modules || []) as IntegratedModule[];
      const updatedModules = currentModules.filter(m => m.type !== moduleType);

      // Don't allow removing the primary module
      if (!updatedModules.some(m => m.is_primary)) {
        throw new Error('Cannot remove primary module');
      }

      const { error } = await supabase
        .from('user_active_plans')
        .update({
          integrated_modules: updatedModules,
        })
        .eq('id', personalPlan.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-plan'] });
      toast({
        title: "Módulo removido",
        description: "O protocolo foi removido do seu plano.",
      });
    },
    onError: (error: any) => {
      console.error('Error removing module:', error);
      toast({
        title: "Erro ao remover",
        description: error.message === 'Cannot remove primary module' 
          ? "Não é possível remover o protocolo principal." 
          : "Não foi possível remover o módulo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const hasPlan = !!personalPlan;
  const integratedModules = (personalPlan?.integrated_modules || []) as IntegratedModule[];
  const primaryModule = integratedModules.find(m => m.is_primary);

  return {
    personalPlan,
    isLoading,
    hasPlan,
    integratedModules,
    primaryModule,
    createPlan,
    integrateModule,
    removeModule,
  };
};
