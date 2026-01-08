-- Add integrated_modules column to user_active_plans
ALTER TABLE public.user_active_plans 
ADD COLUMN integrated_modules jsonb DEFAULT '[]'::jsonb;