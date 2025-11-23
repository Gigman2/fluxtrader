import React from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-1.5 rounded ${
          viewMode === "grid"
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-1.5 rounded ${
          viewMode === "list"
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        aria-label="List view"
      >
        <LayoutList size={18} />
      </button>
    </div>
  );
};

export default ViewModeToggle;
