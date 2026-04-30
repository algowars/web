import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PermissionsGuard from "./permissions.guard";
import { accountStore } from "@/features/account/account-store";
import { useHasPermissions } from "@/hooks/use-has-permissions";
import { Permissions } from "./models/permissions";
import { redirect } from "next/navigation";
import { Mock } from "vitest";

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
    accountStore.setState({ account: null, isLoading: false });
  });

  it("renders children when user has required permissions", () => {
    accountStore.setState({
      account: { id: "1", username: "user", createdAt: new Date(), updatedAt: null, usernameLastChangedAt: null, permissions: [Permissions.CreateProblem] },
      isLoading: false,
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

  it("does not redirect while store is still loading", () => {
    accountStore.setState({ account: null, isLoading: true });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to home when user lacks permissions and store is not loading", () => {
    accountStore.setState({
      account: { id: "1", username: "user", createdAt: new Date(), updatedAt: null, usernameLastChangedAt: null, permissions: [] },
      isLoading: false,
    });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.CreateProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects when unauthenticated and store is not loading", () => {
    accountStore.setState({ account: null, isLoading: false });
    (useHasPermissions as Mock).mockReturnValue(false);

    render(
      <PermissionsGuard permissions={[Permissions.ReadProblem]}>
        <div>Protected Content</div>
      </PermissionsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("passes permissions and mode to useHasPermissions hook", () => {
    accountStore.setState({
      account: { id: "1", username: "user", createdAt: new Date(), updatedAt: null, usernameLastChangedAt: null, permissions: [Permissions.CreateProblem, Permissions.ReadProblem] },
      isLoading: false,
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
    accountStore.setState({
      account: { id: "1", username: "user", createdAt: new Date(), updatedAt: null, usernameLastChangedAt: null, permissions: [] },
      isLoading: false,
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
