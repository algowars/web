import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AccountSettings from "./account-settings";

vi.mock("@/features/settings/api/get-user-settings", () => ({
  useSuspenseUserSettings: () => ({
    data: {
      username: "testuser",
      bio: "My bio",
      usernameLastChangedAt: null,
    },
  }),
}));

vi.mock("../settings-store", () => ({
  useSettingsStore: (selector: (s: unknown) => unknown) =>
    selector({
      settings: {
        username: "testuser",
        bio: "My bio",
        usernameLastChangedAt: null,
      },
      accountIsEditing: false,
      initSettings: vi.fn(),
      beginAccountEditing: vi.fn(),
      stopAccountEditing: vi.fn(),
    }),
}));

vi.mock("./account-settings-form", () => ({
  default: () => <div data-testid="account-settings-form">Form</div>,
}));

describe("AccountSettings", () => {
  it("renders the card with account settings title", () => {
    render(<AccountSettings />);
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
  });

  it("renders the account settings form", () => {
    render(<AccountSettings />);
    expect(screen.getByTestId("account-settings-form")).toBeInTheDocument();
  });
});
