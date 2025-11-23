import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { Template } from "@/types";
import TemplateCard from "./TemplateCard";

interface TemplatesListProps {
  templates: Template[];
  onToggleAutoDetect: (templateId: string) => void;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onToggleAutoDetect,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileText size={16} className="text-slate-500" />
          Templates
        </h3>
        <button
          onClick={() => navigate("/templates")}
          className="p-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {templates.length > 0 ? (
          templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onToggleAutoDetect={onToggleAutoDetect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="mx-auto mb-2 text-slate-300" size={24} />
            <p className="text-xs text-slate-500 mb-3">
              No templates configured for this channel.
            </p>
            <button
              onClick={() => navigate("/templates")}
              className="text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesList;

