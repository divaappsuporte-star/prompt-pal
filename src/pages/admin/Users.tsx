import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, UserX, UserCheck, Unlock, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { DIET_INFO } from "@/types/diet";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { users, isLoading, suspendUser, grantDietAccess, revokeDietAccess } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.id.includes(search)
  );

  const handleSuspend = async (userId: string, suspend: boolean) => {
    const { error } = await suspendUser(userId, suspend);
    if (error) {
      toast.error("Erro ao atualizar status do usuário");
    } else {
      toast.success(suspend ? "Usuário suspenso" : "Usuário reativado");
    }
  };

  const handleGrantDiet = async (userId: string, dietType: string) => {
    const { error } = await grantDietAccess(userId, dietType);
    if (error) {
      toast.error("Erro ao liberar dieta");
    } else {
      toast.success("Dieta liberada com sucesso");
    }
  };

  const handleRevokeDiet = async (userId: string, dietType: string) => {
    const { error } = await revokeDietAccess(userId, dietType);
    if (error) {
      toast.error("Erro ao revogar dieta");
    } else {
      toast.success("Acesso à dieta revogado");
    }
  };

  const allDietTypes = Object.keys(DIET_INFO);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Logo size="sm" />
            <span className="text-sm font-medium text-muted-foreground">
              | Usuários
            </span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </Button>
          <Button variant="default" size="sm">
            Usuários
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {users.length}</span>
          <span>Ativos: {users.filter((u) => !u.is_suspended).length}</span>
          <span className="text-destructive">
            Suspensos: {users.filter((u) => u.is_suspended).length}
          </span>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando usuários...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible
                  open={expandedUser === user.id}
                  onOpenChange={(open) =>
                    setExpandedUser(open ? user.id : null)
                  }
                >
                  <Card
                    className={`glass-card border-border/30 ${
                      user.is_suspended ? "opacity-60" : ""
                    }`}
                  >
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground">
                                {user.full_name || "Sem nome"}
                              </h3>
                              {user.is_suspended && (
                                <Badge variant="destructive" className="text-xs">
                                  Suspenso
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                            {user.active_plan && (
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-coral/20 text-coral"
                                >
                                  {user.active_plan.diet_type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Dia {user.active_plan.current_day}/21
                                </span>
                              </div>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              expandedUser === user.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                        {/* User Info */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Peso:</span>{" "}
                            <span className="text-foreground">
                              {user.weight_kg ? `${user.weight_kg}kg` : "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Meta:</span>{" "}
                            <span className="text-foreground">
                              {user.goal_weight_kg
                                ? `${user.goal_weight_kg}kg`
                                : "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Cadastro:
                            </span>{" "}
                            <span className="text-foreground">
                              {new Date(user.created_at).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Diet Access */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Dietas Liberadas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {user.diet_access && user.diet_access.length > 0 ? (
                              user.diet_access.map((diet) => (
                                <Badge
                                  key={diet}
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-destructive/20"
                                  onClick={() => handleRevokeDiet(user.id, diet)}
                                >
                                  {diet} ✕
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Nenhuma dieta liberada
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Grant Diet */}
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) =>
                              handleGrantDiet(user.id, value)
                            }
                          >
                            <SelectTrigger className="flex-1 bg-card border-border/50">
                              <SelectValue placeholder="Liberar dieta..." />
                            </SelectTrigger>
                            <SelectContent>
                              {allDietTypes
                                .filter(
                                  (d) => !user.diet_access?.includes(d)
                                )
                                .map((diet) => (
                                  <SelectItem key={diet} value={diet}>
                                    {DIET_INFO[diet as keyof typeof DIET_INFO]?.name || diet}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                          >
                            <Unlock className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Suspend/Activate Button */}
                        <Button
                          variant={user.is_suspended ? "default" : "destructive"}
                          className="w-full"
                          onClick={() =>
                            handleSuspend(user.id, !user.is_suspended)
                          }
                        >
                          {user.is_suspended ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reativar Usuário
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4 mr-2" />
                              Suspender Usuário
                            </>
                          )}
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
