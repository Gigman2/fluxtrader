import React, { useState } from "react";
import { Activity, Terminal, Shield } from "lucide-react";
import {
  SettingsTab,
  TradingTab,
  IntegrationsTab,
  SecurityTab,
} from "@/components/settings";

type TabId = "trading" | "integrations" | "security";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("trading");

  // Integration states
  const [mtStatus, setMtStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );
  const [telegramStatus, setTelegramStatus] = useState<
    "connected" | "disconnected"
  >("connected");

  // Security states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const tabs = [
    { id: "trading", label: "Trading Info", icon: <Activity size={18} /> },
    {
      id: "integrations",
      label: "Integrations",
      icon: <Terminal size={18} />,
    },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  const handleTelegramConnect = () => {
    setTelegramStatus("connected");
  };

  const handleTelegramDisconnect = () => {
    setTelegramStatus("disconnected");
  };

  const handleMTConnect = () => {
    setMtStatus("connected");
  };

  const handleMTDisconnect = () => {
    setMtStatus("disconnected");
  };

  const handlePasswordUpdate = (
    currentPassword: string,
    newPassword: string
  ) => {
    // TODO: Implement password update API call
    console.log("Updating password...");
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    // TODO: Implement 2FA toggle API call
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account, integrations, and trading preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <SettingsTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        />

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "trading" && <TradingTab />}
          {activeTab === "integrations" && (
            <IntegrationsTab
              telegramStatus={telegramStatus}
              mtStatus={mtStatus}
              onTelegramConnect={handleTelegramConnect}
              onTelegramDisconnect={handleTelegramDisconnect}
              onMTConnect={handleMTConnect}
              onMTDisconnect={handleMTDisconnect}
            />
          )}
          {activeTab === "security" && (
            <SecurityTab
              onPasswordUpdate={handlePasswordUpdate}
              twoFactorEnabled={twoFactorEnabled}
              onTwoFactorToggle={handleTwoFactorToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
