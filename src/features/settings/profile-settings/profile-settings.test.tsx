import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileSettings from "./profile-settings";

vi.mock("@/features/settings/api/get-user-settings", () => ({
  useSuspenseUserSettings: () => ({
    data: {
      username: "testuser",
      bio: "My test bio",
      usernameLastChangedAt: null,
    },
  }),
}));

vi.mock("../settings-store", () => ({
  useSettingsStore: (selector: (s: unknown) => unknown) =>
    selector({
      settings: { username: "testuser", bio: "My test bio" },
      profileIsEditing: false,
      initSettings: vi.fn(),
      beginProfileEditing: vi.fn(),
      stopProfileEditing: vi.fn(),
    }),
}));

vi.mock("./profile-settings-form", () => ({
  default: () => <div data-testid="profile-settings-form">Form</div>,
}));

describe("ProfileSettings", () => {
  it("renders the card with profile settings title", () => {
    render(<ProfileSettings />);
    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
  });

  it("renders the profile settings form", () => {
    render(<ProfileSettings />);
    expect(screen.getByTestId("profile-settings-form")).toBeInTheDocument();
  });
});
