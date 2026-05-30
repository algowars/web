import { describe, it, expect } from "vitest";
import Home from "./page";
import HomeContext from "@/pages/home/home-context";

vi.mock("./home-context", () => ({
  default: () => <div data-testid="home-context">HomeContext</div>,
}));

describe("Home", () => {
  it("can be initialized", () => {
    expect(Home).toBeDefined();
  });

  it("renders HomeContext component", () => {
    const result = Home();
    expect(result).toEqual(<HomeContext />);
  });
});
