import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { SettingsCard, SaveButton } from "@/components/settings";
import { NumberInput } from "@/components/form";
import { useGetRiskSettings } from "@/services/risk.service";
import useAuth from "@/store/auth";
import useMutationHandler from "@/api/mutation";
import { ErrorAlert, SuccessAlert } from "../alerts";

const TradingTab: React.FC = () => {
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(0);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);

  const { isLoggedIn } = useAuth(["isLoggedIn"]);
  const { data: riskSettings, isLoading } = useGetRiskSettings({
    enabled: isLoggedIn,
  });

  // Sync state with API data when it loads
  useEffect(() => {
    console.log("riskSettings", riskSettings);
    if (riskSettings) {
      setAccountBalance(riskSettings.account_balance);
      setRiskPerTrade(riskSettings.risk_per_trade);
      setMaxDrawdown(riskSettings.max_drawdown);
    }
  }, [riskSettings]);

  const { mutate: updateRiskSettings, isPending: isUpdatingRiskSettings } =
    useMutationHandler("risk/settings", {
      method: "PUT",
      invalidate: true,
      authenticate: true,
      contentType: "application/json",
      onSuccess: () => {
        SuccessAlert({
          message: "Risk settings updated successfully",
        });
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error || "Failed to update risk settings";
        ErrorAlert({
          message: errorMessage,
        });
      },
    });

  const handleSave = () => {
    if (isUpdatingRiskSettings || isLoading) return;

    updateRiskSettings({
      account_balance: accountBalance,
      risk_per_trade: riskPerTrade,
      max_drawdown: maxDrawdown,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SettingsCard
        title="Risk Management Defaults"
        icon={DollarSign}
        description="These values are used to automatically calculate position sizes in the signal dashboard."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Account Balance (USD)"
            value={accountBalance}
            onChange={setAccountBalance}
            prefix="$"
            placeholder="10000"
          />

          <NumberInput
            label="Risk Per Trade (%)"
            value={riskPerTrade}
            onChange={setRiskPerTrade}
            suffix="%"
            placeholder="1.5"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                Max Drawdown Warning
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Alert when daily loss exceeds threshold
              </p>
            </div>
            <div className="w-24">
              <input
                type="number"
                value={maxDrawdown}
                onChange={(e) =>
                  setMaxDrawdown(parseFloat(e.target.value) || 0)
                }
                min={0}
                max={100}
                step="0.1"
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-center focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <SaveButton
              onClick={handleSave}
              isLoading={isUpdatingRiskSettings || isLoading}
              disabled={isUpdatingRiskSettings || isLoading}
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

export default TradingTab;
