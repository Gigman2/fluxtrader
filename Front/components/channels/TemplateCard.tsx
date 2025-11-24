import React, { useState } from "react";
import { FileText, Edit3, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  onDelete?: (templateId: string) => void;
  isDeleting?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onDelete,
  isDeleting = false,
}) => {
  const [isAutoDetectState, setIsAutoDetectState] = useState(false);

  return (
    <div className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-2">
          <div className="p-1.5 mt-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500">
            <FileText size={14} />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            {template.test_message}
          </h4>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete && (
            <button
              onClick={() => onDelete(template.id)}
              disabled={isDeleting}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete template"
            >
              {isDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800/50">
        <span
          className={`text-xs font-bold flex items-center gap-1.5 ${
            isAutoDetectState
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500"
          }`}
        >
          <CheckCircle
            size={12}
            className={
              isAutoDetectState
                ? "fill-emerald-100 dark:fill-emerald-900"
                : "opacity-0"
            }
          />
          {isAutoDetectState ? "Auto-Detect On" : "Auto-Detect Off"}
        </span>
        <button
          onClick={() => setIsAutoDetectState((prev) => !prev)}
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
            isAutoDetectState
              ? "bg-emerald-500"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
              isAutoDetectState ? "translate-x-1" : "translate-x-3"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
