import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";
import { SubmissionStatus } from "../models/submission-status";
import type { Problem } from "@/features/problems/models/problem";
import type { ProblemSubmission } from "../models/problem-submission";

const mockProblem: Problem = {
  id: "problem-1",
  title: "Two Sum",
  slug: "two-sum",
  question: "Given an array...",
  tags: ["array", "hash-table"],
  difficulty: 1000,
  availableLanguages: [],
};

const mockSubmission: ProblemSubmission = {
  id: "sub-1",
  code: "console.log('hello')",
  status: SubmissionStatus.ACCEPTED,
  language: "JavaScript",
  languageVersion: "18",
  runtimeMs: 50,
  memoryKb: 256,
  createdOn: new Date(),
  createdBy: {
    id: "user-1",
    username: "testuser",
    createdAt: new Date(),
    updatedAt: null,
    usernameLastChangedAt: null,
  },
};

describe("useProblemSubmissionsStore", () => {
  beforeEach(() => {
    act(() => {
      useProblemSubmissionsStore.setState({
        problem: null,
        submissions: [],
        page: 1,
        size: 25,
        timestamp: new Date(),
        currentUserId: undefined,
        filterOption: ProblemSubmissionsOptions.ALL_SOLUTIONS,
        total: 0,
        hasMore: true,
      });
    });
  });

  describe("initial state", () => {
    it("starts with no problem", () => {
      const { result } = renderHook(() =>
        useProblemSubmissionsStore((s) => s.problem)
      );
      expect(result.current).toBeNull();
    });

    it("starts with empty submissions", () => {
      const { result } = renderHook(() =>
        useProblemSubmissionsStore((s) => s.submissions)
      );
      expect(result.current).toEqual([]);
    });

    it("starts with page 1", () => {
      const { result } = renderHook(() =>
        useProblemSubmissionsStore((s) => s.page)
      );
      expect(result.current).toBe(1);
    });

    it("starts with ALL_SOLUTIONS filter", () => {
      const { result } = renderHook(() =>
        useProblemSubmissionsStore((s) => s.filterOption)
      );
      expect(result.current).toBe(ProblemSubmissionsOptions.ALL_SOLUTIONS);
    });

    it("starts with hasMore true", () => {
      const { result } = renderHook(() =>
        useProblemSubmissionsStore((s) => s.hasMore)
      );
      expect(result.current).toBe(true);
    });

    it("starts with total 0", () => {
      const { result } = renderHook(() =>
        useProblemSubmissionsStore((s) => s.total)
      );
      expect(result.current).toBe(0);
    });
  });

  describe("initProblem", () => {
    it("sets the problem", () => {
      act(() => {
        useProblemSubmissionsStore.getState().initProblem(mockProblem);
      });

      expect(useProblemSubmissionsStore.getState().problem).toEqual(
        mockProblem
      );
    });
  });

  describe("changeFilterOption", () => {
    it("updates the filter option", () => {
      act(() => {
        useProblemSubmissionsStore
          .getState()
          .changeFilterOption(ProblemSubmissionsOptions.MY_SUBMISSIONS);
      });

      expect(useProblemSubmissionsStore.getState().filterOption).toBe(
        ProblemSubmissionsOptions.MY_SUBMISSIONS
      );
    });

    it("resets submissions to empty when filter changes", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
      });

      act(() => {
        useProblemSubmissionsStore
          .getState()
          .changeFilterOption(ProblemSubmissionsOptions.MY_SUBMISSIONS);
      });

      expect(useProblemSubmissionsStore.getState().submissions).toEqual([]);
    });

    it("resets page to 1 when filter changes", () => {
      act(() => {
        useProblemSubmissionsStore.getState().incrementPage();
      });

      act(() => {
        useProblemSubmissionsStore
          .getState()
          .changeFilterOption(ProblemSubmissionsOptions.MY_SUBMISSIONS);
      });

      expect(useProblemSubmissionsStore.getState().page).toBe(1);
    });

    it("resets hasMore to true when filter changes", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setHasMore(false);
      });

      act(() => {
        useProblemSubmissionsStore
          .getState()
          .changeFilterOption(ProblemSubmissionsOptions.MY_SUBMISSIONS);
      });

      expect(useProblemSubmissionsStore.getState().hasMore).toBe(true);
    });
  });

  describe("setSubmissions", () => {
    it("replaces the submissions array", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
      });

      expect(useProblemSubmissionsStore.getState().submissions).toEqual([
        mockSubmission,
      ]);
    });
  });

  describe("addSubmissions", () => {
    it("appends submissions to the existing array", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
      });

      const newSubmission = { ...mockSubmission, id: "sub-2" };
      act(() => {
        useProblemSubmissionsStore.getState().addSubmissions([newSubmission]);
      });

      expect(useProblemSubmissionsStore.getState().submissions).toEqual([
        mockSubmission,
        newSubmission,
      ]);
    });
  });

  describe("incrementPage", () => {
    it("increments the page by 1", () => {
      act(() => {
        useProblemSubmissionsStore.getState().incrementPage();
      });

      expect(useProblemSubmissionsStore.getState().page).toBe(2);
    });

    it("increments the page multiple times", () => {
      act(() => {
        useProblemSubmissionsStore.getState().incrementPage();
        useProblemSubmissionsStore.getState().incrementPage();
      });

      expect(useProblemSubmissionsStore.getState().page).toBe(3);
    });
  });

  describe("setTotal", () => {
    it("sets the total", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setTotal(42);
      });

      expect(useProblemSubmissionsStore.getState().total).toBe(42);
    });
  });

  describe("setHasMore", () => {
    it("sets hasMore to false", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setHasMore(false);
      });

      expect(useProblemSubmissionsStore.getState().hasMore).toBe(false);
    });

    it("sets hasMore back to true", () => {
      act(() => {
        useProblemSubmissionsStore.getState().setHasMore(false);
        useProblemSubmissionsStore.getState().setHasMore(true);
      });

      expect(useProblemSubmissionsStore.getState().hasMore).toBe(true);
    });
  });
});
