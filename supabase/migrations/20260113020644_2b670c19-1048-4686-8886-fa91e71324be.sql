-- Allow users to insert their own diet access (for plan creation)
CREATE POLICY "Users can insert their own diet access" 
ON public.user_diet_access 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add unique constraint for upsert to work (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_diet_access_user_id_diet_type_key'
    ) THEN
        ALTER TABLE public.user_diet_access 
        ADD CONSTRAINT user_diet_access_user_id_diet_type_key 
        UNIQUE (user_id, diet_type);
    END IF;
END $$;