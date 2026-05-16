import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "./not-found";

describe("SettingsProfile NotFound", () => {
  it("renders the not found message", () => {
    render(<NotFound />);
    expect(screen.getByText("Profile Settings Not Found")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(<NotFound />);
    expect(container.firstChild).not.toBeNull();
  });
});
