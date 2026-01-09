-- Enable realtime for remaining key user tables (profiles already enabled)
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_active_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;