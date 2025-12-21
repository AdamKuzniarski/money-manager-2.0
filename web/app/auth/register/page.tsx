import { AuthForm } from "@/components/auth/auth-form";
import { registerAction } from "../actions";

export default function RegisterPage() {
  return (
    <AuthForm mode="register" title="Create account" action={registerAction} />
  );
}
