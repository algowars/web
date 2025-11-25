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

    const languageSelect = screen.getByTestId("language-select");
    const versionSelect = screen.getByTestId("version-select");

    expect(languageSelect).toHaveTextContent("Python");
    expect(versionSelect).toHaveTextContent("3.11");
  });

  // it("lists all available languages", () => {
  //   render(<ProblemCodeEditorLanguageSelect />);

  //   fireEvent.click(screen.getByTestId("language-select"));
  //   expect(
  //     screen.getByTestId("language-option-JavaScript")
  //   ).toBeInTheDocument();
  // });

  // it("calls changeCurrentVersion when selecting a language", () => {
  //   render(<ProblemCodeEditorLanguageSelect />);

  //   fireEvent.click(screen.getByTestId("language-select"));
  //   fireEvent.click(screen.getByTestId("language-option-Python"));

  //   expect(mockProblemStore.changeCurrentVersion).toHaveBeenCalledWith(
  //     mockProblemStore.language.versions[0]
  //   );
  // });

  // it("calls changeCurrentVersion when selecting a version", () => {
  //   render(<ProblemCodeEditorLanguageSelect />);

  //   fireEvent.click(screen.getByTestId("version-select"));
  //   fireEvent.click(screen.getByTestId("version-option-3.11"));

  //   expect(mockProblemStore.changeCurrentVersion).toHaveBeenCalledWith(
  //     mockProblemStore.language.versions[0]
  //   );
  // });

  // it("disables version select if no versions exist", () => {
  //   mockProblemStore.language.versions = [];
  //   render(<ProblemCodeEditorLanguageSelect />);

  //   const versionSelect = screen.getByTestId("version-select");

  //   expect(versionSelect).toBeDisabled();
  // });
});
