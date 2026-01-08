// Types for the diet and meal plan system

export type DietType = 'carnivore' | 'keto' | 'lowcarb' | 'metabolic' | 'detox' | 'fasting';

export type HealthCondition = 'diabetes' | 'gastrite' | 'hipertensao' | 'intolerancia_lactose' | 'celiaquia';

export type AppRole = 'super_admin' | 'admin' | 'user';

export interface DietAccess {
  id: string;
  user_id: string;
  diet_type: DietType;
  granted_by: 'payment' | 'admin' | 'trial';
  granted_at: string;
  expires_at: string | null;
  payment_id: string | null;
}

export interface UserHealthCondition {
  id: string;
  user_id: string;
  condition_type: HealthCondition;
  diagnosed_by: 'self' | 'doctor';
  active: boolean;
  notes: string | null;
}

export interface MealRecipe {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  instructions: string[];
  timing?: string;
  scientificNote?: string;
}

export interface MealFeedback {
  title: string;
  message: string;
  bodyProcess: string;
  timeframe: string;
  icon: string;
}

export interface DayMealPlan {
  recipe: MealRecipe;
  feedback: MealFeedback;
}

export interface BodyExplanation {
  phase: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tips: string[];
}

export interface DietMealPlan {
  id: string;
  diet_type: DietType;
  target_kg_loss: number;
  day_number: number;
  phase: 'adaptation' | 'acceleration' | 'maintenance';
  breakfast: DayMealPlan;
  lunch: DayMealPlan;
  dinner: DayMealPlan;
  snacks: DayMealPlan[] | null;
  total_calories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
  daily_deficit: number;
  cumulative_loss: number;
  body_explanation: BodyExplanation;
  meal_feedbacks: {
    breakfast: MealFeedback;
    lunch: MealFeedback;
    dinner: MealFeedback;
  };
}

export interface UserActivePlan {
  id: string;
  user_id: string;
  diet_type: DietType;
  target_weight_loss: number;
  start_weight: number;
  target_weight: number;
  current_day: number;
  started_at: string;
  completed_meals: CompletedMeal[];
  daily_feedbacks: DailyFeedback[];
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

export interface CompletedMeal {
  day: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  completed_at: string;
  recipe_name: string;
}

export interface DailyFeedback {
  day: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  feedback: MealFeedback;
  received_at: string;
}

export interface HealthProtocol {
  id: string;
  condition_type: HealthCondition;
  diet_type: DietType;
  is_compatible: boolean;
  restrictions: string[] | null;
  modifications: Record<string, string> | null;
  warnings: string[] | null;
  substitutions: Record<string, string> | null;
  medical_notes: string | null;
}

// Diet metadata for UI
export interface DietInfo {
  key: DietType;
  name: string;
  description: string;
  emoji: string;
  color: string;
  route: string;
  features: string[];
}

export const DIET_INFO: Record<DietType, DietInfo> = {
  carnivore: {
    key: 'carnivore',
    name: 'Dieta Carnívora',
    description: 'Alimentação baseada exclusivamente em produtos de origem animal',
    emoji: '🥩',
    color: 'coral',
    route: '/dieta-carnivora',
    features: ['Zero carboidratos', 'Alta proteína', 'Saciedade prolongada'],
  },
  keto: {
    key: 'keto',
    name: 'Dieta Cetogênica',
    description: 'Baixíssimo carboidrato para induzir estado de cetose',
    emoji: '🥑',
    color: 'mint',
    route: '/dieta-cetogenica',
    features: ['Cetose nutricional', 'Queima de gordura', 'Energia constante'],
  },
  lowcarb: {
    key: 'lowcarb',
    name: 'Low Carb',
    description: 'Redução moderada de carboidratos para emagrecimento sustentável',
    emoji: '🥗',
    color: 'gold',
    route: '/dieta-lowcarb',
    features: ['Flexível', 'Sustentável', 'Variedade de alimentos'],
  },
  metabolic: {
    key: 'metabolic',
    name: 'Dieta Metabólica',
    description: 'Ciclos de carboidratos para acelerar o metabolismo',
    emoji: '🔥',
    color: 'coral',
    route: '/dieta-metabolica',
    features: ['Ciclos estratégicos', 'Acelera metabolismo', 'Evita platô'],
  },
  detox: {
    key: 'detox',
    name: 'Sucos Detox',
    description: 'Sucos verdes e desintoxicantes para limpeza do organismo',
    emoji: '🥬',
    color: 'mint',
    route: '/sucos-detox',
    features: ['Desintoxicação', 'Vitaminas', 'Energia natural'],
  },
  fasting: {
    key: 'fasting',
    name: 'Jejum Intermitente',
    description: 'Protocolos de janelas alimentares para otimizar queima de gordura',
    emoji: '⏰',
    color: 'gold',
    route: '/jejum-intermitente',
    features: ['Autofagia', 'Simplicidade', 'Flexibilidade'],
  },
};

// Health condition labels
export const HEALTH_CONDITION_LABELS: Record<HealthCondition, string> = {
  diabetes: 'Diabetes',
  gastrite: 'Gastrite',
  hipertensao: 'Hipertensão',
  intolerancia_lactose: 'Intolerância à Lactose',
  celiaquia: 'Celíaco',
};
