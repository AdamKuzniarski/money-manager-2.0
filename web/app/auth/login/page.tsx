import { AuthForm } from "@/components/auth/auth-form";
import { loginAction } from "../actions";

type SearchParams = {
  registered?: string;
  logout?: string;
  email?: string;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const infoMessage =
    sp.registered === "1"
      ? "Account created. You can log in now."
      : sp.logout === "1"
      ? "Logged out successfully."
      : undefined;

  return (
    <AuthForm
      mode="login"
      title="Welcome back"
      action={loginAction}
      defaultEmail={sp.email}
      infoMessage={infoMessage}
    />
  );
}
