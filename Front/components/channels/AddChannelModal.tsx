import React, { useState } from "react";
import { ErrorAlert, SuccessAlert } from "../alerts";
import useMutationHandler from "@/api/mutation";

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [identifier, setIdentifier] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: createChannel, isPending } = useMutationHandler("channels", {
    method: "POST",
    contentType: "application/json",
    onSuccess: () => {
      SuccessAlert("Channel created successfully");
      onClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.message;
      setErrorMessage(errorMessage);
    },
  });

  const handleAddChannel = (data: {
    identifier: string;
    displayName: string;
  }) => {
    createChannel({
      name: data.displayName,
      telegram_channel_id: data.identifier,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddChannel({ identifier, displayName });
    setIdentifier("");
    setDisplayName("");
  };

  const handleClose = () => {
    setIdentifier("");
    setDisplayName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Connect Channel
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add a new Telegram channel source.
          </p>
        </div>

        <div className="p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Channel Identifier
              </label>
              <div className="relative">
                <span className="absolute left-3 top-8 transform -translate-y-1/2 text-slate-400 font-mono text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all"
                  placeholder="channel_username"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                You can also use the numerical Channel ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all"
                placeholder="e.g. Gold VIP Signals"
                required
              />
            </div>

            <div>
              <ErrorAlert message={errorMessage || ""} />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? "Connecting..." : "Connect Channel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChannelModal;
