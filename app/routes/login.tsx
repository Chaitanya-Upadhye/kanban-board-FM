import { useNavigate, useOutletContext } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/db/types/db-types";

export default function Login() {
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: "trigger@mailinator.com",
      password: "Test",
    });
    navigate("/app");
  };

  const handleEmailSignup = async () => {
    await supabase.auth.signUp({
      email: "trigger@mailinator.com",
      password: "Test@7777",
    });
    navigate("/app");
  };

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
    navigate("/app");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex gap-5 ">
      <button onClick={handleEmailLogin}>Email Login</button>
      <button onClick={handleEmailSignup}>Email Signup</button>

      <button onClick={handleGitHubLogin}>GitHub Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
