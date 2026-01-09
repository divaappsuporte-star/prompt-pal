import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Download, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import InstallPWAModal from "@/components/modals/InstallPWAModal";

const emailSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
});

const adminLoginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const Auth = () => {
  const { user, loading, signIn, sendOtp, verifyOtp, isAdmin } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const { canInstall, isInstalled, isIOSModalOpen, promptInstall, closeIOSModal } = usePWAInstall();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Redirect if already logged in
  if (user && !loading) {
    // If admin, redirect to admin panel
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleLogoClick = () => {
    setIsAdminMode(true);
    setOtpSent(false);
    setOtpCode("");
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  const handleBackToUser = () => {
    setIsAdminMode(false);
    setOtpSent(false);
    setOtpCode("");
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = emailSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      const { error } = await sendOtp(formData.email);
      if (error) {
        if (error.message.includes("Signups not allowed") || error.message.includes("User not found")) {
          toast.error("Email não cadastrado. Contate o administrador.");
        } else {
          toast.error(error.message);
        }
      } else {
        setOtpSent(true);
        toast.success("Código enviado para seu email!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await verifyOtp(formData.email, otpCode);
      if (error) {
        toast.error("Código inválido ou expirado. Tente novamente.");
        setOtpCode("");
      } else {
        toast.success("Bem-vindo!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = adminLoginSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Bem-vindo, Admin!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Logo - Clickable for admin access */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        onClick={handleLogoClick}
        type="button"
      >
        <Logo size="lg" />
      </motion.button>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm glass-card rounded-2xl p-6"
      >
        <AnimatePresence mode="wait">
          {isAdminMode ? (
            /* Admin Login */
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleBackToUser}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <h2 className="text-lg font-display font-bold text-foreground">
                  Acesso Administrativo
                </h2>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="admin@nutri21.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-muted border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-coral text-primary-foreground font-semibold py-6 mt-6"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Entrar como Admin"
                  )}
                </Button>
              </form>
            </motion.div>
          ) : otpSent ? (
            /* OTP Verification */
            <motion.div
              key="otp-verify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground mb-2">
                Digite o Código
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enviamos um código de 6 dígitos para<br />
                <span className="text-foreground font-medium">{formData.email}</span>
              </p>
              
              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={isSubmitting || otpCode.length !== 6}
                className="w-full gradient-coral text-primary-foreground font-semibold py-6 mb-4"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOtpCode("");
                    handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  disabled={isSubmitting}
                  className="text-muted-foreground text-sm"
                >
                  Reenviar código
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode("");
                    setFormData({ email: "", password: "" });
                  }}
                  className="text-muted-foreground text-sm"
                >
                  Usar outro email
                </Button>
              </div>
            </motion.div>
          ) : (
            /* User Login - Email Input */
            <motion.div
              key="user"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-lg font-display font-bold text-foreground text-center mb-6">
                Acesse sua Conta
              </h2>

              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Email cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-coral text-primary-foreground font-semibold py-6 mt-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Receber Código"
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Um código de 6 dígitos será enviado para seu email.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Install PWA Button */}
      {canInstall && !isInstalled && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={promptInstall}
          className="flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-muted/50 border border-primary/30 text-primary font-medium hover:bg-muted transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Instalar App</span>
        </motion.button>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground mt-6 text-center"
      >
        Ao continuar, você concorda com nossos termos de uso.
      </motion.p>

      {/* iOS Install Modal */}
      <InstallPWAModal isOpen={isIOSModalOpen} onClose={closeIOSModal} />
    </div>
  );
};

export default Auth;