import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileLayout from "./profile-layout";
import { Profile } from "./models/profile";

const mockInitProfile = vi.fn();

vi.mock("./profile-store", () => ({
  useProfileStore: (selector: (s: unknown) => unknown) =>
    selector({ initProfile: mockInitProfile }),
}));

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({
    children,
    breadcrumbs,
  }: {
    children: React.ReactNode;
    breadcrumbs: { url: string; name: string }[];
  }) => (
    <div data-testid="sidebar-layout">
      <nav data-testid="breadcrumbs">
        {breadcrumbs.map((b) => (
          <span key={b.url} data-testid="breadcrumb-item">
            {b.name}
          </span>
        ))}
      </nav>
      {children}
    </div>
  ),
}));

vi.mock("./profile-info/profile-info", () => ({
  default: () => <div data-testid="profile-info">Profile Info</div>,
}));

const makeProfile = (overrides: Partial<Profile> = {}): Profile => ({
  username: "testuser",
  bio: "Test bio",
  imageUrl: "https://example.com/avatar.png",
  createdOn: new Date("2024-01-01"),
  ...overrides,
});

describe("ProfileLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ProfileInfo", () => {
    render(<ProfileLayout profile={makeProfile()} />);
    expect(screen.getByTestId("profile-info")).toBeInTheDocument();
  });

  it("renders SidebarLayout", () => {
    render(<ProfileLayout profile={makeProfile()} />);
    expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
  });

  it("calls initProfile with the provided profile", () => {
    const profile = makeProfile();
    render(<ProfileLayout profile={profile} />);
    expect(mockInitProfile).toHaveBeenCalledWith(profile);
  });

  it("includes the username in breadcrumbs", () => {
    render(<ProfileLayout profile={makeProfile({ username: "johndoe" })} />);
    const items = screen.getAllByTestId("breadcrumb-item");
    expect(items.some((el) => el.textContent === "johndoe")).toBe(true);
  });

  it("includes Home in breadcrumbs", () => {
    render(<ProfileLayout profile={makeProfile()} />);
    const items = screen.getAllByTestId("breadcrumb-item");
    expect(items.some((el) => el.textContent === "Home")).toBe(true);
  });
});
