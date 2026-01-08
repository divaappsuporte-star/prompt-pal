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
  calculateOverallProgress,
  analyzeHealth,
  completeMindsetChapter,
  completeNutritionChapter,
  completeWorkoutSession,
  markRecipeCompleted as markRecipe,
  isRecipeCompletedToday,
  DietType,
  HealthAnalysis,
} from "@/services/progressService";

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [overallProgress, setOverallProgress] = useState(calculateOverallProgress);
  const [todayHydration, setTodayHydration] = useState(getTodayHydration);
  const [todaySleep, setTodaySleep] = useState(getTodaySleep);
  const [todayCalories, setTodayCalories] = useState(getTodayCaloriesBurned);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis>(analyzeHealth);

  const refreshData = useCallback(() => {
    setProgress(loadProgress());
    setOverallProgress(calculateOverallProgress());
    setTodayHydration(getTodayHydration());
    setTodaySleep(getTodaySleep());
    setTodayCalories(getTodayCaloriesBurned());
    setHealthAnalysis(analyzeHealth());
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

  const markRecipeCompleted = useCallback((diet: DietType, recipeName: string, calories: number) => {
    markRecipe(diet, recipeName, calories);
    refreshData();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData]);

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
    healthAnalysis,
    addWaterIntake,
    addSleepTime,
    completeMindset,
    completeNutrition,
    completeWorkout,
    markRecipeCompleted,
    checkRecipeCompleted,
    refreshData,
  };
};
