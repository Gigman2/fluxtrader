import React, { useState } from "react";
import { Key, Terminal, Smartphone } from "lucide-react";
import { SettingsCard } from "@/components/settings";
import { PasswordInput, ToggleSwitch } from "@/components/form";

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

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      // Handle error - passwords don't match
      return;
    }
    if (onPasswordUpdate) {
      onPasswordUpdate(currentPassword, newPassword);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SettingsCard title="Password & Authentication" icon={Key}>
        <div className="space-y-4 max-w-md">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mb-0"
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-0"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-0"
          />
          <button
            onClick={handlePasswordUpdate}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Update Password
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="text-slate-900 dark:text-white" size={20} />
            API Keys
          </h3>
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
