-- Drop the existing restrictive SELECT policy for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows users to view their own profile OR admins to view all
CREATE POLICY "Users can view own profile or admins view all"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR 
  public.has_role(auth.uid(), 'super_admin'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Drop the existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new policy that allows users to update their own profile OR admins to update all
CREATE POLICY "Users can update own profile or admins update all"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id OR 
  public.has_role(auth.uid(), 'super_admin'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);