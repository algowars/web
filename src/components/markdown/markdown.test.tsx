import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MarkdownSafe from "./markdown";

describe("MarkdownSafe", () => {
  it("renders paragraph content", () => {
    render(<MarkdownSafe markdown="Hello world" />);

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders heading h1", () => {
    render(<MarkdownSafe markdown="# Heading 1" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Heading 1" })
    ).toBeInTheDocument();
  });

  it("renders heading h2", () => {
    render(<MarkdownSafe markdown="## Heading 2" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Heading 2" })
    ).toBeInTheDocument();
  });

  it("renders heading h3", () => {
    render(<MarkdownSafe markdown="### Heading 3" />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Heading 3" })
    ).toBeInTheDocument();
  });

  it("renders links", () => {
    render(<MarkdownSafe markdown="[Link](https://example.com)" />);

    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("opens external links in new tab", () => {
    render(<MarkdownSafe markdown="[External](https://example.com)" />);

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders unordered lists", () => {
    render(
      <MarkdownSafe
        markdown={`- Item 1
- Item 2`}
      />
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders ordered lists", () => {
    render(
      <MarkdownSafe
        markdown={`1. First
2. Second`}
      />
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders blockquotes", () => {
    render(<MarkdownSafe markdown="> Quote text" />);

    expect(screen.getByRole("blockquote")).toBeInTheDocument();
  });

  it("renders inline code", () => {
    render(<MarkdownSafe markdown="Use `code` here" />);

    expect(screen.getByText("code")).toBeInTheDocument();
  });

  it("renders code blocks", () => {
    render(
      <MarkdownSafe
        markdown={`\`\`\`
code block
\`\`\``}
      />
    );

    expect(screen.getByText("code block")).toBeInTheDocument();
  });

  it("renders tables", () => {
    const markdown = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;
    render(<MarkdownSafe markdown={markdown} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Cell 1")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MarkdownSafe markdown="Test" className="custom-class" />
    );

    expect(container.querySelector("article")).toHaveClass("custom-class");
  });

  it("uses default className", () => {
    const { container } = render(<MarkdownSafe markdown="Test" />);

    expect(container.querySelector("article")).toHaveClass("text-foreground");
  });

  it("handles null markdown", () => {
    const { container } = render(<MarkdownSafe markdown={null} />);

    expect(container.querySelector("article")).toBeInTheDocument();
  });

  it("handles undefined markdown", () => {
    const { container } = render(<MarkdownSafe markdown={undefined} />);

    expect(container.querySelector("article")).toBeInTheDocument();
  });

  it("accepts custom components", () => {
    const customComponents = {
      p: ({ ...props }) => <p data-testid="custom-p" {...props} />,
    };

    render(
      <MarkdownSafe markdown="Test content" components={customComponents} />
    );

    expect(screen.getByTestId("custom-p")).toBeInTheDocument();
  });
});
