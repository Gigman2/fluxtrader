import React, { useState } from "react";
import { MessageSquare, Server } from "lucide-react";
import { IntegrationCard, SaveButton } from "@/components/settings";
import { FormInput, PasswordInput, SelectInput } from "@/components/form";
import { User, Lock } from "lucide-react";

interface IntegrationsTabProps {
  telegramStatus: "connected" | "disconnected";
  mtStatus: "connected" | "disconnected";
  onTelegramConnect: () => void;
  onTelegramDisconnect: () => void;
  onMTConnect: () => void;
  onMTDisconnect: () => void;
}

const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  telegramStatus,
  mtStatus,
  onTelegramConnect,
  onTelegramDisconnect,
  onMTConnect,
  onMTDisconnect,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [mtPlatform, setMtPlatform] = useState("MetaTrader 5");
  const [mtServer, setMtServer] = useState("");
  const [mtLoginId, setMtLoginId] = useState("");
  const [mtPassword, setMtPassword] = useState("");

  const platformOptions = [
    { value: "MetaTrader 5", label: "MetaTrader 5" },
    { value: "MetaTrader 4", label: "MetaTrader 4" },
    { value: "cTrader", label: "cTrader" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <IntegrationCard
        title="Telegram Bot"
        description="Receive and parse signals directly from your channels."
        icon={MessageSquare}
        status={telegramStatus}
        onConnect={onTelegramConnect}
        onDisconnect={onTelegramDisconnect}
        connectedContent={
          telegramStatus === "connected" ? (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-bold">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    @johndoe_trader
                  </p>
                  <p className="text-xs text-slate-500">Connected since Oct 24, 2023</p>
                </div>
              </div>
            </div>
          ) : undefined
        }
      />

      <IntegrationCard
        title="MetaTrader 4/5"
        description="Connect your broker account for trade execution."
        icon={Server}
        status={mtStatus}
        onConnect={onMTConnect}
        onDisconnect={onMTDisconnect}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SelectInput
            label="Platform"
            value={mtPlatform}
            onChange={(e) => setMtPlatform(e.target.value)}
            options={platformOptions}
          />
          <FormInput
            label="Broker Server"
            type="text"
            value={mtServer}
            onChange={(e) => setMtServer(e.target.value)}
            placeholder="e.g. ICMarkets-Demo"
            icon={Server}
            className="mb-0"
          />
          <FormInput
            label="Login ID"
            type="text"
            value={mtLoginId}
            onChange={(e) => setMtLoginId(e.target.value)}
            icon={User}
            className="mb-0"
          />
          <PasswordInput
            label="Password"
            value={mtPassword}
            onChange={(e) => setMtPassword(e.target.value)}
            className="mb-0"
          />
        </div>

        <div className="flex justify-end">
          <SaveButton
            onClick={mtStatus === "connected" ? onMTDisconnect : onMTConnect}
            label={mtStatus === "connected" ? "Update Connection" : "Connect Broker"}
          />
        </div>
      </IntegrationCard>
    </div>
  );
};

export default IntegrationsTab;

