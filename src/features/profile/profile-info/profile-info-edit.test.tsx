import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import ProfileInfoEdit from "./profile-info-edit";

const mockProfileStoreState = { profile: null as { username: string } | null };
const mockAccountStoreState = { account: null as { username: string } | null };

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

import React from "react";

describe("ProfileInfoEdit", () => {
  beforeEach(() => {
    mockProfileStoreState.profile = null;
    mockAccountStoreState.account = null;
  });

  it("returns null when profileAggregate is null", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: null,
    } as ReturnType<typeof useProfileContext>);
    mockAccount({ username: "testuser" });

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account is null", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "testuser" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockAccount(null);

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account has no username", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "testuser" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockAccount({ username: undefined });

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when user is not the profile owner", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "profileowner" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockAccount({ username: "differentuser" });

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Edit Profile link when user is the owner", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "testuser" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockAccount({ username: "testuser" });

    render(<ProfileInfoEdit />);
    const link = screen.getByRole("link", { name: "Edit Profile" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/settings/profile");
  });

  it("renders null when account is null", () => {
    const username = faker.internet.username();
    mockProfileStoreState.profile = { username };
    mockAccountStoreState.account = null;

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });
});
