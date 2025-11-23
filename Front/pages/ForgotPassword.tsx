import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import useMutationHandler from "@/api/mutation";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  FormInput,
  ErrorAlert,
  SubmitButton,
} from "@/components";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const { mutate: requestReset, isPending } = useMutationHandler(
    "password-reset/request",
    {
      method: "POST",
      contentType: "application/json",
      onSuccess: () => {
        setSuccess(true);
        setError(null);
      },
      onError: (err: any) => {
        const message = err.response?.data?.error || err.message;
        setError(message || "Failed to send reset email. Please try again.");
        setSuccess(false);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    requestReset({ email });
  };

  if (success) {
    return (
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="Check Your Email"
            subtitle="We've sent a password reset link to your email address"
            iconRotation={3}
          />

          <div className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                If an account with that email exists, we've sent a password
                reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Please check your inbox and click the link to reset your
                password. The link will expire in 1 hour.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 text-sm text-slate-900 dark:text-white hover:underline flex items-center gap-2 justify-center"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot Password"
          subtitle="Enter your email to receive a reset link"
          iconRotation={-3}
        />

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              icon={Mail}
            />

            <ErrorAlert message={error || ""} />

            <SubmitButton label="Send Reset Link" isLoading={isPending} />

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 justify-center"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
