import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, UserX, UserCheck, Unlock, ChevronDown, UserPlus, X } from "lucide-react";
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
import { z } from "zod";

const newUserSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  fullName: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const AdminUsers = () => {
  const navigate = useNavigate();
  const { users, isLoading, suspendUser, grantDietAccess, revokeDietAccess, createUser, refetch } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    fullName: "",
    password: "",
  });
  const [newUserErrors, setNewUserErrors] = useState<{
    email?: string;
    fullName?: string;
    password?: string;
  }>({});

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

  const handleNewUserChange = (field: string, value: string) => {
    setNewUserData((prev) => ({ ...prev, [field]: value }));
    setNewUserErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setNewUserErrors({});

    try {
      const result = newUserSchema.safeParse(newUserData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setNewUserErrors(fieldErrors);
        setIsCreating(false);
        return;
      }

      const { error } = await createUser(
        newUserData.email,
        newUserData.password,
        newUserData.fullName
      );

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Usuário criado com sucesso!");
        setShowNewUserModal(false);
        setNewUserData({ email: "", fullName: "", password: "" });
        refetch();
      }
    } catch (error) {
      toast.error("Erro ao criar usuário");
    } finally {
      setIsCreating(false);
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
          <Button
            size="sm"
            className="gradient-coral text-primary-foreground"
            onClick={() => setShowNewUserModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo
          </Button>
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

      {/* New User Modal */}
      <AnimatePresence>
        {showNewUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-foreground">
                  Cadastrar Novo Usuário
                </h2>
                <button
                  onClick={() => setShowNewUserModal(false)}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Nome completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Nome do usuário"
                    value={newUserData.fullName}
                    onChange={(e) => handleNewUserChange("fullName", e.target.value)}
                    className="bg-muted border-border"
                  />
                  {newUserErrors.fullName && (
                    <p className="text-sm text-destructive mt-1">{newUserErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newUserData.email}
                    onChange={(e) => handleNewUserChange("email", e.target.value)}
                    className="bg-muted border-border"
                  />
                  {newUserErrors.email && (
                    <p className="text-sm text-destructive mt-1">{newUserErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Senha inicial
                  </label>
                  <Input
                    type="text"
                    placeholder="Senha temporária"
                    value={newUserData.password}
                    onChange={(e) => handleNewUserChange("password", e.target.value)}
                    className="bg-muted border-border"
                  />
                  {newUserErrors.password && (
                    <p className="text-sm text-destructive mt-1">{newUserErrors.password}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    O usuário receberá um email com link de acesso.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full gradient-coral text-primary-foreground font-semibold py-6 mt-4"
                >
                  {isCreating ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Cadastrar Usuário
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
