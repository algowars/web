import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AccountSettingsLoading from "./account-settings-loading";

describe("AccountSettingsLoading", () => {
  it("renders the Account Settings title", () => {
    render(<AccountSettingsLoading />);
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(<AccountSettingsLoading />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders skeleton placeholder elements", () => {
    const { container } = render(<AccountSettingsLoading />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
