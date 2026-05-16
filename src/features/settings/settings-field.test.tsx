import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SettingsField from "./settings-field";

const defaultProps = {
  label: "Username",
  isEditing: false,
  onEdit: vi.fn(),
  editContent: <input data-testid="edit-input" />,
  onCancel: vi.fn(),
  onSave: vi.fn(),
};

describe("SettingsField", () => {
  describe("view mode (isEditing=false)", () => {
    it("renders the label", () => {
      render(<SettingsField {...defaultProps} value="testuser" />);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders the value when provided", () => {
      render(<SettingsField {...defaultProps} value="testuser" />);
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("renders the default emptyText when value is not provided", () => {
      render(<SettingsField {...defaultProps} />);
      expect(screen.getByText("Not set.")).toBeInTheDocument();
    });

    it("renders custom emptyText when value is falsy", () => {
      render(
        <SettingsField
          {...defaultProps}
          value=""
          emptyText="No username set."
        />
      );
      expect(screen.getByText("No username set.")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <SettingsField
          {...defaultProps}
          value="testuser"
          description="Last changed: Jan 1, 2024"
        />
      );
      expect(screen.getByText("Last changed: Jan 1, 2024")).toBeInTheDocument();
    });

    it("does not render description when omitted", () => {
      render(<SettingsField {...defaultProps} value="testuser" />);
      expect(
        screen.queryByText("Last changed: Jan 1, 2024")
      ).not.toBeInTheDocument();
    });

    it("renders Edit button", () => {
      render(<SettingsField {...defaultProps} value="testuser" />);
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });

    it("calls onEdit when Edit button is clicked", async () => {
      const onEdit = vi.fn();
      const user = userEvent.setup();
      render(
        <SettingsField {...defaultProps} value="testuser" onEdit={onEdit} />
      );

      await user.click(screen.getByRole("button", { name: "Edit" }));

      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("does not render editContent in view mode", () => {
      render(<SettingsField {...defaultProps} value="testuser" />);
      expect(screen.queryByTestId("edit-input")).not.toBeInTheDocument();
    });
  });

  describe("edit mode (isEditing=true)", () => {
    const editProps = { ...defaultProps, isEditing: true };

    it("renders editContent", () => {
      render(<SettingsField {...editProps} />);
      expect(screen.getByTestId("edit-input")).toBeInTheDocument();
    });

    it("renders Cancel button", () => {
      render(<SettingsField {...editProps} />);
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    it("renders Save button", () => {
      render(<SettingsField {...editProps} />);
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("calls onCancel when Cancel is clicked", async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<SettingsField {...editProps} onCancel={onCancel} />);

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onSave when Save is clicked", async () => {
      const onSave = vi.fn((e: React.FormEvent) => e.preventDefault());
      const user = userEvent.setup();
      render(<SettingsField {...editProps} onSave={onSave} />);

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it("renders error message when error prop is provided", () => {
      render(<SettingsField {...editProps} error="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("does not render error message when error is null", () => {
      render(<SettingsField {...editProps} error={null} />);
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();
    });

    it("disables Cancel button when isSaving is true", () => {
      render(<SettingsField {...editProps} isSaving={true} />);
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    });

    it("disables Save button when isSaving is true", () => {
      render(<SettingsField {...editProps} isSaving={true} />);
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });

    it("does not disable buttons when isSaving is false", () => {
      render(<SettingsField {...editProps} isSaving={false} />);
      expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
      expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
    });

    it("does not show Edit button in edit mode", () => {
      render(<SettingsField {...editProps} />);
      expect(
        screen.queryByRole("button", { name: "Edit" })
      ).not.toBeInTheDocument();
    });
  });
});
