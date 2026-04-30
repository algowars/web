import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import PermissionsGuard from "./permissions.guard";
import { accountStore } from "@/features/account/account-store";
import { useHasPermissions } from "@/hooks/use-has-permissions";
import { Permissions } from "./models/permissions";
import { redirect } from "next/navigation";

vi.mock("@/features/account/account-store", () => ({
  accountStore: vi.fn(),
}));

vi.mock("@/hooks/use-has-permissions", () => ({
  useHasPermissions: vi.fn(),
  HasPermissionMode: {
    ALL: "all",
    ANY: "any",
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    home: { path: "/" },
  },
}));

describe("PermissionsGuard", () => {
  const mockAccountSelector = (account: { permissions?: string[] } | null) => {
    (accountStore as unknown as Mock).mockImplementation(
      (selector: (state: { account: typeof account }) => unknown) =>
        selector({ account })
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when user has required permissions", () => {
    mockAccountSelector({ permissions: [Permissions.CreateProblem] });
    (useHasPermissions as Mock).mockReturnValue(true);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to home when user lacks permissions", () => {
    mockAccountSelector({ permissions: [] });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects when account is null and permissions required", () => {
    mockAccountSelector(null);
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.ReadProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("passes permissions and mode to useHasPermissions hook", () => {
    mockAccountSelector({ permissions: [Permissions.CreateProblem] });
    (useHasPermissions as Mock).mockReturnValue(true);

    render(
      <PermissionsGuard
        permissions={[Permissions.CreateProblem, Permissions.ReadProblem]}
        mode="all"
      >
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(useHasPermissions).toHaveBeenCalledWith(
      [Permissions.CreateProblem],
      [Permissions.CreateProblem, Permissions.ReadProblem],
      "all"
    );
  });

  it("renders children with default empty permissions", () => {
    mockAccountSelector(null);
    (useHasPermissions as Mock).mockReturnValue(true);

    render(
      <PermissionsGuard>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(useHasPermissions).toHaveBeenCalledWith(undefined, [], undefined);
  });
});
