// Progress Sync Service - Syncs progress data with Supabase
import { supabase } from "@/integrations/supabase/client";
import { ProgressData, loadProgress, saveProgress, getDefaultProgress } from "./progressService";

// Merge local progress with cloud progress, taking the most recent data
const mergeProgress = (local: ProgressData, cloud: ProgressData): ProgressData => {
  const merged: ProgressData = {
    mindset: {
      completedChapters: [...new Set([...local.mindset.completedChapters, ...cloud.mindset.completedChapters])],
      unlockedChapters: [...new Set([...local.mindset.unlockedChapters, ...cloud.mindset.unlockedChapters])],
    },
    nutrition: {
      carnivore: mergeNutritionDiet(local.nutrition.carnivore, cloud.nutrition.carnivore),
      lowcarb: mergeNutritionDiet(local.nutrition.lowcarb, cloud.nutrition.lowcarb),
      keto: mergeNutritionDiet(local.nutrition.keto, cloud.nutrition.keto),
      fasting: mergeNutritionDiet(local.nutrition.fasting, cloud.nutrition.fasting),
      detox: mergeNutritionDiet(local.nutrition.detox, cloud.nutrition.detox),
    },
    workouts: {
      completedSessions: mergeWorkoutSessions(
        local.workouts.completedSessions || [],
        cloud.workouts.completedSessions || []
      ),
      completedDays: [...new Set([...(local.workouts.completedDays || []), ...(cloud.workouts.completedDays || [])])],
      unlockedDays: [...new Set([...(local.workouts.unlockedDays || []), ...(cloud.workouts.unlockedDays || [])])],
    },
    hydration: {
      daily: mergeHydration(local.hydration.daily || [], cloud.hydration.daily || []),
    },
    sleep: {
      daily: mergeSleep(local.sleep.daily || [], cloud.sleep.daily || []),
    },
    onboarding: {
      currentStep: Math.max(local.onboarding?.currentStep || 0, cloud.onboarding?.currentStep || 0),
      completedSteps: [...new Set([...(local.onboarding?.completedSteps || []), ...(cloud.onboarding?.completedSteps || [])])],
      firstDayCompleted: local.onboarding?.firstDayCompleted || cloud.onboarding?.firstDayCompleted || false,
    },
  };

  return merged;
};

const mergeNutritionDiet = (local: any, cloud: any) => {
  const localMeals = local?.completedMeals || [];
  const cloudMeals = cloud?.completedMeals || [];
  
  // Merge meals by unique key (date + mealType)
  const mealMap = new Map();
  [...cloudMeals, ...localMeals].forEach(meal => {
    const key = `${meal.date}_${meal.mealType}`;
    if (!mealMap.has(key) || new Date(meal.completedAt) > new Date(mealMap.get(key).completedAt)) {
      mealMap.set(key, meal);
    }
  });

  return {
    completedChapters: [...new Set([...(local?.completedChapters || []), ...(cloud?.completedChapters || [])])],
    completedRecipes: [...new Set([...(local?.completedRecipes || []), ...(cloud?.completedRecipes || [])])],
    completedRecipesDetails: mergeRecipeDetails(
      local?.completedRecipesDetails || [],
      cloud?.completedRecipesDetails || []
    ),
    completedMeals: Array.from(mealMap.values()),
  };
};

const mergeRecipeDetails = (local: any[], cloud: any[]): any[] => {
  const map = new Map();
  [...cloud, ...local].forEach(detail => {
    const key = `${detail.name}_${detail.date}`;
    map.set(key, detail);
  });
  return Array.from(map.values());
};

const mergeWorkoutSessions = (local: any[], cloud: any[]): any[] => {
  const map = new Map();
  [...cloud, ...local].forEach(session => {
    const key = `${session.date}_${session.dayCompleted}`;
    map.set(key, session);
  });
  return Array.from(map.values());
};

const mergeHydration = (local: any[], cloud: any[]): any[] => {
  const map = new Map();
  [...cloud, ...local].forEach(entry => {
    if (map.has(entry.date)) {
      // Take the higher value for the same date
      const existing = map.get(entry.date);
      map.set(entry.date, { date: entry.date, ml: Math.max(existing.ml, entry.ml) });
    } else {
      map.set(entry.date, entry);
    }
  });
  return Array.from(map.values());
};

const mergeSleep = (local: any[], cloud: any[]): any[] => {
  const map = new Map();
  [...cloud, ...local].forEach(entry => {
    // Take the most recent entry for each date
    map.set(entry.date, entry);
  });
  return Array.from(map.values());
};

// Load progress from cloud and merge with local
export const loadCloudProgress = async (userId: string): Promise<ProgressData | null> => {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("progress_data")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading cloud progress:", error);
      return null;
    }

    if (data?.progress_data) {
      return data.progress_data as unknown as ProgressData;
    }

    return null;
  } catch (error) {
    console.error("Error loading cloud progress:", error);
    return null;
  }
};

// Save progress to cloud
export const saveCloudProgress = async (userId: string, progressData: ProgressData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        progress_data: progressData as any,
        synced_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error("Error saving cloud progress:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saving cloud progress:", error);
    return false;
  }
};

// Sync local and cloud progress
export const syncProgress = async (userId: string): Promise<ProgressData> => {
  const localProgress = loadProgress();
  const cloudProgress = await loadCloudProgress(userId);

  if (!cloudProgress) {
    // No cloud data, save local to cloud
    await saveCloudProgress(userId, localProgress);
    return localProgress;
  }

  // Merge local and cloud
  const mergedProgress = mergeProgress(localProgress, cloudProgress);
  
  // Save merged data to both local and cloud
  saveProgress(mergedProgress);
  await saveCloudProgress(userId, mergedProgress);

  return mergedProgress;
};

// Force sync to cloud (called after any local change)
export const pushToCloud = async (userId: string): Promise<void> => {
  const localProgress = loadProgress();
  await saveCloudProgress(userId, localProgress);
};

