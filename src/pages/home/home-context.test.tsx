import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import "@/domains/auth/__mocks__/auth0.mock";
import { setSessionMock } from "@/domains/auth/__mocks__/auth0.mock";
import { sessionStates } from "@/domains/auth/__mocks__/auth0.mocks";
import HomeContext from "./home-context";

vi.mock("@/features/dashboard/dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock("@/features/landing/landing", () => ({
  default: () => <div data-testid="landing">Landing</div>,
}));

describe("HomeContext", () => {
  beforeEach(() => {
    setSessionMock(sessionStates.authenticated());
  });

  it("should show dashboard when a user is authenticated", async () => {
    render(await HomeContext());
  });

  it("should show the landing page when a user is not authenticated", async () => {
    setSessionMock(sessionStates.unauthenticated());

    render(await HomeContext());

    expect(screen.getByTestId("landing")).toBeInTheDocument();
  });
});
