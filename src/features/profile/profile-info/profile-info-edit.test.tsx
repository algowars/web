import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileInfoEdit from "./profile-info-edit";

vi.mock("../profile-context", () => ({
  useProfileContext: vi.fn(),
}));

vi.mock("@/features/auth/account.context", () => ({
  useAccount: vi.fn(),
}));

import { useProfileContext } from "../profile-context";
import { useAccount } from "@/features/auth/account.context";

const mockUseProfileContext = vi.mocked(useProfileContext);
const mockUseAccount = vi.mocked(useAccount);

describe("ProfileInfoEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when profileAggregate is null", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: null,
    } as ReturnType<typeof useProfileContext>);
    mockUseAccount.mockReturnValue({
      account: { username: "testuser" },
    } as ReturnType<typeof useAccount>);

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account is null", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "testuser" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockUseAccount.mockReturnValue({
      account: null,
    } as ReturnType<typeof useAccount>);

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when account has no username", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "testuser" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockUseAccount.mockReturnValue({
      account: { username: undefined },
    } as unknown as ReturnType<typeof useAccount>);

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when user is not the profile owner", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "profileowner" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockUseAccount.mockReturnValue({
      account: { username: "differentuser" },
    } as ReturnType<typeof useAccount>);

    const { container } = render(<ProfileInfoEdit />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Edit Profile link when user is the owner", () => {
    mockUseProfileContext.mockReturnValue({
      profileAggregate: {
        profile: { username: "testuser" },
      },
    } as unknown as ReturnType<typeof useProfileContext>);
    mockUseAccount.mockReturnValue({
      account: { username: "testuser" },
    } as ReturnType<typeof useAccount>);

    render(<ProfileInfoEdit />);

    const link = screen.getByRole("link", { name: "Edit Profile" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/settings");
  });
});
