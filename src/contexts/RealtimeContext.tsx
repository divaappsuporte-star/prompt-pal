import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RealtimeContextType {
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({ isConnected: false });

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    console.log("🔄 Setting up realtime subscriptions for user:", user.id);

    // Channel for user-specific data changes
    const userChannel = supabase
      .channel(`user-data-${user.id}`)
      // Diet access changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_diet_access',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🎉 Diet access changed:', payload);
          // Small delay to ensure DB has propagated
          setTimeout(() => {
            // Invalidate all diet-related queries with user id
            queryClient.invalidateQueries({ queryKey: ['diet-access', user.id] });
            queryClient.invalidateQueries({ queryKey: ['diet-access'] });
            queryClient.invalidateQueries({ queryKey: ['user-diets'] });
            queryClient.invalidateQueries({ queryKey: ['active-plan-access', user.id] });
            
            // Force refetch
            queryClient.refetchQueries({ queryKey: ['diet-access', user.id] });
          }, 100);
          
          // Show notification
          if (payload.eventType === 'INSERT') {
            toast.success('Nova dieta liberada!', {
              description: 'Atualizando...',
            });
          }
        }
      )
      // Active plans changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_active_plans',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📋 Active plan changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['active-plan'] });
          queryClient.invalidateQueries({ queryKey: ['active-plan-access'] });
          queryClient.invalidateQueries({ queryKey: ['activePlan'] });
          queryClient.invalidateQueries({ queryKey: ['all-active-plans'] });
        }
      )
      // Profile changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('👤 Profile changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
      )
      // User roles changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🔑 Roles changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-roles'] });
        }
      )
      // Progress changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📊 Progress changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-progress'] });
          // Dispatch event for localStorage-based progress hook
          window.dispatchEvent(new Event("progressUpdate"));
        }
      )
      .subscribe((status, err) => {
        console.log('🔌 Realtime subscription status:', status, err);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          console.error('Realtime channel error:', err);
        }
      });

    return () => {
      console.log("🔌 Cleaning up realtime subscriptions");
      supabase.removeChannel(userChannel);
      setIsConnected(false);
    };
  }, [user?.id, queryClient]);

  return (
    <RealtimeContext.Provider value={{ isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  return useContext(RealtimeContext);
};
