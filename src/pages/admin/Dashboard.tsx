import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStats } from "@/hooks/useAdminStats";
import Logo from "@/components/Logo";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: "Total Usuários",
      value: stats.totalUsers,
      icon: Users,
      color: "text-coral",
      bgColor: "bg-coral/10",
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers,
      icon: Activity,
      color: "text-mint",
      bgColor: "bg-mint/10",
    },
    {
      title: "Faturamento Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      title: "Faturamento Mensal",
      value: `R$ ${stats.monthlyRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const chartConfig = {
    count: { label: "Usuários", color: "hsl(var(--coral))" },
    diet: { label: "Dieta", color: "hsl(var(--gold))" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Logo size="sm" />
            <span className="text-sm font-medium text-muted-foreground">
              | Admin
            </span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/users")}
          >
            Usuários
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {isLoading ? "..." : stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6">
          {/* User Growth Chart */}
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="text-base font-display">
                Crescimento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.userGrowth.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <LineChart data={stats.userGrowth}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => value.slice(5)}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--coral))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Sem dados de crescimento ainda
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Diets Chart */}
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="text-base font-display">
                Dietas Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.popularDiets.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <BarChart data={stats.popularDiets} layout="vertical">
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis
                      dataKey="diet"
                      type="category"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      width={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--gold))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhuma dieta ativa ainda
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
