import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemManagementHeader from "./problem-management-header";
import { useAccount } from "@/features/auth/account.context";
import { Permissions } from "@/features/auth/permissions/models/permissions";

vi.mock("@/features/auth/account.context");

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("ProblemManagementHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header title and description", () => {
    (useAccount as Mock).mockReturnValue({
      account: null,
    });

    render(<ProblemManagementHeader />);

    expect(screen.getByText("Problem Management")).toBeInTheDocument();
    expect(screen.getByText("Manage coding problems.")).toBeInTheDocument();
  });

  it("shows Create link when user has CreateProblem permission", () => {
    (useAccount as Mock).mockReturnValue({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        permissions: [Permissions.CreateProblem],
      },
    });

    render(<ProblemManagementHeader />);

    const createLink = screen.getByRole("link", { name: "Create" });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/problems/management/create");
  });

  it("hides Create link when user does not have CreateProblem permission", () => {
    (useAccount as Mock).mockReturnValue({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        permissions: [],
      },
    });

    render(<ProblemManagementHeader />);

    expect(
      screen.queryByRole("link", { name: "Create" })
    ).not.toBeInTheDocument();
  });

  it("hides Create link when user has no permissions", () => {
    (useAccount as Mock).mockReturnValue({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        permissions: undefined,
      },
    });

    render(<ProblemManagementHeader />);

    expect(
      screen.queryByRole("link", { name: "Create" })
    ).not.toBeInTheDocument();
  });

  it("hides Create link when account is null", () => {
    (useAccount as Mock).mockReturnValue({
      account: null,
    });

    render(<ProblemManagementHeader />);

    expect(
      screen.queryByRole("link", { name: "Create" })
    ).not.toBeInTheDocument();
  });

  it("hides Create link when account is undefined", () => {
    (useAccount as Mock).mockReturnValue({
      account: undefined,
    });

    render(<ProblemManagementHeader />);

    expect(
      screen.queryByRole("link", { name: "Create" })
    ).not.toBeInTheDocument();
  });

  it("shows Create link when user has multiple permissions including CreateProblem", () => {
    (useAccount as Mock).mockReturnValue({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        permissions: [Permissions.ReadProblem, Permissions.CreateProblem],
      },
    });

    render(<ProblemManagementHeader />);

    expect(screen.getByRole("link", { name: "Create" })).toBeInTheDocument();
  });

  it("hides Create link when user has only ReadProblem permission", () => {
    (useAccount as Mock).mockReturnValue({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        permissions: [Permissions.ReadProblem],
      },
    });

    render(<ProblemManagementHeader />);

    expect(
      screen.queryByRole("link", { name: "Create" })
    ).not.toBeInTheDocument();
  });
});
