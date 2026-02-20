import { describe, it, expect } from "vitest";
import {
  loadLanguageExtensions,
  defaultCodeEditorExtensions,
} from "./code-editor-extensions";

describe("code-editor-extensions", () => {
  describe("defaultCodeEditorExtensions", () => {
    it("contains default extensions array", () => {
      expect(Array.isArray(defaultCodeEditorExtensions)).toBe(true);
      expect(defaultCodeEditorExtensions.length).toBeGreaterThan(0);
    });
  });

  describe("loadLanguageExtensions", () => {
    it("returns empty array for undefined language", async () => {
      const result = await loadLanguageExtensions(undefined);
      expect(result).toEqual([]);
    });

    it("returns empty array for empty string", async () => {
      const result = await loadLanguageExtensions("");
      expect(result).toEqual([]);
    });

    it("returns empty array for unknown language", async () => {
      const result = await loadLanguageExtensions("unknownlanguage");
      expect(result).toEqual([]);
    });

    it("loads JavaScript extensions", async () => {
      const result = await loadLanguageExtensions("javascript");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("loads JS alias extensions", async () => {
      const result = await loadLanguageExtensions("js");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("loads TypeScript extensions", async () => {
      const result = await loadLanguageExtensions("typescript");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("loads TS alias extensions", async () => {
      const result = await loadLanguageExtensions("ts");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("loads Python extensions", async () => {
      const result = await loadLanguageExtensions("python");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("loads py alias extensions", async () => {
      const result = await loadLanguageExtensions("py");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("is case-insensitive", async () => {
      const result = await loadLanguageExtensions("JAVASCRIPT");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("trims whitespace", async () => {
      const result = await loadLanguageExtensions("  python  ");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
