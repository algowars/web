import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProfileInfoEdit from "./profile-info-edit";

vi.mock("../profile-context", () => ({
  useProfileContext: vi.fn(),
}));

vi.mock("@/features/account/account-store", () => ({
  accountStore: vi.fn(),
}));

import { useProfileContext } from "../profile-context";
import { accountStore } from "@/features/account/account-store";

const mockUseProfileContext = vi.mocked(useProfileContext);

function mockAccount(account: unknown) {
  (accountStore as unknown as Mock).mockImplementation((selector: (state: { account: unknown }) => unknown) =>
    selector({ account })
  );
}

describe("ProfileInfoEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/settings");
  });
});
