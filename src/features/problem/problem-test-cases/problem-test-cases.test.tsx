import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemTestCases from "./problem-test-cases";
import { useProblemEditorStore } from "../problem-editor-store";
import { TestSuite } from "@/features/test-suite/models/test-suite";

vi.mock("../problem-editor-store");

const mockTestSuites: TestSuite[] = [
  {
    testCases: [
      { input: "[1, 2, 3]", expectedOutput: "6" },
      { input: "[4, 5, 6]", expectedOutput: "15" },
    ],
  },
];

const mockMultipleSuites: TestSuite[] = [
  {
    testCases: [{ input: "hello", expectedOutput: "olleh" }],
  },
  {
    testCases: [
      { input: "world", expectedOutput: "dlrow" },
      { input: "test", expectedOutput: "tset" },
    ],
  },
];

describe("ProblemTestCases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'No test cases available' when there are no test cases", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => [] })
    );

    render(<ProblemTestCases />);

    expect(screen.getByText("No test cases available")).toBeInTheDocument();
  });

  it("renders 'No test cases available' when test suites have empty test cases", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => [{ testCases: [] }] })
    );

    render(<ProblemTestCases />);

    expect(screen.getByText("No test cases available")).toBeInTheDocument();
  });

  it("renders test case tabs when test cases exist", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => mockTestSuites })
    );

    render(<ProblemTestCases />);

    expect(screen.getByText("Test Case 1")).toBeInTheDocument();
    expect(screen.getByText("Test Case 2")).toBeInTheDocument();
  });

  it("displays input and expected output labels", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => mockTestSuites })
    );

    render(<ProblemTestCases />);

    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Expected Output")).toBeInTheDocument();
  });

  it("displays the first test case input value by default", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => mockTestSuites })
    );

    render(<ProblemTestCases />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("[1, 2, 3]");
    expect(inputs[1]).toHaveValue("6");
  });

  it("renders test cases from multiple test suites", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => mockMultipleSuites })
    );

    render(<ProblemTestCases />);

    expect(screen.getByText("Test Case 1")).toBeInTheDocument();
    expect(screen.getByText("Test Case 2")).toBeInTheDocument();
    expect(screen.getByText("Test Case 3")).toBeInTheDocument();
  });

  it("renders expected output input as disabled", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => mockTestSuites })
    );

    render(<ProblemTestCases />);

    const inputs = screen.getAllByRole("textbox");
    // Second input is expected output and should be disabled
    expect(inputs[1]).toBeDisabled();
  });

  it("renders input field as enabled", () => {
    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => mockTestSuites })
    );

    render(<ProblemTestCases />);

    const inputs = screen.getAllByRole("textbox");
    // First input is the input field and should be enabled
    expect(inputs[0]).not.toBeDisabled();
  });

  it("renders single test case correctly", () => {
    const singleTestSuite: TestSuite[] = [
      {
        testCases: [{ input: "single", expectedOutput: "result" }],
      },
    ];

    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: { getTestSuites: () => TestSuite[] }) => unknown) =>
        selector({ getTestSuites: () => singleTestSuite })
    );

    render(<ProblemTestCases />);

    expect(screen.getByText("Test Case 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Case 2")).not.toBeInTheDocument();
  });
});
