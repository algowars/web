import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProfileSettingsLoading from "./profile-settings-loading";

describe("ProfileSettingsLoading", () => {
  it("renders the Profile Settings title", () => {
    render(<ProfileSettingsLoading />);
    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(<ProfileSettingsLoading />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders skeleton placeholder elements", () => {
    const { container } = render(<ProfileSettingsLoading />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
