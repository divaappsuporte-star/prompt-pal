-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');

-- Enum for diet types
CREATE TYPE public.diet_type AS ENUM ('carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting');

-- Enum for health conditions
CREATE TYPE public.health_condition AS ENUM ('diabetes', 'gastrite', 'hipertensao', 'intolerancia_lactose', 'celiaquia');

-- Table for user roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Table for diet access control
CREATE TABLE public.user_diet_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    diet_type diet_type NOT NULL,
    granted_by TEXT NOT NULL CHECK (granted_by IN ('payment', 'admin', 'trial')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    payment_id TEXT,
    UNIQUE (user_id, diet_type)
);

-- Enable RLS on user_diet_access
ALTER TABLE public.user_diet_access ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_diet_access
CREATE POLICY "Users can view their own diet access"
ON public.user_diet_access
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all diet access"
ON public.user_diet_access
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Table for health conditions per user
CREATE TABLE public.user_health_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    condition_type health_condition NOT NULL,
    diagnosed_by TEXT DEFAULT 'self' CHECK (diagnosed_by IN ('self', 'doctor')),
    active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, condition_type)
);

-- Enable RLS on user_health_conditions
ALTER TABLE public.user_health_conditions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_health_conditions
CREATE POLICY "Users can manage their own health conditions"
ON public.user_health_conditions
FOR ALL
USING (auth.uid() = user_id);

-- Table for health protocols (diet adaptations per condition)
CREATE TABLE public.health_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    condition_type health_condition NOT NULL,
    diet_type diet_type NOT NULL,
    is_compatible BOOLEAN NOT NULL DEFAULT true,
    restrictions JSONB,
    modifications JSONB,
    warnings JSONB,
    substitutions JSONB,
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (condition_type, diet_type)
);

-- Enable RLS on health_protocols (public read)
ALTER TABLE public.health_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view health protocols"
ON public.health_protocols
FOR SELECT
USING (true);

CREATE POLICY "Super admins can manage health protocols"
ON public.health_protocols
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Table for diet meal plans (the 21-day plans with 1-15kg variations)
CREATE TABLE public.diet_meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_type diet_type NOT NULL,
    target_kg_loss INT NOT NULL CHECK (target_kg_loss >= 1 AND target_kg_loss <= 15),
    day_number INT NOT NULL CHECK (day_number >= 1 AND day_number <= 21),
    phase TEXT NOT NULL CHECK (phase IN ('adaptation', 'acceleration', 'maintenance')),
    
    breakfast JSONB NOT NULL,
    lunch JSONB NOT NULL,
    dinner JSONB NOT NULL,
    snacks JSONB,
    
    total_calories INT NOT NULL,
    macros JSONB NOT NULL,
    
    daily_deficit INT NOT NULL,
    cumulative_loss DECIMAL(4,2),
    
    body_explanation JSONB NOT NULL,
    meal_feedbacks JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (diet_type, target_kg_loss, day_number)
);

-- Enable RLS on diet_meal_plans (public read)
ALTER TABLE public.diet_meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meal plans"
ON public.diet_meal_plans
FOR SELECT
USING (true);

CREATE POLICY "Super admins can manage meal plans"
ON public.diet_meal_plans
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Table for user's active diet plans
CREATE TABLE public.user_active_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    diet_type diet_type NOT NULL,
    target_weight_loss INT NOT NULL CHECK (target_weight_loss >= 1 AND target_weight_loss <= 15),
    start_weight DECIMAL(5,2) NOT NULL,
    target_weight DECIMAL(5,2) NOT NULL,
    current_day INT DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 21),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_meals JSONB DEFAULT '[]'::jsonb,
    daily_feedbacks JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_active_plans
ALTER TABLE public.user_active_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_active_plans
CREATE POLICY "Users can view their own active plans"
ON public.user_active_plans
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own active plans"
ON public.user_active_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own active plans"
ON public.user_active_plans
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all active plans"
ON public.user_active_plans
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Trigger for updated_at on user_active_plans
CREATE TRIGGER update_user_active_plans_updated_at
BEFORE UPDATE ON public.user_active_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add wants_exercise to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wants_exercise BOOLEAN DEFAULT true;