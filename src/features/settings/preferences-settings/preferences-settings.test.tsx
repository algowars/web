import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PreferencesSettings from "./preferences-settings";

describe("PreferencesSettings", () => {
  it("renders the card with preferences settings title", () => {
    render(<PreferencesSettings />);
    expect(screen.getByText("Preferences Settings")).toBeInTheDocument();
  });

  it("renders the card content", () => {
    render(<PreferencesSettings />);
    expect(screen.getByText("TEsting")).toBeInTheDocument();
  });
});
