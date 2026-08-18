-- Create trigger function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      'user',
      NOW(),
      NOW()
    );
    RETURN NEW;
  EXCEPTION
    WHEN others THEN
      -- Raise exception to rollback the entire transaction
      RAISE EXCEPTION 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
--> statement-breakpoint
-- Attach trigger to auth.users table (drop if exists to allow re-running)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();
--> statement-breakpoint
-- Create index on role for faster authorization queries (skip if exists)
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
