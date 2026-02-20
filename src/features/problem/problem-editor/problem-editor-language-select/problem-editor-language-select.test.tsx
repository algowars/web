import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select";
import { useProblemEditorStore } from "../../problem-editor-store";
import { Language, LanguageVersion } from "@/features/problems/models/language";

vi.mock("../../problem-editor-store");

const mockLanguages: Language[] = [
  {
    id: 1,
    name: "JavaScript",
    versions: [
      { id: 101, version: "ES2022" },
      { id: 102, version: "ES2021" },
    ],
  },
  {
    id: 2,
    name: "Python",
    versions: [
      { id: 201, version: "3.11" },
      { id: 202, version: "3.10" },
    ],
  },
];

const mockLanguage = mockLanguages[0];
const mockLanguageVersion = mockLanguages[0].versions[0];

type StoreState = {
  changeCurrentVersion: (version: LanguageVersion | null | undefined) => void;
  getLanguage: () => Language | null;
  getLanguageVersion: () => LanguageVersion | null;
  getAvailableLanguages: () => Language[];
  findVersionById: (id: number) => LanguageVersion | null;
};

describe("ProblemCodeEditorLanguageSelect", () => {
  const mockChangeCurrentVersion = vi.fn();
  const mockFindVersionById = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMock = (overrides: Partial<StoreState> = {}) => {
    const defaultState: StoreState = {
      changeCurrentVersion: mockChangeCurrentVersion,
      getLanguage: () => mockLanguage,
      getLanguageVersion: () => mockLanguageVersion,
      getAvailableLanguages: () => mockLanguages,
      findVersionById: mockFindVersionById,
      ...overrides,
    };

    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: StoreState) => unknown) => selector(defaultState)
    );
  };

  it("renders language select trigger", () => {
    setupMock();

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByTestId("language-select")).toBeInTheDocument();
  });

  it("renders version select trigger", () => {
    setupMock();

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByTestId("version-select")).toBeInTheDocument();
  });

  it("displays current language name in trigger", () => {
    setupMock();

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("displays current version in trigger", () => {
    setupMock();

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByText("ES2022")).toBeInTheDocument();
  });

  it("renders with no language selected", () => {
    setupMock({
      getLanguage: () => null,
      getLanguageVersion: () => null,
    });

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByTestId("language-select")).toBeInTheDocument();
    expect(screen.getByTestId("version-select")).toBeInTheDocument();
  });

  it("renders with empty available languages", () => {
    setupMock({
      getLanguage: () => null,
      getLanguageVersion: () => null,
      getAvailableLanguages: () => [],
    });

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByTestId("language-select")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    setupMock();

    render(<ProblemCodeEditorLanguageSelect className="custom-class" />);

    const ul = screen.getByRole("list");
    expect(ul).toHaveClass("custom-class");
  });

  it("renders as ul element with list items", () => {
    setupMock();

    render(<ProblemCodeEditorLanguageSelect />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("version select is disabled when no language versions", () => {
    setupMock({
      getLanguage: () => ({ id: 1, name: "JavaScript", versions: [] }),
    });

    render(<ProblemCodeEditorLanguageSelect />);

    const versionSelect = screen.getByTestId("version-select");
    expect(versionSelect).toBeDisabled();
  });
});
