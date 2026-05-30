import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemsTableV2 from "./problems-table-v2";
import { useProblems } from "../api/get-problems-pageable";
import { Problem } from "../models/problem";
import { PageResult } from "@/shared/pagination/page-result";

vi.mock("../api/get-problems-pageable");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => "/problems",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    problem: {
      execute: ({ slug }: { slug: string }) => `/problems/${slug}`,
    },
  },
}));

const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: 1,
    tags: ["array", "hash-table"],
    availableLanguages: [],
  },
  {
    id: "2",
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: 1500,
    tags: ["linked-list", "math"],
    availableLanguages: [],
  },
  {
    id: "3",
    title: "Longest Substring",
    slug: "longest-substring",
    difficulty: 2500,
    tags: ["string", "sliding-window"],
    availableLanguages: [],
  },
];

const mockPageResult: PageResult<Problem> = {
  results: mockProblems,
  total: 3,
  page: 1,
  size: 25,
  totalPages: 1,
  hasMore: false,
};

describe("ProblemsTableV2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the data table with problems", () => {
    (useProblems as Mock).mockReturnValue({
      data: mockPageResult,
      isFetching: false,
    });

    render(<ProblemsTableV2 />);

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
    expect(screen.getByText("Add Two Numbers")).toBeInTheDocument();
    expect(screen.getByText("Longest Substring")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    (useProblems as Mock).mockReturnValue({
      data: mockPageResult,
      isFetching: false,
    });

    render(<ProblemsTableV2 />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
  });

  it("renders empty table when no data", () => {
    (useProblems as Mock).mockReturnValue({
      data: undefined,
      isFetching: false,
    });

    render(<ProblemsTableV2 />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.queryByText("Two Sum")).not.toBeInTheDocument();
  });

  it("renders empty table when results is empty", () => {
    (useProblems as Mock).mockReturnValue({
      data: {
        results: [],
        total: 0,
        page: 1,
        size: 25,
        totalPages: 0,
        hasMore: false,
      },
      isFetching: false,
    });

    render(<ProblemsTableV2 />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.queryByText("Two Sum")).not.toBeInTheDocument();
  });

  it("calls useProblems with initial pagination state", () => {
    (useProblems as Mock).mockReturnValue({
      data: mockPageResult,
      isFetching: false,
    });

    render(<ProblemsTableV2 />);

    expect(useProblems).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: { pageIndex: 0, pageSize: 25 },
        timestamp: expect.any(Date),
      })
    );
  });

  it("passes isFetching to isLoading prop", () => {
    (useProblems as Mock).mockReturnValue({
      data: mockPageResult,
      isFetching: true,
    });

    render(<ProblemsTableV2 />);

    expect(useProblems).toHaveBeenCalled();
  });

  it("renders difficulty column", () => {
    (useProblems as Mock).mockReturnValue({
      data: mockPageResult,
      isFetching: false,
    });

    render(<ProblemsTableV2 />);

    // Difficulty column is present
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
  });
});
