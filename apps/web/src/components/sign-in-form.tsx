import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "@janus/ui/components/button";
import { Input } from "@janus/ui/components/input";
import { Label } from "@janus/ui/components/label";
import { env } from "@janus/env/web";

export default function SignInForm() {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            const e = error as any;
            toast.error(e?.error?.message || e?.error?.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <div className="mb-4">
        <Button
          type="button"
          className="w-full"
          variant="secondary"
          onClick={async () => {
            await authClient.signIn.oauth2({
              providerId: "keycloak",
              callbackURL: env.VITE_PUBLIC_URL + "/account",
              errorCallbackURL: "/login",
            });
          }}
        >
          Continue with Keycloak
        </Button>
      </div>
    </div>
  );
}
