import { AuthForm } from "@/components/auth/auth-form";
import { loginAction } from "../actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string; email?: string };
}) {
  const infoMessage =
    searchParams.registered === "1"
      ? "Account created. You can log in now."
      : undefined;

  return (
    <AuthForm
      mode="login"
      title="Welcome back"
      action={loginAction}
      defaultEmail={searchParams.email}
      infoMessage={infoMessage}
    />
  );
}
