import { Button } from "@/components/ui/button";

type SettingsFieldProps = {
  label: string;
  value?: string | null;
  emptyText?: string;
  description?: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  editContent: React.ReactNode;
  onCancel: () => void;
  onSave: (e: React.FormEvent) => void;
  isSaving?: boolean;
  error?: string | null;
};

export default function SettingsField({
  label,
  value,
  emptyText = "Not set.",
  description,
  isEditing,
  onEdit,
  editContent,
  onCancel,
  onSave,
  isSaving = false,
  error,
}: SettingsFieldProps) {
  if (!isEditing) {
    return (
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium">{label}</div>
          <div className="mt-1 text-sm">
            {value || (
              <span className="text-muted-foreground">{emptyText}</span>
            )}
          </div>
          {description && (
            <div className="mt-1 text-xs text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        <Button type="button" onClick={onEdit} variant="outline">
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSave}>
      {editContent}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="flex gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          className="w-24"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-24" disabled={isSaving}>
          Save
        </Button>
      </div>
    </form>
  );
}
