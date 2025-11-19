import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileSettings from "./profile-settings";
import { useProfileSettings } from "@/features/profile/api/get-profile-settings";

vi.mock("@/features/profile/api/get-profile-settings", () => ({
  useProfileSettings: vi.fn(),
}));

const mockUseProfileSettings = vi.mocked(useProfileSettings);

describe("ProfileSettings", () => {
  it("renders loading state", () => {
    mockUseProfileSettings.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(<ProfileSettings />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseProfileSettings.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(<ProfileSettings />);

    expect(
      screen.getByText(/Unable to load profile information/i)
    ).toBeInTheDocument();
  });

  it("shows the username in a disabled input", () => {
    mockUseProfileSettings.mockReturnValue({
      data: { username: "jira-user" },
      isLoading: false,
      isError: false,
    } as any);

    render(<ProfileSettings />);

    const input = screen.getByLabelText(/Username/i) as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input.value).toBe("jira-user");
  });
});
