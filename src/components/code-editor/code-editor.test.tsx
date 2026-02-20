import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { CodeEditor } from "./code-editor";
import { useProblemEditorStore } from "@/features/problem/problem-editor-store";

vi.mock("@/features/problem/problem-editor-store");

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}));

vi.mock("@uiw/react-codemirror", () => ({
  default: ({
    value,
    className,
    onChange,
  }: {
    value: string;
    className?: string;
    onChange?: (val: string) => void;
  }) => (
    <div data-testid="codemirror" className={className}>
      <textarea
        data-testid="codemirror-textarea"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  ),
  Extension: {},
}));

vi.mock("./code-editor-extensions", () => ({
  defaultCodeEditorExtensions: [],
  loadLanguageExtensions: vi.fn().mockResolvedValue([]),
}));

vi.mock("@uiw/codemirror-theme-tokyo-night-storm", () => ({
  tokyoNightStorm: {},
}));

vi.mock("@uiw/codemirror-theme-tokyo-night-day", () => ({
  tokyoNightDay: {},
}));

describe("CodeEditor", () => {
  const mockChangeCode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useProblemEditorStore as unknown as Mock).mockImplementation((selector) =>
      selector({
        changeCode: mockChangeCode,
        code: "const x = 1;",
        getLanguage: () => "javascript",
      })
    );
  });

  it("renders CodeMirror component", () => {
    render(<CodeEditor />);

    expect(screen.getByTestId("codemirror")).toBeInTheDocument();
  });

  it("applies className prop", () => {
    render(<CodeEditor className="test-class" />);

    expect(screen.getByTestId("codemirror")).toHaveClass("test-class");
  });

  it("displays the current code value", () => {
    render(<CodeEditor />);

    expect(screen.getByTestId("codemirror-textarea")).toHaveValue("const x = 1;");
  });

  it("handles undefined language", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation((selector) =>
      selector({
        changeCode: mockChangeCode,
        code: "",
        getLanguage: () => undefined,
      })
    );

    render(<CodeEditor />);

    expect(screen.getByTestId("codemirror")).toBeInTheDocument();
  });

  it("handles empty code", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation((selector) =>
      selector({
        changeCode: mockChangeCode,
        code: "",
        getLanguage: () => "javascript",
      })
    );

    render(<CodeEditor />);

    expect(screen.getByTestId("codemirror-textarea")).toHaveValue("");
  });
});
