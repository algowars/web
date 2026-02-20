import { describe, it, expect } from "vitest";
import type { PageResult } from "./page-result";

describe("PageResult", () => {
  it("can be typed with a generic", () => {
    const result: PageResult<string> = {
      results: ["a", "b", "c"],
      page: 1,
      size: 3,
      totalPages: 1,
      hasMore: false,
      total: 3,
    };

    expect(result.results).toEqual(["a", "b", "c"]);
  });

  it("can hold object types", () => {
    interface User {
      id: number;
      name: string;
    }

    const result: PageResult<User> = {
      results: [{ id: 1, name: "John" }],
      page: 1,
      size: 1,
      totalPages: 1,
      hasMore: false,
      total: 1,
    };

    expect(result.results[0].name).toBe("John");
  });

  it("supports hasMore for pagination", () => {
    const result: PageResult<number> = {
      results: [1, 2, 3],
      page: 1,
      size: 3,
      totalPages: 5,
      hasMore: true,
      total: 15,
    };

    expect(result.hasMore).toBe(true);
    expect(result.totalPages).toBe(5);
  });

  it("supports empty results", () => {
    const result: PageResult<unknown> = {
      results: [],
      page: 1,
      size: 0,
      totalPages: 0,
      hasMore: false,
      total: 0,
    };

    expect(result.results).toHaveLength(0);
  });
});
