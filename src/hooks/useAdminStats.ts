import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  popularDiets: { diet: string; count: number }[];
  userGrowth: { date: string; count: number }[];
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    popularDiets: [],
    userGrowth: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);

    // Fetch user counts
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, is_suspended, created_at");

    const totalUsers = profiles?.length || 0;
    const suspendedUsers = profiles?.filter((p) => p.is_suspended).length || 0;
    const activeUsers = totalUsers - suspendedUsers;

    // Fetch active plans count
    const { data: activePlans } = await supabase
      .from("user_active_plans")
      .select("diet_type")
      .eq("status", "active");

    // Count popular diets
    const dietCounts: Record<string, number> = {};
    activePlans?.forEach((plan) => {
      dietCounts[plan.diet_type] = (dietCounts[plan.diet_type] || 0) + 1;
    });
    const popularDiets = Object.entries(dietCounts)
      .map(([diet, count]) => ({ diet, count }))
      .sort((a, b) => b.count - a.count);

    // Fetch transactions for revenue
    const { data: transactions } = await supabase
      .from("payment_transactions")
      .select("amount, created_at, status")
      .eq("status", "completed");

    const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
    // Monthly revenue (current month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = transactions
      ?.filter((t) => new Date(t.created_at) >= monthStart)
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const growthData: Record<string, number> = {};
    profiles?.forEach((p) => {
      const date = new Date(p.created_at).toISOString().split("T")[0];
      if (new Date(p.created_at) >= thirtyDaysAgo) {
        growthData[date] = (growthData[date] || 0) + 1;
      }
    });
    
    const userGrowth = Object.entries(growthData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    setStats({
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalRevenue,
      monthlyRevenue,
      popularDiets,
      userGrowth,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, refetch: fetchStats };
};
