import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ChannelNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="text-slate-400" size={32} />
      </div>
      <p className="text-slate-900 dark:text-white text-lg font-bold">
        Channel not found
      </p>
      <button
        onClick={() => navigate("/channels")}
        className="mt-4 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-medium"
      >
        Return to Channels
      </button>
    </div>
  );
};

export default ChannelNotFound;

