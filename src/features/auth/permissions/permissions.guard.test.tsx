import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import PermissionsGuard from "./permissions.guard";
import { useAccount, AuthStatus } from "../account.context";
import { useHasPermissions } from "@/hooks/use-has-permissions";
import { Permissions } from "./models/permissions";
import { redirect } from "next/navigation";

vi.mock("../account.context");

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when user has required permissions", () => {
    (useAccount as Mock).mockReturnValue({
      account: { permissions: [Permissions.CreateProblem] },
      isPending: false,
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
    });
    (useHasPermissions as Mock).mockReturnValue(true);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders children when isPending is true even without permissions", () => {
    (useAccount as Mock).mockReturnValue({
      account: null,
      isPending: true,
      authStatus: AuthStatus.UNAUTHENTICATED,
    });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders children when PARTIALLY_AUTHENTICATED even without permissions", () => {
    (useAccount as Mock).mockReturnValue({
      account: null,
      isPending: false,
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
    });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to home when user lacks permissions and not pending", () => {
    (useAccount as Mock).mockReturnValue({
      account: { permissions: [] },
      isPending: false,
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
    });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects when UNAUTHENTICATED and lacking permissions", () => {
    (useAccount as Mock).mockReturnValue({
      account: null,
      isPending: false,
      authStatus: AuthStatus.UNAUTHENTICATED,
    });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.ReadProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("passes permissions and mode to useHasPermissions hook", () => {
    (useAccount as Mock).mockReturnValue({
      account: {
        permissions: [Permissions.CreateProblem, Permissions.ReadProblem],
      },
      isPending: false,
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
    });
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
      [Permissions.CreateProblem, Permissions.ReadProblem],
      [Permissions.CreateProblem, Permissions.ReadProblem],
      "all"
    );
  });

  it("renders children with default empty permissions", () => {
    (useAccount as Mock).mockReturnValue({
      account: { permissions: [] },
      isPending: false,
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
    });
    (useHasPermissions as Mock).mockReturnValue(true);

    render(
      <PermissionsGuard>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(useHasPermissions).toHaveBeenCalledWith([], [], undefined);
  });
});
