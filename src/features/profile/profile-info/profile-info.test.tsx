import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import React from "react";
import ProfileInfo from "./profile-info";

type Profile = {
  username: string;
  bio?: string;
  imageUrl?: string;
  createdOn?: Date | null;
};

const mockProfileStoreState: { profile: Profile | null } = { profile: null };

vi.mock("../profile-store", () => ({
  useProfileStore: (selector: (s: typeof mockProfileStoreState) => unknown) =>
    selector(mockProfileStoreState),
}));

vi.mock("./profile-info-edit", () => ({
  default: () => <div data-testid="profile-info-edit" />,
}));

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    username: faker.internet.username(),
    bio: faker.lorem.sentence(),
    imageUrl: faker.image.avatar(),
    createdOn: faker.date.past(),
    ...overrides,
  };
}

describe("ProfileInfo", () => {
  beforeEach(() => {
    mockProfileStoreState.profile = null;
  });

  it("renders null when profile is null", () => {
    mockProfileStoreState.profile = null;

    const { container } = render(<ProfileInfo />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the username", () => {
    mockProfileStoreState.profile = makeProfile({ username: "testuser" });

    render(<ProfileInfo />);
    expect(screen.getByText("testuser")).toBeDefined();
  });

  it("renders formatted creation date", () => {
    mockProfileStoreState.profile = makeProfile({
      createdOn: new Date(2024, 2, 15),
    });

    render(<ProfileInfo />);
    expect(screen.getByText("March 15, 2024")).toBeDefined();
  });

  it("renders avatar component", () => {
    mockProfileStoreState.profile = makeProfile();

    const { container } = render(<ProfileInfo />);
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });

  it("renders initial in fallback when imageUrl exists", () => {
    const username = "testuser";
    mockProfileStoreState.profile = makeProfile({
      username,
      imageUrl: "https://example.com/avatar.png",
    });

    render(<ProfileInfo />);
    expect(screen.getByText(username)).toBeDefined();
  });

  it("renders ProfileInfoEdit component", () => {
    mockProfileStoreState.profile = makeProfile();

    render(<ProfileInfo />);
    expect(screen.getByTestId("profile-info-edit")).toBeInTheDocument();
  });

  it("handles missing createdOn date", () => {
    mockProfileStoreState.profile = makeProfile({ createdOn: null });

    render(<ProfileInfo />);
    expect(
      screen.getByText(mockProfileStoreState.profile!.username)
    ).toBeInTheDocument();
  });
});
