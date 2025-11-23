import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User2Icon } from "lucide-react";
import useMutationHandler from "@/api/mutation";
import useAuth from "@/store/auth";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthFooter,
  FormInput,
  PasswordInput,
  ErrorAlert,
  SubmitButton,
} from "@/components";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setSession } = useAuth(["setSession"]);

  const { mutate: login, isPending } = useMutationHandler("login", {
    method: "POST",
    contentType: "application/json",
    onSuccess: (response: any) => {
      setSession(response.data.token, response.data.user);
      navigate("/");
    },
    onError: (err: any) => {
      const message = err.response?.data?.error || err.message;
      setError(message || "Login failed. Please check your credentials.");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    login({
      username,
      password,
    });
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="SignalFlux"
          subtitle="Professional Trading Intelligence"
          iconRotation={3}
        />

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <FormInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              required
              icon={User2Icon}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              showForgotPassword
            />

            <ErrorAlert message={error || ""} />

            <SubmitButton label="Sign In" isLoading={isPending} />
          </form>

          <AuthFooter
            text="Don't have an account?"
            linkText="Create Account"
            linkTo="/signup"
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
