import React from "react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  CreateProblemProvider,
  useCreateProblemContext,
} from "./create-problem-context";

vi.mock("@auth0/nextjs-auth0", () => {
  return {
    getAccessToken: vi.fn(() => Promise.resolve("mock-token-123")),
  };
});

function ConsumerView() {
  const { createProblem, updateCreateProblem, setCreateProblem } =
    useCreateProblemContext();

  return (
    <div>
      <div data-testid="title">{createProblem.title}</div>
      <div data-testid="question">{createProblem.question}</div>
      <div data-testid="tags-count">{createProblem.tags.length}</div>
      <div data-testid="slug">{createProblem.slug}</div>

      <button
        data-testid="btn-update-title"
        onClick={() => updateCreateProblem({ title: "Updated Title" })}
      >
        update title
      </button>

      <button
        data-testid="btn-set"
        onClick={() =>
          setCreateProblem({
            title: "Set Title",
            question: "Set Question",
            tags: ["a"],
            slug: "set-slug",
          })
        }
      >
        set state
      </button>
    </div>
  );
}

function renderWithProvider(children: ReactNode) {
  return render(<CreateProblemProvider>{children}</CreateProblemProvider>);
}

describe("CreateProblemContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when used outside provider", () => {
    function Outside() {
      useCreateProblemContext();
      return null;
    }
    const renderOutside = () => render(<Outside />);
    expect(renderOutside).toThrow();
  });

  it("provides default state", () => {
    renderWithProvider(<ConsumerView />);

    expect(screen.getByTestId("title").textContent).toBe("");
    expect(screen.getByTestId("question").textContent).toBe("");
    expect(screen.getByTestId("tags-count").textContent).toBe("0");
    expect(screen.getByTestId("slug").textContent).toBe("");
  });

  it("updateCreateProblem merges fields", async () => {
    renderWithProvider(<ConsumerView />);

    fireEvent.click(screen.getByTestId("btn-update-title"));

    expect(screen.getByTestId("title").textContent).toBe("Updated Title");
    expect(screen.getByTestId("question").textContent).toBe("");
  });

  it("setCreateProblem replaces whole state", () => {
    renderWithProvider(<ConsumerView />);

    fireEvent.click(screen.getByTestId("btn-set"));

    expect(screen.getByTestId("title").textContent).toBe("Set Title");
    expect(screen.getByTestId("question").textContent).toBe("Set Question");
    expect(screen.getByTestId("tags-count").textContent).toBe("1");
    expect(screen.getByTestId("slug").textContent).toBe("set-slug");
  });

  it("calls getAccessToken on mount", async () => {
    const { getAccessToken } = await import("@auth0/nextjs-auth0");
    renderWithProvider(<ConsumerView />);

    await waitFor(() => {
      expect(getAccessToken).toHaveBeenCalled();
    });
  });
});
