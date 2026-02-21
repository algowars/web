import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemEditorCreatedBy from "./problem-editor-created-by";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockCreatedBy = {
  id: "user-1",
  username: "johndoe",
  imageUrl: "https://example.com/avatar.png",
};

const mockCreatedByNoImage = {
  id: "user-2",
  username: "janedoe",
  imageUrl: undefined,
};

describe("ProblemEditorCreatedBy", () => {
  it("renders 'Created by' heading", () => {
    render(<ProblemEditorCreatedBy createdBy={mockCreatedBy} />);

    expect(screen.getByText("Created by")).toBeInTheDocument();
  });

  it("renders username", () => {
    render(<ProblemEditorCreatedBy createdBy={mockCreatedBy} />);

    expect(screen.getByText("johndoe")).toBeInTheDocument();
  });

  it("renders link to user profile", () => {
    render(<ProblemEditorCreatedBy createdBy={mockCreatedBy} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/johndoe");
  });

  it("renders avatar component", () => {
    const { container } = render(
      <ProblemEditorCreatedBy createdBy={mockCreatedBy} />
    );

    const avatar = container.querySelector('[data-slot="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  it("renders avatar fallback with first initial when image has not loaded", () => {
    render(<ProblemEditorCreatedBy createdBy={mockCreatedBy} />);

    expect(screen.getByText("j")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProblemEditorCreatedBy
        createdBy={mockCreatedBy}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("space-y-2", "custom-class");
  });

  it("renders with different username", () => {
    render(<ProblemEditorCreatedBy createdBy={mockCreatedByNoImage} />);

    expect(screen.getByText("janedoe")).toBeInTheDocument();
  });

  it("renders link with encoded username for special characters", () => {
    const createdByWithSpecialChar = {
      id: "user-3",
      username: "john doe",
      imageUrl: undefined,
    };

    render(<ProblemEditorCreatedBy createdBy={createdByWithSpecialChar} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/john%20doe");
  });

  it("renders h3 heading element", () => {
    render(<ProblemEditorCreatedBy createdBy={mockCreatedBy} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Created by");
  });
});
