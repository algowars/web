import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./profile-context", () => ({
  ProfileProvider: ({
    username,
    children,
  }: {
    username: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="profile-provider" data-username={username}>
      {children}
    </div>
  ),
}));

vi.mock("./profile-info/profile-info", () => ({
  default: () => <div data-testid="profile-info">Profile Info</div>,
}));

import Profile from "./profile";

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ProfileProvider with correct username from params", async () => {
    const params = Promise.resolve({ username: "testuser" });

    const Component = await Profile({ params });
    render(Component);

    const provider = screen.getByTestId("profile-provider");
    expect(provider).toHaveAttribute("data-username", "testuser");
  });

  it("renders ProfileInfo component", async () => {
    const params = Promise.resolve({ username: "testuser" });

    const Component = await Profile({ params });
    render(Component);

    expect(screen.getByTestId("profile-info")).toBeInTheDocument();
  });

  it("renders the grid layout", async () => {
    const params = Promise.resolve({ username: "anotheruser" });

    const Component = await Profile({ params });
    const { container } = render(Component);

    const gridContainer = container.querySelector(".grid-cols-12");
    expect(gridContainer).toBeInTheDocument();

    const columnDiv = container.querySelector(".col-span-3");
    expect(columnDiv).toBeInTheDocument();
  });

  it("handles different usernames correctly", async () => {
    const params = Promise.resolve({ username: "differentuser123" });

    const Component = await Profile({ params });
    render(Component);

    const provider = screen.getByTestId("profile-provider");
    expect(provider).toHaveAttribute("data-username", "differentuser123");
  });
});
