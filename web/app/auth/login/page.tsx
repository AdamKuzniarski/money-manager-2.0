import { AuthForm } from "@/components/auth/auth-form";
import { loginAction } from "../actions";

type LoginSearchParams = {
  registered?: string;
  logout?: string;
  email?: string;
};

type LoginPageProps = {
  searchParams: LoginSearchParams;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const infoMessage =
    searchParams.registered === "1"
      ? "Account created. You can log in now."
      : searchParams.logout === "1"
      ? "Logged out successfully."
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
