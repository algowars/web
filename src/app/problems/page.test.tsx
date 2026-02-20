import { describe, it, expect } from "vitest";
import ProblemsPage from "./page";

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-layout">{children}</div>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="card-title">{children}</h2>
  ),
}));

vi.mock("@/features/problems/problems-table-v2/problems-table-v2", () => ({
  default: () => <div data-testid="problems-table">ProblemsTableV2</div>,
}));

describe("ProblemsPage", () => {
  it("can be initialized", () => {
    expect(ProblemsPage).toBeDefined();
  });

  it("renders the page structure", () => {
    const result = ProblemsPage();

    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
  });
});
