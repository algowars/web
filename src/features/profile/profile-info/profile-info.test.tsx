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

import ProfileInfo from "./profile-info";

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
    const profile = makeProfile({ username: "testuser" });
    mockProfileStoreState.profile = profile;

    render(<ProfileInfo />);
    expect(screen.getByText("testuser")).toBeDefined();
  });

  it("renders a formatted creation date", () => {
    const createdOn = new Date(2024, 2, 15); // March 15, 2024 in local time
    const profile = makeProfile({ createdOn });
    mockProfileStoreState.profile = profile;

    render(<ProfileInfo />);
    expect(screen.getByText("March 15, 2024")).toBeDefined();
  });

  it("renders no date when createdOn is undefined", () => {
    const profile = makeProfile({ createdOn: undefined });
    mockProfileStoreState.profile = profile;

    render(<ProfileInfo />);
    expect(screen.getByText(profile.username)).toBeDefined();
  });

  it("renders ProfileInfoEdit", () => {
    mockProfileStoreState.profile = makeProfile();
    render(<ProfileInfo />);
    expect(screen.getByTestId("profile-info-edit")).toBeDefined();
  });
});
