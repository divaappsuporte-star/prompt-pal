import { useState, useCallback, useEffect } from "react";
import {
  ProgressData,
  loadProgress,
  saveProgress,
  addWaterIntake as addWater,
  addSleepTime as addSleep,
  getTodayHydration,
  getTodaySleep,
  getTodayCaloriesBurned,
  getTodayMacros,
  calculateOverallProgress,
  analyzeHealth,
  completeMindsetChapter,
  completeNutritionChapter,
  completeWorkoutSession,
  markRecipeCompleted as markRecipe,
  markMealCompleted as markMeal,
  isRecipeCompletedToday,
  isMealTypeCompletedToday,
  getTodayMealsWithFeedbacks,
  DietType,
  MealType,
  MealFeedbackData,
  CompletedMealWithFeedback,
  HealthAnalysis,
  TodayMacros,
} from "@/services/progressService";

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [overallProgress, setOverallProgress] = useState(calculateOverallProgress);
  const [todayHydration, setTodayHydration] = useState(getTodayHydration);
  const [todaySleep, setTodaySleep] = useState(getTodaySleep);
  const [todayCalories, setTodayCalories] = useState(getTodayCaloriesBurned);
  const [todayMacros, setTodayMacros] = useState<TodayMacros>(getTodayMacros);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis>(analyzeHealth);
  const [todayMeals, setTodayMeals] = useState<CompletedMealWithFeedback[]>(getTodayMealsWithFeedbacks);

  const refreshData = useCallback(() => {
    setProgress(loadProgress());
    setOverallProgress(calculateOverallProgress());
    setTodayHydration(getTodayHydration());
    setTodaySleep(getTodaySleep());
    setTodayCalories(getTodayCaloriesBurned());
    setTodayMacros(getTodayMacros());
    setHealthAnalysis(analyzeHealth());
    setTodayMeals(getTodayMealsWithFeedbacks());
  }, []);

  // Listen for storage changes (for cross-component updates)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshData]);

  const addWaterIntake = useCallback((ml: number) => {
    addWater(ml);
    refreshData();
    // Dispatch custom event for other components
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

  const addSleepTime = useCallback((hours: number) => {
    addSleep(hours);
    refreshData();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

  const completeMindset = useCallback((chapterId: number) => {
    completeMindsetChapter(chapterId);
    refreshData();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

  const completeNutrition = useCallback((diet: DietType, chapterId: number) => {
    completeNutritionChapter(diet, chapterId);
    refreshData();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

  const completeWorkout = useCallback((dayNumber: number, caloriesBurned: number, duration: number) => {
    completeWorkoutSession(dayNumber, caloriesBurned, duration);
    refreshData();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

  const markRecipeCompleted = useCallback((diet: DietType, recipeName: string, calories: number, protein: number = 0, fat: number = 0, carbs: number = 0) => {
    markRecipe(diet, recipeName, calories, protein, fat, carbs);
    refreshData();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

  const markMealCompleted = useCallback((
    diet: DietType, 
    mealType: MealType,
    recipeName: string, 
    calories: number, 
    protein: number = 0, 
    fat: number = 0, 
    carbs: number = 0,
    feedback: MealFeedbackData
  ): { success: boolean; error?: string } => {
    const result = markMeal(diet, mealType, recipeName, calories, protein, fat, carbs, feedback);
    if (result.success) {
      refreshData();
      window.dispatchEvent(new Event("progressUpdate"));
    }
    return { success: result.success, error: result.error };
  }, [refreshData]);

  const checkMealTypeCompleted = useCallback((diet: DietType, mealType: MealType) => {
    return isMealTypeCompletedToday(diet, mealType);
  }, []);

  const checkRecipeCompleted = useCallback((diet: DietType, recipeName: string) => {
    return isRecipeCompletedToday(diet, recipeName);
  }, []);

  // Listen for custom progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      refreshData();
    };
    
    window.addEventListener("progressUpdate", handleProgressUpdate);
    return () => window.removeEventListener("progressUpdate", handleProgressUpdate);
  }, [refreshData]);

  return {
    progress,
    overallProgress,
    todayHydration,
    todaySleep,
    todayCalories,
    todayMacros,
    todayMeals,
    healthAnalysis,
    addWaterIntake,
    addSleepTime,
    completeMindset,
    completeNutrition,
    completeWorkout,
    markRecipeCompleted,
    markMealCompleted,
    checkRecipeCompleted,
    checkMealTypeCompleted,
    refreshData,
  };
};
