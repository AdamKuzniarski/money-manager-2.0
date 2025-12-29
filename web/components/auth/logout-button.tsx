import { logoutAction } from "@/app/auth/actions";
import { SubmitButton } from "../ui/button";

export function LogoutButton() {
  return (
    //Cookies löschen
    <form action={logoutAction}>
      <SubmitButton variant="ghost" size="sm">
        Logout
      </SubmitButton>
    </form>
  );
}
