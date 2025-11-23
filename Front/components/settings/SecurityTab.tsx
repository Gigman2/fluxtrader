import React, { useState } from "react";
import { Key, Terminal, Smartphone, Mail, CheckCircle2 } from "lucide-react";
import { SettingsCard } from "@/components/settings";
import { PasswordInput, ToggleSwitch } from "@/components/form";
import { ErrorAlert } from "@/components";
import useAuth from "@/store/auth";
import useMutationHandler from "@/api/mutation";

interface SecurityTabProps {
  onPasswordUpdate?: (currentPassword: string, newPassword: string) => void;
  twoFactorEnabled?: boolean;
  onTwoFactorToggle?: (enabled: boolean) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  onPasswordUpdate,
  twoFactorEnabled = false,
  onTwoFactorToggle,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth(["user"]);

  const { mutate: updatePassword, isPending } = useMutationHandler(
    "accounts/password",
    {
      method: "PUT",
      contentType: "application/json",
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      },
      onError: (err: any) => {
        const message = err.response?.data?.error || err.message;
        setError(message || "Failed to update password. Please try again.");
        setSuccess(false);
      },
    }
  );

  const handlePasswordUpdate = () => {
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    updatePassword({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SettingsCard title="Account Information" icon={Mail}>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                <Mail size={16} />
              </div>
              <span className="text-sm text-slate-900 dark:text-white">
                {user?.email || "Not available"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Your email address is used for account recovery and notifications.
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Password & Authentication" icon={Key}>
        <div className="space-y-4 max-w-md">
          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
              />
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Password updated successfully!
              </p>
            </div>
          )}

          <ErrorAlert message={error || ""} />

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mb-0"
            disabled={isPending}
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-0"
            disabled={isPending}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-0"
            disabled={isPending}
          />
          <button
            onClick={handlePasswordUpdate}
            disabled={isPending}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400 h-fit">
              <Smartphone size={20} />
            </div>
            <ToggleSwitch
              checked={twoFactorEnabled}
              onChange={(checked) => onTwoFactorToggle?.(checked)}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account."
              className="flex-1"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="API Keys" icon={Terminal}>
        <div className="flex justify-between items-center mb-4">
          <button className="text-sm text-slate-900 dark:text-white font-medium hover:underline">
            Generate New Key
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
              <Key size={16} />
            </div>
            <div>
              <p className="text-sm font-mono text-slate-900 dark:text-white">
                sk_live_...9f2a
              </p>
              <p className="text-xs text-slate-500">Created 2 days ago</p>
            </div>
          </div>
          <button className="text-rose-500 hover:text-rose-600 text-xs font-medium">
            Revoke
          </button>
        </div>
      </SettingsCard>
    </div>
  );
};

export default SecurityTab;
