import { describe, it, expect } from "vitest";
import { createEmptyPageResult } from "./empty-page-result";

describe("createEmptyPageResult", () => {
  it("returns an empty results array", () => {
    const result = createEmptyPageResult();

    expect(result.results).toEqual([]);
  });

  it("returns page 1", () => {
    const result = createEmptyPageResult();

    expect(result.page).toBe(1);
  });

  it("returns size 0", () => {
    const result = createEmptyPageResult();

    expect(result.size).toBe(0);
  });

  it("returns totalPages 0", () => {
    const result = createEmptyPageResult();

    expect(result.totalPages).toBe(0);
  });

  it("returns hasMore false", () => {
    const result = createEmptyPageResult();

    expect(result.hasMore).toBe(false);
  });

  it("returns total 0", () => {
    const result = createEmptyPageResult();

    expect(result.total).toBe(0);
  });

  it("returns correct structure", () => {
    const result = createEmptyPageResult();

    expect(result).toEqual({
      results: [],
      page: 1,
      size: 0,
      totalPages: 0,
      hasMore: false,
      total: 0,
    });
  });
});
