import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterAll } from "vitest";
import { AppProvider } from "./provider";

vi.mock("@tanstack/react-query", () => ({
  QueryClient: vi.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools" />,
}));

vi.mock("react-error-boundary", () => ({
  ErrorBoundary: ({
    children,
  }: {
    children: React.ReactNode;
    FallbackComponent: React.ComponentType;
  }) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock("@/features/account/account-initializer", () => ({
  default: () => <div data-testid="account-initializer" />,
}));

vi.mock("@/lib/react-query", () => ({
  queryConfig: {},
}));

describe("AppProvider", () => {
  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("renders children", () => {
    render(
      <AppProvider>
        <div data-testid="child">Child content</div>
      </AppProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("wraps with ErrorBoundary", () => {
    render(
      <AppProvider>
        <div>Content</div>
      </AppProvider>
    );

    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
  });

  it("provides QueryClientProvider", () => {
    render(
      <AppProvider>
        <div>Content</div>
      </AppProvider>
    );

    expect(screen.getByTestId("query-client-provider")).toBeInTheDocument();
  });

  it("renders AccountInitializer", () => {
    render(
      <AppProvider>
        <div>Content</div>
      </AppProvider>
    );

    expect(screen.getByTestId("account-initializer")).toBeInTheDocument();
  });

  it("renders Toaster", () => {
    render(
      <AppProvider>
        <div>Content</div>
      </AppProvider>
    );

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });
});
