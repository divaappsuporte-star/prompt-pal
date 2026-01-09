import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminUser {
  id: string;
  full_name: string | null;
  email?: string;
  is_suspended: boolean;
  suspended_at: string | null;
  created_at: string;
  weight_kg: number | null;
  goal_weight_kg: number | null;
  diet_preference: string | null;
  active_plan?: {
    diet_type: string;
    current_day: number;
    status: string;
  } | null;
  diet_access?: string[];
}

export const useAdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setIsLoading(false);
      return;
    }

    // Fetch active plans for all users
    const { data: activePlans } = await supabase
      .from("user_active_plans")
      .select("user_id, diet_type, current_day, status")
      .eq("status", "active");

    // Fetch diet access for all users
    const { data: dietAccess } = await supabase
      .from("user_diet_access")
      .select("user_id, diet_type");

    // Combine data
    const combinedUsers: AdminUser[] = profiles.map((profile) => ({
      id: profile.id,
      full_name: profile.full_name,
      is_suspended: profile.is_suspended || false,
      suspended_at: profile.suspended_at,
      created_at: profile.created_at,
      weight_kg: profile.weight_kg,
      goal_weight_kg: profile.goal_weight_kg,
      diet_preference: profile.diet_preference,
      active_plan: activePlans?.find((p) => p.user_id === profile.id) || null,
      diet_access: dietAccess
        ?.filter((d) => d.user_id === profile.id)
        .map((d) => d.diet_type) || [],
    }));

    setUsers(combinedUsers);
    setIsLoading(false);
  };

  const suspendUser = async (userId: string, suspend: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        is_suspended: suspend,
        suspended_at: suspend ? new Date().toISOString() : null,
        suspended_by: suspend ? user?.id : null,
      })
      .eq("id", userId);

    if (!error) {
      await fetchUsers();
    }
    return { error };
  };

  const grantDietAccess = async (userId: string, dietType: string) => {
    const { error } = await supabase
      .from("user_diet_access")
      .insert({
        user_id: userId,
        diet_type: dietType as "carnivore" | "detox" | "fasting" | "keto" | "lowcarb" | "metabolic",
        granted_by: "admin_manual",
      });

    if (!error) {
      await fetchUsers();
    }
    return { error };
  };

  const revokeDietAccess = async (userId: string, dietType: string) => {
    const { error } = await supabase
      .from("user_diet_access")
      .delete()
      .eq("user_id", userId)
      .eq("diet_type", dietType as "carnivore" | "detox" | "fasting" | "keto" | "lowcarb" | "metabolic");

    if (!error) {
      await fetchUsers();
    }
    return { error };
  };

  const createUser = async (email: string, password: string, fullName: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.session?.access_token}`,
          },
          body: JSON.stringify({ email, password, fullName }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return { error: new Error(result.error || "Failed to create user") };
      }

      await fetchUsers();
      return { error: null, data: result };
    } catch (error) {
      return { error: error as Error };
    }
  };

  useEffect(() => {
    fetchUsers();

    // Set up realtime subscription
    const channel = supabase
      .channel("admin-profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users,
    isLoading,
    suspendUser,
    grantDietAccess,
    revokeDietAccess,
    createUser,
    refetch: fetchUsers,
  };
};
