import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { syncProgress, pushToCloud } from "@/services/progressSyncService";

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [overallProgress, setOverallProgress] = useState(calculateOverallProgress);
  const [todayHydration, setTodayHydration] = useState(getTodayHydration);
  const [todaySleep, setTodaySleep] = useState(getTodaySleep);
  const [todayCalories, setTodayCalories] = useState(getTodayCaloriesBurned);
  const [todayMacros, setTodayMacros] = useState<TodayMacros>(getTodayMacros);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis>(analyzeHealth);
  const [todayMeals, setTodayMeals] = useState<CompletedMealWithFeedback[]>(getTodayMealsWithFeedbacks);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<string | null>(null);

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

  // Sync with cloud when user logs in or on mount
  useEffect(() => {
    const performSync = async () => {
      if (user?.id && lastSyncRef.current !== user.id) {
        setIsSyncing(true);
        try {
          const syncedProgress = await syncProgress(user.id);
          saveProgress(syncedProgress);
          refreshData();
          lastSyncRef.current = user.id;
          console.log("Progress synced with cloud successfully");
        } catch (error) {
          console.error("Failed to sync progress:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    performSync();
  }, [user?.id, refreshData]);

  // Debounced push to cloud after any change
  const debouncedPushToCloud = useCallback(() => {
    if (!user?.id) return;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout to push after 1 second of no changes
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await pushToCloud(user.id);
        console.log("Progress pushed to cloud");
      } catch (error) {
        console.error("Failed to push progress to cloud:", error);
      }
    }, 1000);
  }, [user?.id]);

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
    debouncedPushToCloud();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData, debouncedPushToCloud]);

  const addSleepTime = useCallback((hours: number) => {
    addSleep(hours);
    refreshData();
    debouncedPushToCloud();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData, debouncedPushToCloud]);

  const completeMindset = useCallback((chapterId: number) => {
    completeMindsetChapter(chapterId);
    refreshData();
    debouncedPushToCloud();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData, debouncedPushToCloud]);

  const completeNutrition = useCallback((diet: DietType, chapterId: number) => {
    completeNutritionChapter(diet, chapterId);
    refreshData();
    debouncedPushToCloud();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData, debouncedPushToCloud]);

  const completeWorkout = useCallback((dayNumber: number, caloriesBurned: number, duration: number) => {
    completeWorkoutSession(dayNumber, caloriesBurned, duration);
    refreshData();
    debouncedPushToCloud();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData, debouncedPushToCloud]);

  const markRecipeCompleted = useCallback((diet: DietType, recipeName: string, calories: number, protein: number = 0, fat: number = 0, carbs: number = 0) => {
    markRecipe(diet, recipeName, calories, protein, fat, carbs);
    refreshData();
    debouncedPushToCloud();
    window.dispatchEvent(new Event("progressUpdate"));
  }, [refreshData, debouncedPushToCloud]);

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
      debouncedPushToCloud();
      window.dispatchEvent(new Event("progressUpdate"));
    }
    return { success: result.success, error: result.error };
  }, [refreshData, debouncedPushToCloud]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Force sync function for manual trigger
  const forceSync = useCallback(async () => {
    if (!user?.id) return;
    setIsSyncing(true);
    try {
      const syncedProgress = await syncProgress(user.id);
      saveProgress(syncedProgress);
      refreshData();
      console.log("Force sync completed");
    } catch (error) {
      console.error("Force sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id, refreshData]);

  return {
    progress,
    overallProgress,
    todayHydration,
    todaySleep,
    todayCalories,
    todayMacros,
    todayMeals,
    healthAnalysis,
    isSyncing,
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
    forceSync,
  };
};
