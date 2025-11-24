import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileSettings from "./profile-settings";
import { useProfileSettings } from "@/features/profile/api/get-profile-settings";

vi.mock("@/features/profile/api/get-profile-settings", () => ({
  useProfileSettings: vi.fn(),
}));

const mockUseProfileSettings = vi.mocked(useProfileSettings);

const mockQueryState = (
  state: Partial<ReturnType<typeof useProfileSettings>>
) =>
  mockUseProfileSettings.mockReturnValue(
    {
      data: undefined,
      isLoading: false,
      isError: false,
      ...state,
    } as ReturnType<typeof useProfileSettings>
  );

describe("ProfileSettings", () => {
  it("renders loading state", () => {
    mockQueryState({
      isLoading: true,
    });

    render(<ProfileSettings />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockQueryState({
      isError: true,
    });

    render(<ProfileSettings />);

    expect(
      screen.getByText(/Unable to load profile information/i)
    ).toBeInTheDocument();
  });

  it("shows the username in a disabled input", () => {
    mockQueryState({
      data: { username: "jira-user" },
    });

    render(<ProfileSettings />);

    const input = screen.getByLabelText(/Username/i) as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input.value).toBe("jira-user");
  });
});
