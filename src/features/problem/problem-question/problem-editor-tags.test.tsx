import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemEditorTags from "./problem-editor-tags";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("ProblemEditorTags", () => {
  it("returns null when tags is empty array", () => {
    const { container } = render(<ProblemEditorTags tags={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when tags is undefined", () => {
    const { container } = render(
      <ProblemEditorTags tags={undefined as unknown as string[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders tags as badges", () => {
    render(<ProblemEditorTags tags={["array", "hash-table"]} />);

    expect(screen.getByText("array")).toBeInTheDocument();
    expect(screen.getByText("hash-table")).toBeInTheDocument();
  });

  it("renders tags as links with correct href", () => {
    render(<ProblemEditorTags tags={["Array"]} />);

    const link = screen.getByRole("link", { name: "Array" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tags?q=array");
  });

  it("converts tags to lowercase in href", () => {
    render(<ProblemEditorTags tags={["HashTable"]} />);

    const link = screen.getByRole("link", { name: "HashTable" });
    expect(link).toHaveAttribute("href", "/tags?q=hashtable");
  });

  it("renders multiple tags with correct links", () => {
    render(<ProblemEditorTags tags={["Array", "String", "Math"]} />);

    expect(screen.getByRole("link", { name: "Array" })).toHaveAttribute(
      "href",
      "/tags?q=array"
    );
    expect(screen.getByRole("link", { name: "String" })).toHaveAttribute(
      "href",
      "/tags?q=string"
    );
    expect(screen.getByRole("link", { name: "Math" })).toHaveAttribute(
      "href",
      "/tags?q=math"
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProblemEditorTags tags={["array"]} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("px-4", "custom-class");
  });

  it("renders single tag", () => {
    render(<ProblemEditorTags tags={["recursion"]} />);

    expect(screen.getByText("recursion")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders tags with Badge component (data-slot attribute)", () => {
    render(<ProblemEditorTags tags={["array"]} />);

    const badge = screen.getByText("array");
    expect(badge).toHaveAttribute("data-slot", "badge");
  });
});
