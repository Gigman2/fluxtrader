import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import TemplateCard from "./TemplateCard";
import { useGetChannelTemplates } from "@/services/template.service";
import { ErrorAlert, SuccessAlert } from "@/components";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";
import useMutationHandler from "@/api/mutation";

interface TemplatesListProps {
  channelId: string;
}

const TemplatesList: React.FC<TemplatesListProps> = ({ channelId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useGetChannelTemplates(
    channelId,
    {
      queryKey: ["channel-templates", channelId],
    }
  );

  const deleteTemplateMutation = useMutationHandler(
    `templates/${deletingTemplateId}`,
    {
      method: "DELETE",
      onSuccess: () => {
        setDeleteSuccess(true);
        setDeletingTemplateId(null);
        setTemplateToDelete(null);
        // Invalidate and refetch templates
        queryClient.invalidateQueries({
          queryKey: ["channel-templates", channelId],
        });
        // Clear success message after 3 seconds
        setTimeout(() => setDeleteSuccess(false), 3000);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete template";
        setDeleteError(errorMessage);
        setDeletingTemplateId(null);
        setTemplateToDelete(null);
      },
    }
  );

  const handleDeleteClick = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;

    setDeleteError(null);
    setDeleteSuccess(false);
    setDeletingTemplateId(templateToDelete);
    setShowDeleteModal(false);

    // Trigger mutation - mutationFn will use templateToDelete from state
    deleteTemplateMutation.mutate({});
  };

  const handleCloseModal = () => {
    if (deletingTemplateId === null) {
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };

  const isDeleting = deletingTemplateId !== null;

  return (
    <>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonVariant="danger"
        isLoading={isDeleting}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
        {/* Success/Error Messages */}
        {deleteSuccess && (
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <SuccessAlert message="Template deleted successfully!" />
          </div>
        )}
        {deleteError && (
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <ErrorAlert message={deleteError} />
          </div>
        )}

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
          {isLoading ? (
            <div className="text-center py-10 px-4">
              <p className="text-xs text-slate-500">Loading templates...</p>
            </div>
          ) : templates.length > 0 ? (
            templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onDelete={handleDeleteClick}
                isDeleting={deletingTemplateId === template.id}
                channelId={channelId}
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
    </>
  );
};

export default TemplatesList;
