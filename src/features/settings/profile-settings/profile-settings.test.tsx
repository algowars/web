import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileSettings from "./profile-settings";

vi.mock("@/features/auth/account.context", () => ({
  useAccount: () => ({
    accessToken: "mock-access-token",
  }),
}));

vi.mock("@/features/profile/api/get-profile-settings", () => ({
  useProfileSettings: () => ({
    data: { username: "testuser" },
    isLoading: false,
    isError: false,
  }),
}));

describe("ProfileSettings", () => {
  it("renders the username in a disabled input", () => {
    render(<ProfileSettings />);

    const input = screen.getByLabelText("Username") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.disabled).toBe(true);
    expect(input.value).toBe("testuser");
  });

  it("shows sign-in message when no access token", () => {
    render(<ProfileSettings accessToken="" />);

    expect(
      screen.getByText("Please sign in to view profile settings.")
    ).toBeInTheDocument();
  });
});
