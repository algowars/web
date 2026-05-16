import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import React from "react";
import ProfileInfoEdit from "./profile-info-edit";

const mockProfileStoreState = { profile: null as { username: string } | null };
const mockAccountStoreState = {
  account: null as { username?: string } | null,
};

vi.mock("../profile-store", () => ({
  useProfileStore: (selector: (s: typeof mockProfileStoreState) => unknown) =>
    selector(mockProfileStoreState),
}));

vi.mock("@/features/account/account-store", () => ({
  accountStore: (selector: (s: typeof mockAccountStoreState) => unknown) =>
    selector(mockAccountStoreState),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    profileSettings: { path: "/settings/profile" },
  },
}));

describe("ProfileInfoEdit", () => {
  beforeEach(() => {
    mockProfileStoreState.profile = null;
    mockAccountStoreState.account = null;
  });

  it("returns null when profile is null", () => {
    mockProfileStoreState.profile = null;
    mockAccountStoreState.account = { username: "testuser" };

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account is null", () => {
    mockProfileStoreState.profile = { username: "testuser" };
    mockAccountStoreState.account = null;

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account has no username", () => {
    mockProfileStoreState.profile = { username: "testuser" };
    mockAccountStoreState.account = { username: undefined };

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when user is not the profile owner", () => {
    mockProfileStoreState.profile = { username: "profileowner" };
    mockAccountStoreState.account = { username: "differentuser" };

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Edit Profile link when user is the owner", () => {
    const username = faker.internet.username();
    mockProfileStoreState.profile = { username };
    mockAccountStoreState.account = { username };

    render(<ProfileInfoEdit />);
    const link = screen.getByRole("link", { name: "Edit Profile" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/settings/profile");
  });
});
