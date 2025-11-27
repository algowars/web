import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import ProblemPage from "@/app/problems/[slug]/page";

vi.mock("@/features/problems/api/get-problem-by-slug", () => {
  return {
    getProblemBySlug: vi.fn(),
    getProblemBySlugQueryOptions: (slug: string) => ({
      queryKey: ["problem", slug],
      queryFn: () => getProblemBySlug({ slug }),
    }),
  };
});

vi.mock("@/features/problem/problem-layout", () => ({
  default: ({ problem }: any) => (
    <div data-testid="problem-layout">{problem.title}</div>
  ),
}));

import { getProblemBySlug } from "@/features/problems/api/get-problem-by-slug";
import { renderWithClient } from "@tests/utils/test-utils";

describe("ProblemPage", () => {
  it("renders ProblemLayout when problem data exists", async () => {
    (getProblemBySlug as any).mockResolvedValue({
      id: 1,
      title: "Mock Problem",
      question: "Mock question",
    });

    const ui = await ProblemPage({
      params: Promise.resolve({ slug: "mock-slug" }),
    });

    const { wrapper } = renderWithClient(ui);
    const { getByTestId } = render(ui, { wrapper });

    expect(getByTestId("problem-layout")).toBeInTheDocument();
    expect(getByTestId("problem-layout")).toHaveTextContent("Mock Problem");
  });

  it("renders 'Problem not found' when queryClient has no data", async () => {
    (getProblemBySlug as any).mockResolvedValue(null);

    const ui = await ProblemPage({
      params: Promise.resolve({ slug: "missing-problem" }),
    });

    const { wrapper } = renderWithClient(ui);
    const { getByText } = render(ui, { wrapper });

    expect(getByText("Problem not found")).toBeInTheDocument();
  });
});
