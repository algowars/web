import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileInfo from "./profile-info";

vi.mock("../profile-context", () => ({
  useProfileContext: vi.fn(),
}));

vi.mock("./profile-info-edit", () => ({
  default: () => <div data-testid="profile-info-edit">Edit</div>,
}));

import { useProfileContext } from "../profile-context";

const mockUseProfileContext = vi.mocked(useProfileContext);

describe("ProfileInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when profileAggregate is null", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: null,
    } as ReturnType<typeof useProfileContext>);

    const { container } = render(<ProfileInfo />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the username", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: {
          username: "testuser",
          imageUrl: "https://example.com/avatar.png",
          createdOn: "2025-06-15T00:00:00Z",
        },
      },
    } as unknown as ReturnType<typeof useProfileContext>);

    render(<ProfileInfo />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders formatted creation date", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: {
          username: "testuser",
          imageUrl: "https://example.com/avatar.png",
          createdOn: "2025-06-15T12:00:00Z",
        },
      },
    } as unknown as ReturnType<typeof useProfileContext>);

    render(<ProfileInfo />);

    expect(screen.getByText(/June 1[45], 2025/)).toBeInTheDocument();
  });

  it("renders avatar component", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: {
          username: "testuser",
          imageUrl: "https://example.com/avatar.png",
          createdOn: "2025-06-15T12:00:00Z",
        },
      },
    } as unknown as ReturnType<typeof useProfileContext>);

    const { container } = render(<ProfileInfo />);
    // Radix Avatar shows fallback in jsdom since image doesn't load
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });

  it("renders initial in fallback when imageUrl exists", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: {
          username: "testuser",
          imageUrl: "https://example.com/avatar.png",
          createdOn: "2025-06-15T00:00:00Z",
        },
      },
    } as unknown as ReturnType<typeof useProfileContext>);

    render(<ProfileInfo />);

    expect(screen.getByText("t")).toBeInTheDocument();
  });

  it("renders ProfileInfoEdit component", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: {
          username: "testuser",
          imageUrl: "https://example.com/avatar.png",
          createdOn: "2025-06-15T00:00:00Z",
        },
      },
    } as unknown as ReturnType<typeof useProfileContext>);

    render(<ProfileInfo />);
    expect(screen.getByTestId("profile-info-edit")).toBeInTheDocument();
  });

  it("handles missing createdOn date", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: {
          username: "testuser",
          imageUrl: "https://example.com/avatar.png",
          createdOn: null,
        },
      },
    } as unknown as ReturnType<typeof useProfileContext>);

    render(<ProfileInfo />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });
});
