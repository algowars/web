import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProfileSettings from "./profile-settings";

describe("ProfileSettings", () => {
  it("renders the card with profile settings title", () => {
    render(<ProfileSettings />);
    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
  });

  it("renders the card content", () => {
    render(<ProfileSettings />);
    expect(screen.getByText("TEsting")).toBeInTheDocument();
  });
});
