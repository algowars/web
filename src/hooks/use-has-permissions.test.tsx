import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useHasPermissions } from "./use-has-permissions";
import { Permissions } from "@/features/auth/permissions/Permissions";

describe("useHasPermissions", () => {
  describe("with empty required permissions", () => {
    it("returns true when no permissions are required", () => {
      const { result } = renderHook(() =>
        useHasPermissions([Permissions.CreateProblem], [])
      );
      expect(result.current).toBe(true);
    });

    it("returns true when user has no permissions and none required", () => {
      const { result } = renderHook(() => useHasPermissions([], []));
      expect(result.current).toBe(true);
    });

    it("returns true when user permissions are undefined and none required", () => {
      const { result } = renderHook(() => useHasPermissions(undefined, []));
      expect(result.current).toBe(true);
    });
  });

  describe("with mode 'any' (default)", () => {
    it("returns true when user has one of the required permissions", () => {
      const { result } = renderHook(() =>
        useHasPermissions(
          [Permissions.CreateProblem],
          [Permissions.CreateProblem, Permissions.ReadProblem]
        )
      );
      expect(result.current).toBe(true);
    });

    it("returns true when user has all required permissions", () => {
      const { result } = renderHook(() =>
        useHasPermissions(
          [Permissions.CreateProblem, Permissions.ReadProblem],
          [Permissions.CreateProblem, Permissions.ReadProblem]
        )
      );
      expect(result.current).toBe(true);
    });

    it("returns false when user has none of the required permissions", () => {
      const { result } = renderHook(() =>
        useHasPermissions([], [Permissions.CreateProblem])
      );
      expect(result.current).toBe(false);
    });

    it("returns false when user permissions are undefined", () => {
      const { result } = renderHook(() =>
        useHasPermissions(undefined, [Permissions.CreateProblem])
      );
      expect(result.current).toBe(false);
    });
  });

  describe("with mode 'all'", () => {
    it("returns true when user has all required permissions", () => {
      const { result } = renderHook(() =>
        useHasPermissions(
          [Permissions.CreateProblem, Permissions.ReadProblem],
          [Permissions.CreateProblem, Permissions.ReadProblem],
          "all"
        )
      );
      expect(result.current).toBe(true);
    });

    it("returns false when user is missing one required permission", () => {
      const { result } = renderHook(() =>
        useHasPermissions(
          [Permissions.CreateProblem],
          [Permissions.CreateProblem, Permissions.ReadProblem],
          "all"
        )
      );
      expect(result.current).toBe(false);
    });

    it("returns false when user has none of the required permissions", () => {
      const { result } = renderHook(() =>
        useHasPermissions([], [Permissions.CreateProblem], "all")
      );
      expect(result.current).toBe(false);
    });

    it("returns true when user has extra permissions beyond required", () => {
      const { result } = renderHook(() =>
        useHasPermissions(
          [Permissions.CreateProblem, Permissions.ReadProblem],
          [Permissions.CreateProblem],
          "all"
        )
      );
      expect(result.current).toBe(true);
    });
  });

  describe("memoization", () => {
    it("returns the same value on re-render with same inputs", () => {
      const userPermissions = [Permissions.CreateProblem];
      const required = [Permissions.CreateProblem];

      const { result, rerender } = renderHook(() =>
        useHasPermissions(userPermissions, required, "any")
      );

      const firstResult = result.current;
      rerender();
      expect(result.current).toBe(firstResult);
    });
  });
});
