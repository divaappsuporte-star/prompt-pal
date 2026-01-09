import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Ruler, Scale, Target, Droplets, Moon, LogOut, Save, Dumbbell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: (forceClose?: boolean) => void;
  isOnboarding?: boolean;
}

const ProfileModal = ({ isOpen, onClose, isOnboarding = false }: ProfileModalProps) => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    birth_date: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    goal_weight_kg: "",
    activity_level: "",
    diet_preference: "",
    water_goal_ml: "2000",
    sleep_goal_hours: "8",
    show_name: true,
    wants_exercise: true,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        birth_date: profile.birth_date || "",
        gender: profile.gender || "",
        height_cm: profile.height_cm?.toString() || "",
        weight_kg: profile.weight_kg?.toString() || "",
        goal_weight_kg: profile.goal_weight_kg?.toString() || "",
        activity_level: profile.activity_level || "",
        diet_preference: profile.diet_preference || "",
        water_goal_ml: profile.water_goal_ml?.toString() || "2000",
        sleep_goal_hours: profile.sleep_goal_hours?.toString() || "8",
        show_name: profile.show_name ?? true,
        wants_exercise: (profile as any).wants_exercise ?? true,
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation for onboarding - require essential fields
    if (isOnboarding) {
      if (!formData.full_name || !formData.height_cm || !formData.weight_kg || !formData.goal_weight_kg) {
        toast.error("Preencha nome, altura, peso atual e peso meta");
        return;
      }
    }

    setIsSaving(true);

    const updateData: Record<string, unknown> = {
      full_name: formData.full_name || null,
      birth_date: formData.birth_date || null,
      gender: formData.gender || null,
      height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      goal_weight_kg: formData.goal_weight_kg ? parseFloat(formData.goal_weight_kg) : null,
      activity_level: formData.activity_level || null,
      diet_preference: formData.diet_preference || null,
      water_goal_ml: parseInt(formData.water_goal_ml) || 2000,
      sleep_goal_hours: parseInt(formData.sleep_goal_hours) || 8,
      show_name: formData.show_name,
      wants_exercise: formData.wants_exercise,
    };

    const { error } = await updateProfile(updateData);

    if (error) {
      toast.error("Erro ao salvar perfil");
    } else {
      toast.success(isOnboarding ? "Perfil configurado! Bem-vindo!" : "Perfil atualizado!");
      // Force close to bypass the incomplete check since we just saved
      onClose(true);
    }

    setIsSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    toast.success("Até logo!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isOnboarding ? undefined : () => onClose()}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-auto rounded-t-3xl glass-card"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md rounded-t-3xl">
              <h2 className="text-lg font-display font-bold">
                {isOnboarding ? "Complete seu Perfil" : "Meu Perfil"}
              </h2>
              {!isOnboarding && (
                <button
                  onClick={() => onClose()}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-4 space-y-6 pb-8">
              {/* Email (Read-only) */}
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dados Pessoais
                </h3>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Nome completo
                  </label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="Seu nome"
                    className="bg-muted border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Nascimento
                    </label>
                    <Input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleChange("birth_date", e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Sexo
                    </label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Body Measurements */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Medidas Corporais
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Altura (cm)
                    </label>
                    <Input
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => handleChange("height_cm", e.target.value)}
                      placeholder="170"
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Peso (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.weight_kg}
                      onChange={(e) => handleChange("weight_kg", e.target.value)}
                      placeholder="70"
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">
                      Meta (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.goal_weight_kg}
                      onChange={(e) => handleChange("goal_weight_kg", e.target.value)}
                      placeholder="65"
                      className="bg-muted border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Preferências
                </h3>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Dieta Preferida
                  </label>
                  <Select
                    value={formData.diet_preference}
                    onValueChange={(value) => handleChange("diet_preference", value)}
                  >
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhuma">Nenhuma</SelectItem>
                      <SelectItem value="carnivora">Carnívora</SelectItem>
                      <SelectItem value="lowcarb">Low Carb</SelectItem>
                      <SelectItem value="keto">Cetogênica</SelectItem>
                      <SelectItem value="jejum">Jejum Intermitente</SelectItem>
                      <SelectItem value="detox">Detox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" />
                      Meta Água (ml)
                    </label>
                    <Input
                      type="number"
                      step="100"
                      value={formData.water_goal_ml}
                      onChange={(e) => handleChange("water_goal_ml", e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5" />
                      Meta Sono (h)
                    </label>
                    <Input
                      type="number"
                      value={formData.sleep_goal_hours}
                      onChange={(e) => handleChange("sleep_goal_hours", e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                </div>

                {/* Show Name Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Mostrar nome no ranking</p>
                    <p className="text-xs text-muted-foreground">
                      Se desativado, aparecerá como "Anônimo"
                    </p>
                  </div>
                  <Switch
                    checked={formData.show_name}
                    onCheckedChange={(checked) => handleChange("show_name", checked)}
                  />
                </div>

                {/* Wants Exercise Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-5 h-5 text-coral" />
                    <div>
                      <p className="text-sm font-medium">Incluir exercícios</p>
                      <p className="text-xs text-muted-foreground">
                        Deseja treinos no seu plano?
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.wants_exercise}
                    onCheckedChange={(checked) => handleChange("wants_exercise", checked)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full gradient-coral text-primary-foreground font-semibold py-6"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
