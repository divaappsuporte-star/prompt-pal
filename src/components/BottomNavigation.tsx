import { motion } from "framer-motion";
import { Home, Dumbbell, Apple, Brain, User, Plus } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "treino", icon: Dumbbell, label: "Treino" },
    { id: "add", icon: Plus, label: "Adicionar", isCenter: true },
    { id: "nutricao", icon: Apple, label: "Nutrição" },
    { id: "mente", icon: Brain, label: "Mente" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
    >
      <div className="glass-card rounded-2xl shadow-elevated mx-auto max-w-md">
        <div className="flex items-center justify-between py-2 px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onTabChange(item.id)}
                  className="relative -mt-8 flex-1 flex justify-center"
                >
                  <div className="gradient-coral p-4 rounded-full shadow-glow-coral animate-glow">
                    <Icon size={24} className="text-primary-foreground" />
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center py-2 flex-1"
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-coral" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                    isActive ? "text-coral" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-coral"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
