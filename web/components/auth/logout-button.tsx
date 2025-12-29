import { logoutAction } from "@/app/auth/actions";
import { SubmitButton } from "../ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <SubmitButton variant="ghost" size="sm">
        Logout
      </SubmitButton>
    </form>
  );
}
