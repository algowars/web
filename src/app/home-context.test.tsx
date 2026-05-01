import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomeContext from "./home-context";

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: vi.fn(),
  },
}));

vi.mock("@/features/dashboard/dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock("@/features/landing/landing", () => ({
  default: () => <div data-testid="landing">Landing</div>,
}));

import { auth0 } from "@/lib/auth0";

describe("HomeContext", () => {
  it("shows Dashboard when session exists", async () => {
    vi.mocked(auth0.getSession).mockResolvedValue({
      user: { sub: "auth0|123" },
    } as Awaited<ReturnType<typeof auth0.getSession>>);

    render(await HomeContext());

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("shows Landing when no session", async () => {
    vi.mocked(auth0.getSession).mockResolvedValue(null);

    render(await HomeContext());

    expect(screen.getByTestId("landing")).toBeInTheDocument();
  });
});
