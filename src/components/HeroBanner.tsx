import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import heroBannerImage from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  const { profile } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = profile?.full_name?.split(' ')[0] || '';
  const showName = profile?.show_name !== false && firstName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mx-4 mb-6 rounded-3xl overflow-hidden shadow-elevated"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBannerImage}
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {getGreeting()}{showName ? `, ${firstName}` : ''}!
          </h1>
          <p className="text-muted-foreground text-sm">
            Vamos continuar sua jornada de transformação
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
