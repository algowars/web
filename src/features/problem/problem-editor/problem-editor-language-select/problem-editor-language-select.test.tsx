import { render, screen, fireEvent } from "@testing-library/react";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select";
import { vi } from "vitest";
import { mockProblemStore } from "@tests/mocks/mock-problem-editor-store";

vi.mock("../../problem-editor-store", () => ({
  useProblemEditor: () => mockProblemStore,
}));

describe("ProblemCodeEditorLanguageSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders language and version selects with correct default values", () => {
    render(<ProblemCodeEditorLanguageSelect />);

    const languageSelect = screen.getByText("Python");
    const versionSelect = screen.getByText("3.11");

    expect(languageSelect).toBeInTheDocument();
    expect(versionSelect).toBeInTheDocument();
  });

  it("lists all available languages", () => {
    render(<ProblemCodeEditorLanguageSelect />);

    fireEvent.click(screen.getByText("Python"));
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("calls changeCurrentVersion when selecting a language", () => {
    render(<ProblemCodeEditorLanguageSelect />);

    fireEvent.click(screen.getByText("Python"));
    fireEvent.click(screen.getByText("Python"));

    expect(mockProblemStore.changeCurrentVersion).toHaveBeenCalledWith(
      mockProblemStore.language.versions[0]
    );
  });

  it("calls changeCurrentVersion when selecting a version", () => {
    render(<ProblemCodeEditorLanguageSelect />);

    fireEvent.click(screen.getByText("3.11"));
    fireEvent.click(screen.getByText("3.11"));

    expect(mockProblemStore.changeCurrentVersion).toHaveBeenCalledWith(
      mockProblemStore.language.versions[0]
    );
  });

  it("disables version select if no versions exist", () => {
    mockProblemStore.language.versions = [];
    render(<ProblemCodeEditorLanguageSelect />);
    const versionSelect = screen.getByRole("combobox", {
      name: /Select a version/i,
    });

    expect(versionSelect).toBeDisabled();
  });
});
