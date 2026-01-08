// Progress Service - Manages all progress data with localStorage persistence

export interface WorkoutSession {
  date: string;
  caloriesBurned: number;
  duration: number;
  dayCompleted: number;
}

export interface DietProgress {
  completedChapters: number[];
  completedRecipes: string[];
}

export interface DailyHydration {
  date: string;
  ml: number;
}

export interface DailySleep {
  date: string;
  hours: number;
}

export interface ProgressData {
  mindset: {
    completedChapters: number[];
    unlockedChapters: number[];
  };
  nutrition: {
    carnivore: DietProgress;
    lowcarb: DietProgress;
    keto: DietProgress;
    fasting: DietProgress;
    detox: DietProgress;
  };
  workouts: {
    completedSessions: WorkoutSession[];
    completedDays: number[];
    unlockedDays: number[];
  };
  hydration: {
    daily: DailyHydration[];
  };
  sleep: {
    daily: DailySleep[];
  };
}

const STORAGE_KEY = "personal21_progress";

const getDefaultProgress = (): ProgressData => ({
  mindset: {
    completedChapters: [],
    unlockedChapters: [1],
  },
  nutrition: {
    carnivore: { completedChapters: [], completedRecipes: [] },
    lowcarb: { completedChapters: [], completedRecipes: [] },
    keto: { completedChapters: [], completedRecipes: [] },
    fasting: { completedChapters: [], completedRecipes: [] },
    detox: { completedChapters: [], completedRecipes: [] },
  },
  workouts: {
    completedSessions: [],
    completedDays: [],
    unlockedDays: [1],
  },
  hydration: {
    daily: [],
  },
  sleep: {
    daily: [],
  },
});

export const loadProgress = (): ProgressData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return {
        ...getDefaultProgress(),
        ...parsed,
        mindset: { ...getDefaultProgress().mindset, ...parsed.mindset },
        nutrition: { ...getDefaultProgress().nutrition, ...parsed.nutrition },
        workouts: { ...getDefaultProgress().workouts, ...parsed.workouts },
        hydration: { ...getDefaultProgress().hydration, ...parsed.hydration },
        sleep: { ...getDefaultProgress().sleep, ...parsed.sleep },
      };
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }
  return getDefaultProgress();
};

