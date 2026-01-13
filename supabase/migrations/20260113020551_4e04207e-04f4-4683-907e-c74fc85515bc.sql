-- Add policy for admins to INSERT into user_diet_access
CREATE POLICY "Admins can insert diet access" 
ON public.user_diet_access 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add policy for admins to DELETE from user_diet_access
CREATE POLICY "Admins can delete diet access" 
ON public.user_diet_access 
FOR DELETE 
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add policy for admins to view all diet access (needed for admin panel)
CREATE POLICY "Admins can view all diet access" 
ON public.user_diet_access 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add policy for admins to view all active plans (needed for admin panel)
CREATE POLICY "Admins can view all active plans" 
ON public.user_active_plans 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add policy for admins to view all user roles (needed for admin panel)
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));