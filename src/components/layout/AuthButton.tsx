import { LoginButton, LogoutButton } from "@/components/model/Auth";
import { hasAuthenticated } from "@/libs/supabaseServer";

export const AuthButton = async () => {
  const isAuthenticated = await hasAuthenticated();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};
