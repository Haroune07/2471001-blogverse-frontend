import { login } from "@/services/api";
import { LoginForm } from "@/utils/types";
import { ActionFunctionArgs, redirect } from "react-router-dom";

async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = request.method.toUpperCase();

  const handlers: Record<string, () => Promise<Response | { error: string; ok?: boolean }>> = {
    POST: async () => {
      const creds: LoginForm = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      const pathname = new URL(request.url).searchParams.get("redirectTo") || "/";

      try {
        await login(creds);
        return redirect(pathname);
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

        return { ok: false, error: errorMessage };
      }
    },
  };

  if (handlers[method]) {
    return handlers[method]();
  }

  return null as any;
};

export default loginAction;