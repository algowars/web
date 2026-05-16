import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileInfo from "./profile-info";

vi.mock("../profile-store", () => ({
  useProfileStore: vi.fn(),
}));

vi.mock("./profile-info-edit", () => ({
  default: () => <div data-testid="profile-info-edit">Edit</div>,
}));

import { useProfileStore } from "../profile-store";

const mockUseProfileStore = vi.mocked(useProfileStore);

describe("ProfileInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when profile is null", () => {
    mockUseProfileStore.mockReturnValue(null);

    const { container } = render(<ProfileInfo />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the username", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
      createdOn: "2025-06-15T00:00:00Z",
    } as ReturnType<typeof useProfileStore>);

    render(<ProfileInfo />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders formatted creation date", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
      createdOn: "2025-06-15T12:00:00Z",
    } as ReturnType<typeof useProfileStore>);

    render(<ProfileInfo />);

    expect(screen.getByText(/June 1[45], 2025/)).toBeInTheDocument();
  });

  it("renders avatar component", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
      createdOn: "2025-06-15T12:00:00Z",
    } as ReturnType<typeof useProfileStore>);

    const { container } = render(<ProfileInfo />);
    // Radix Avatar shows fallback in jsdom since image doesn't load
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });

  it("renders initial in fallback when imageUrl exists", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
      createdOn: "2025-06-15T00:00:00Z",
    } as ReturnType<typeof useProfileStore>);

    render(<ProfileInfo />);

    expect(screen.getByText("t")).toBeInTheDocument();
  });

  it("renders ProfileInfoEdit component", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
      createdOn: "2025-06-15T00:00:00Z",
    } as ReturnType<typeof useProfileStore>);

    render(<ProfileInfo />);
    expect(screen.getByTestId("profile-info-edit")).toBeInTheDocument();
  });

  it("handles missing createdOn date", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
      imageUrl: "https://example.com/avatar.png",
      createdOn: null,
    } as ReturnType<typeof useProfileStore>);

    render(<ProfileInfo />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });
});
