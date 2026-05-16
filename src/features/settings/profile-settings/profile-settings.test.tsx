import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileSettings from "./profile-settings";

vi.mock("@/features/profile/api/get-profile-settings", () => ({
  useSuspenseProfileSettings: () => ({
    data: {
      username: "testuser",
      bio: "My test bio",
      usernameLastChangedAt: null,
    },
  }),
}));

vi.mock("../profile-settings-store", () => ({
  useProfileSettingsStore: (selector: (s: unknown) => unknown) =>
    selector({
      profile: { username: "testuser", bio: "My test bio" },
      isEditing: false,
      initProfile: vi.fn(),
      beginEditing: vi.fn(),
      stopEditing: vi.fn(),
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
