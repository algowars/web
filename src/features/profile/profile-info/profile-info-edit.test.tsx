import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProfileInfoEdit from "./profile-info-edit";

vi.mock("../profile-store", () => ({
  useProfileStore: vi.fn(),
}));

vi.mock("@/features/account/account-store", () => ({
  accountStore: vi.fn(),
}));

import { useProfileStore } from "../profile-store";
import { accountStore } from "@/features/account/account-store";

const mockUseProfileStore = vi.mocked(useProfileStore);

function mockAccount(account: unknown) {
  (accountStore as unknown as Mock).mockImplementation(
    (selector: (state: { account: unknown }) => unknown) =>
      selector({ account })
  );
}

describe("ProfileInfoEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when profile is null", () => {
    mockUseProfileStore.mockReturnValue(null);
    mockAccount({ username: "testuser" });

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account is null", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
    } as ReturnType<typeof useProfileStore>);
    mockAccount(null);

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account has no username", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
    } as ReturnType<typeof useProfileStore>);
    mockAccount({ username: undefined });

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when user is not the profile owner", () => {
    mockUseProfileStore.mockReturnValue({
      username: "profileowner",
    } as ReturnType<typeof useProfileStore>);
    mockAccount({ username: "differentuser" });

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Edit Profile link when user is the owner", () => {
    mockUseProfileStore.mockReturnValue({
      username: "testuser",
    } as ReturnType<typeof useProfileStore>);
    mockAccount({ username: "testuser" });

    render(<ProfileInfoEdit />);

    const link = screen.getByRole("link", { name: "Edit Profile" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/settings");
  });
});
