import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import React from "react";

type Profile = {
  username: string;
  bio?: string;
  imageUrl?: string;
  createdOn?: Date;
};

const mockProfileStoreState: { profile: Profile | null } = { profile: null };

vi.mock("../profile-store", () => ({
  useProfileStore: (selector: (s: typeof mockProfileStoreState) => unknown) =>
    selector(mockProfileStoreState),
}));

vi.mock("./profile-info-edit", () => ({
  default: () => <div data-testid="profile-info-edit" />,
}));

import { useProfileContext } from "../profile-context";

const mockUseProfileContext = vi.mocked(useProfileContext);

describe("ProfileInfo", () => {
  beforeEach(() => {
    mockProfileStoreState.profile = null;
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
    expect(screen.getByText("testuser")).toBeDefined();
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
    expect(screen.getByText("March 15, 2024")).toBeDefined();
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
    expect(screen.getByText(profile.username)).toBeDefined();
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
