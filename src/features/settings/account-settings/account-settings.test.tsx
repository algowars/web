import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AccountSettings from "./account-settings";

vi.mock("@/features/auth/api/get-account-settings", () => ({
  useAccountSettings: vi.fn(),
}));

import { useAccountSettings } from "@/features/auth/api/get-account-settings";

const mockUseAccountSettings = vi.mocked(useAccountSettings);

describe("AccountSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when no access token is provided", () => {
    it("renders sign in message", () => {
      mockUseAccountSettings.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useAccountSettings>);

      render(<AccountSettings />);

      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(
        screen.getByText("Please sign in to view account settings.")
      ).toBeInTheDocument();
    });
  });

  describe("when loading", () => {
    it("renders loading state", () => {
      mockUseAccountSettings.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as ReturnType<typeof useAccountSettings>);

      render(<AccountSettings accessToken="test-token" />);

      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(screen.getByText("Loading…")).toBeInTheDocument();
    });
  });

  describe("when error", () => {
    it("renders error state", () => {
      mockUseAccountSettings.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as ReturnType<typeof useAccountSettings>);

      render(<AccountSettings accessToken="test-token" />);

      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(
        screen.getByText("Error loading account settings.")
      ).toBeInTheDocument();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      mockUseAccountSettings.mockReturnValue({
        data: { account: { username: "testuser" } },
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useAccountSettings>);
    });

    it("renders the username", () => {
      render(<AccountSettings accessToken="test-token" />);

      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(screen.getByText("Username")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });

    it("shows edit form when Edit is clicked", async () => {
      const user = userEvent.setup();
      render(<AccountSettings accessToken="test-token" />);

      await user.click(screen.getByRole("button", { name: "Edit" }));

      expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("hides edit form when Cancel is clicked", async () => {
      const user = userEvent.setup();
      render(<AccountSettings accessToken="test-token" />);

      await user.click(screen.getByRole("button", { name: "Edit" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("username")).not.toBeInTheDocument();
    });

    it("shows warning message when editing", async () => {
      const user = userEvent.setup();
      render(<AccountSettings accessToken="test-token" />);

      await user.click(screen.getByRole("button", { name: "Edit" }));

      expect(
        screen.getByText("You can't change your name for a week.")
      ).toBeInTheDocument();
    });
  });
});