export const saveProgress = (data: ProgressData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

// Helper to get today's date string
const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Mindset functions
export const completeMindsetChapter = (chapterId: number): ProgressData => {
  const data = loadProgress();
  if (!data.mindset.completedChapters.includes(chapterId)) {
    data.mindset.completedChapters.push(chapterId);
  }
  const nextChapter = chapterId + 1;
  if (nextChapter <= 10 && !data.mindset.unlockedChapters.includes(nextChapter)) {
    data.mindset.unlockedChapters.push(nextChapter);
  }
  saveProgress(data);
  return data;
};

// Nutrition functions
export type DietType = "carnivore" | "lowcarb" | "keto" | "fasting" | "detox";

export const completeNutritionChapter = (diet: DietType, chapterId: number): ProgressData => {
  const data = loadProgress();
  if (!data.nutrition[diet].completedChapters.includes(chapterId)) {
    data.nutrition[diet].completedChapters.push(chapterId);
  }
  saveProgress(data);
  return data;
};

export const markRecipeCompleted = (diet: DietType, recipeName: string, calories: number): ProgressData => {
  const data = loadProgress();
  const key = `${recipeName}_${getTodayString()}`;
  if (!data.nutrition[diet].completedRecipes.includes(key)) {
    data.nutrition[diet].completedRecipes.push(key);
  }
  saveProgress(data);
  return data;
};

export const isRecipeCompletedToday = (diet: DietType, recipeName: string): boolean => {
  const data = loadProgress();
  const key = `${recipeName}_${getTodayString()}`;
  return data.nutrition[diet].completedRecipes.includes(key);
};

// Workout functions
export const completeWorkoutSession = (dayNumber: number, caloriesBurned: number, duration: number): ProgressData => {
  const data = loadProgress();
  const session: WorkoutSession = {
    date: getTodayString(),
    caloriesBurned,
    duration,
    dayCompleted: dayNumber,
  };
  data.workouts.completedSessions.push(session);
  if (!data.workouts.completedDays.includes(dayNumber)) {
    data.workouts.completedDays.push(dayNumber);
  }
  const nextDay = dayNumber + 1;
  if (nextDay <= 21 && !data.workouts.unlockedDays.includes(nextDay)) {
    data.workouts.unlockedDays.push(nextDay);
  }
  saveProgress(data);
  return data;
};

// Hydration functions
export const addWaterIntake = (ml: number): ProgressData => {
  const data = loadProgress();
  const today = getTodayString();
  const existingIndex = data.hydration.daily.findIndex((d) => d.date === today);
  
  if (existingIndex >= 0) {
    data.hydration.daily[existingIndex].ml += ml;
  } else {
    data.hydration.daily.push({ date: today, ml });
  }
  saveProgress(data);
  return data;
};

export const getTodayHydration = (): number => {
  const data = loadProgress();
  const today = getTodayString();
  const entry = data.hydration.daily.find((d) => d.date === today);
  return entry?.ml || 0;
};

// Sleep functions
export const addSleepTime = (hours: number): ProgressData => {
  const data = loadProgress();
  const today = getTodayString();
  const existingIndex = data.sleep.daily.findIndex((d) => d.date === today);
  
  if (existingIndex >= 0) {
    data.sleep.daily[existingIndex].hours = hours;
  } else {
    data.sleep.daily.push({ date: today, hours });
  }
  saveProgress(data);
  return data;
};

export const getTodaySleep = (): number => {
  const data = loadProgress();
  const today = getTodayString();
  const entry = data.sleep.daily.find((d) => d.date === today);
  return entry?.hours || 0;
};

// Calculate overall progress (0-100%)
export const calculateOverallProgress = (): number => {
  const data = loadProgress();
  
  // Mindset: 10 chapters = 20% of total
  const mindsetProgress = (data.mindset.completedChapters.length / 10) * 20;
  
  // Nutrition: average of all diets (20 chapters each) = 30% of total
  const diets: DietType[] = ["carnivore", "lowcarb", "keto", "fasting", "detox"];
  const nutritionProgress = diets.reduce((acc, diet) => {
    return acc + (data.nutrition[diet].completedChapters.length / 20);
  }, 0) / 5 * 30;
  
  // Workouts: 21 days = 50% of total
  const workoutProgress = (data.workouts.completedDays.length / 21) * 50;
  
  return Math.round(mindsetProgress + nutritionProgress + workoutProgress);
};

// Get today's calories burned
export const getTodayCaloriesBurned = (): number => {
  const data = loadProgress();
  const today = getTodayString();
  return data.workouts.completedSessions
    .filter((s) => s.date === today)
    .reduce((acc, s) => acc + s.caloriesBurned, 0);
};

// Get today's recipes completed (for calorie tracking)
export const getTodayMealsCalories = (): number => {
  const data = loadProgress();
  const today = getTodayString();
  let calories = 0;
  const diets: DietType[] = ["carnivore", "lowcarb", "keto", "fasting", "detox"];
  
  diets.forEach((diet) => {
    data.nutrition[diet].completedRecipes.forEach((recipe) => {
      if (recipe.endsWith(`_${today}`)) {
        // Estimate 300 kcal per meal (simplified)
        calories += 300;
      }
    });
  });
  
  return calories;
};

// Health analysis
export interface HealthAnalysis {
  hydration: {
    level: "critical" | "warning" | "good" | "none";
    message: string;
    current: number;
    target: number;
  };
  sleep: {
    level: "critical" | "warning" | "good" | "none";
    message: string;
    current: number;
    target: number;
  };
  activity: {
    level: "critical" | "warning" | "good" | "none";
    message: string;
    caloriesBurned: number;
  };
}

export const analyzeHealth = (): HealthAnalysis => {
  const hydrationMl = getTodayHydration();
  const sleepHours = getTodaySleep();
  const caloriesBurned = getTodayCaloriesBurned();
  
  // Hydration analysis (target: 2000ml)
  let hydrationLevel: "critical" | "warning" | "good" | "none" = "none";
  let hydrationMessage = "Registre sua hidratação";
  if (hydrationMl > 0) {
    if (hydrationMl < 500) {
      hydrationLevel = "critical";
      hydrationMessage = "Hidratação crítica! Beba água agora. Risco: desidratação, cansaço, dores de cabeça.";
    } else if (hydrationMl < 1500) {
      hydrationLevel = "warning";
      hydrationMessage = "Hidratação baixa. Aumente o consumo de água para evitar fadiga e má digestão.";
    } else {
      hydrationLevel = "good";
      hydrationMessage = "Boa hidratação! Continue assim para manter energia e foco.";
    }
  }
  
  // Sleep analysis (target: 7-8h)
  let sleepLevel: "critical" | "warning" | "good" | "none" = "none";
  let sleepMessage = "Registre suas horas de sono";
  if (sleepHours > 0) {
    if (sleepHours < 5) {
      sleepLevel = "critical";
      sleepMessage = "Sono crítico! Menos de 5h prejudica recuperação muscular, humor e metabolismo.";
    } else if (sleepHours < 7) {
      sleepLevel = "warning";
      sleepMessage = "Sono insuficiente. Procure dormir 7-8h para otimizar resultados.";
    } else {
      sleepLevel = "good";
      sleepMessage = "Sono adequado! Seu corpo está recuperando bem.";
    }
  }
  
  // Activity analysis
  let activityLevel: "critical" | "warning" | "good" | "none" = "none";
  let activityMessage = "Faça seu treino hoje";
  if (caloriesBurned > 0) {
    if (caloriesBurned < 100) {
      activityLevel = "warning";
      activityMessage = "Atividade leve. Considere um treino mais intenso amanhã.";
    } else if (caloriesBurned < 250) {
      activityLevel = "good";
      activityMessage = "Boa atividade! Você está no caminho certo.";
    } else {
      activityLevel = "good";
      activityMessage = "Excelente! Treino intenso concluído.";
    }
  }
  
  return {
    hydration: { level: hydrationLevel, message: hydrationMessage, current: hydrationMl, target: 2000 },
    sleep: { level: sleepLevel, message: sleepMessage, current: sleepHours, target: 8 },
    activity: { level: activityLevel, message: activityMessage, caloriesBurned },
  };
};
