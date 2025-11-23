import React from "react";
import { FileText, Edit3, Trash2, CheckCircle } from "lucide-react";
import { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  onToggleAutoDetect: (templateId: string) => void;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onToggleAutoDetect,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500">
            <FileText size={14} />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            {template.name}
          </h4>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(template.id)}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <Edit3 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(template.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800/50">
        <span
          className={`text-xs font-bold flex items-center gap-1.5 ${
            template.isAutoDetect
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500"
          }`}
        >
          <CheckCircle
            size={12}
            className={
              template.isAutoDetect
                ? "fill-emerald-100 dark:fill-emerald-900"
                : "opacity-0"
            }
          />
          {template.isAutoDetect ? "Auto-Detect On" : "Auto-Detect Off"}
        </span>
        <button
          onClick={() => onToggleAutoDetect(template.id)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
            template.isAutoDetect
              ? "bg-emerald-500"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
              template.isAutoDetect ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {template.fields.map((field) => (
            <span
              key={field.id}
              className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded border border-slate-200 dark:border-slate-700"
            >
              {field.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;

