import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import useMutationHandler from "@/api/mutation";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordInput,
  ErrorAlert,
  SubmitButton,
} from "@/components";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const { mutate: resetPassword, isPending } = useMutationHandler(
    "password-reset/confirm",
    {
      method: "POST",
      contentType: "application/json",
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      },
      onError: (err: any) => {
        const message = err.response?.data?.error || err.message;
        setError(
          message ||
            "Failed to reset password. The link may have expired. Please request a new one."
        );
        setSuccess(false);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    resetPassword({
      token,
      password,
    });
  };

  if (success) {
    return (
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="Password Reset Successful"
            subtitle="Your password has been reset"
            iconRotation={3}
          />

          <div className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="Invalid Reset Link"
            subtitle="This password reset link is invalid or expired"
            iconRotation={-3}
          />

          <div className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                This password reset link is invalid or has expired. Please
                request a new password reset.
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="mt-6 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Request New Reset Link
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
          title="Reset Password"
          subtitle="Enter your new password"
          iconRotation={-3}
        />

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordInput
              label="New Password"
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

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <ErrorAlert message={error || ""} />

            <SubmitButton label="Reset Password" isLoading={isPending} />
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPassword;
