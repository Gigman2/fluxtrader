import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CheckCircle2 } from "lucide-react";
import useMutationHandler from "@/api/mutation";
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
import useAuth from "@/store/auth";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useAuth(["setSession"]);
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useMutationHandler("accounts", {
    method: "POST",
    contentType: "application/json",
    onSuccess: (response: any) => {
      setSession(response.data.token, response.data.user);
      navigate("/");
    },
    onError: (err: any) => {
      const message = err.response?.data?.error || err.message;
      setError(message || "Signup failed. Please try again.");
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    signup({
      username: name,
      password,
    });
  };

  return (
    <AuthLayout
      tickers={[
        {
          symbol: "BTCUSD",
          change: "+1.45%",
          isPositive: true,
          position: "top-right",
        },
        {
          symbol: "XAUUSD",
          change: "-1.20%",
          isPositive: false,
          position: "bottom-right",
          delay: "2s",
        },
      ]}
    >
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Join SignalFlux to automate your trading."
          iconRotation={-3}
        />

        <div className="p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <FormInput
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              icon={User}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText={
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-500" /> At
                  least 8 characters
                </p>
              }
            />

            <ErrorAlert message={error || ""} />

            <SubmitButton label="Create Account" isLoading={isPending} />
          </form>

          <AuthFooter
            text="Already have an account?"
            linkText="Sign In"
            linkTo="/login"
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Signup;
