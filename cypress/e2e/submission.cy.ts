/**
 * E2E tests for the problem submission flow.
 *
 * Prerequisites:
 *   - Next.js dev server running (`NEXT_PUBLIC_TEST_MODE=true` to bypass Auth0 middleware)
 *   - A backend or SSR mock is required for the initial `/problems/:slug` page load because
 *     Next.js prefetches `GET /api/v1/problem/slug/:slug` server-side before hydration.
 *     `cy.intercept` handles all client-side (browser-originated) API calls.
 *
 * data-cy attributes added by Dallas in parallel:
 *   submit-btn                 — the Submit button in ProblemActions
 *   submission-result-dialog   — the dialog content wrapper
 *   submission-loading-indicator — the spinner shown while Processing
 *   submission-result-view     — the result view shown when complete
 *   submission-overall-status  — the overall status badge
 *   test-case-tab-{n}          — TabsTrigger for test case n
 *   test-case-panel-{n}        — TabsContent for test case n
 */

describe("Problem Submission Flow", () => {
  const slug = "test-problem";
  const submissionId = "12345678-1234-1234-1234-123456789012";

  beforeEach(() => {
    // Cover client-side re-fetches of the problem (SSR hydration data may already be present)
    cy.intercept("GET", "**/api/v1/problem/slug/test-problem", {
      fixture: "problem.json",
    }).as("getProblem");

    // Problem setup is always fetched client-side by ProblemLayout
    cy.intercept("GET", "**/api/v1/problem/*/setup*", {
      fixture: "problem-setup.json",
    }).as("getProblemSetup");

    cy.visit(`/problems/${slug}`);

    // Wait for the setup fetch so initialCode is in the editor and Submit is enabled
    cy.wait("@getProblemSetup");
  });

  it("shows loading dialog immediately after clicking Submit", () => {
    cy.intercept("POST", "**/api/v1/submission/execute", {
      body: submissionId,
    }).as("createSubmission");

    // Keep polling in Processing state for the duration of this test
    cy.intercept("GET", `**/api/v1/submission/${submissionId}`, {
      fixture: "submission-processing.json",
    }).as("getSubmission");

    cy.get('[data-cy="submit-btn"]').click();
    cy.wait("@createSubmission");

    cy.get('[data-cy="submission-result-dialog"]').should("be.visible");
    cy.get('[data-cy="submission-loading-indicator"]').should("be.visible");
  });

  it("shows accepted result with test cases after processing completes", () => {
    cy.intercept("POST", "**/api/v1/submission/execute", {
      body: submissionId,
    }).as("createSubmission");

    // First poll → Processing (times: 1 expires this intercept after one use)
    cy.intercept(
      { method: "GET", url: `**/api/v1/submission/${submissionId}`, times: 1 },
      { fixture: "submission-processing.json" }
    ).as("getSubmissionProcessing");

    // Subsequent polls → Accepted (lower-priority fallback after the above expires)
    cy.intercept("GET", `**/api/v1/submission/${submissionId}`, {
      fixture: "submission-accepted.json",
    }).as("getSubmissionAccepted");

    cy.get('[data-cy="submit-btn"]').click();
    cy.wait("@createSubmission");

    // Loading indicator visible while first poll is Processing
    cy.get('[data-cy="submission-loading-indicator"]').should("be.visible");
    cy.wait("@getSubmissionProcessing");

    // After next 2-second poll returns Accepted, result view appears
    cy.get('[data-cy="submission-result-view"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-cy="submission-overall-status"]').should("exist");

    // Both test case tabs rendered
    cy.get('[data-cy="test-case-tab-0"]').should("be.visible");
    cy.get('[data-cy="test-case-tab-1"]').should("be.visible");

    // First test case panel content
    cy.get('[data-cy="test-case-panel-0"]').within(() => {
      cy.contains("Input").should("exist");
      cy.contains("5").should("exist");
      cy.contains("Expected Output").should("exist");
      cy.contains("Hello").should("exist");
      cy.contains("Actual Output").should("exist");
    });

    // Switch to second tab and verify content
    cy.get('[data-cy="test-case-tab-1"]').click();
    cy.get('[data-cy="test-case-panel-1"]').within(() => {
      cy.contains("0").should("exist");
      cy.contains("Goodbye").should("exist");
    });
  });

  it("shows wrong answer result with at least one failed test case", () => {
    cy.intercept("POST", "**/api/v1/submission/execute", {
      body: submissionId,
    }).as("createSubmission");

    cy.intercept(
      { method: "GET", url: `**/api/v1/submission/${submissionId}`, times: 1 },
      { fixture: "submission-processing.json" }
    ).as("getSubmissionProcessing");

    cy.intercept("GET", `**/api/v1/submission/${submissionId}`, {
      fixture: "submission-wrong-answer.json",
    }).as("getSubmissionWrongAnswer");

    cy.get('[data-cy="submit-btn"]').click();
    cy.wait("@createSubmission");
    cy.wait("@getSubmissionProcessing");

    cy.get('[data-cy="submission-result-view"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-cy="submission-overall-status"]').should("exist");

    // First test case shows the wrong actual output
    cy.get('[data-cy="test-case-panel-0"]').within(() => {
      cy.contains("Wrong").should("exist");
    });

    // Second test case passes — verify its content on tab switch
    cy.get('[data-cy="test-case-tab-1"]').click();
    cy.get('[data-cy="test-case-panel-1"]').within(() => {
      cy.contains("Goodbye").should("exist");
    });
  });

  it("closes dialog when the X button is clicked", () => {
    cy.intercept("POST", "**/api/v1/submission/execute", {
      body: submissionId,
    }).as("createSubmission");

    cy.intercept("GET", `**/api/v1/submission/${submissionId}`, {
      fixture: "submission-processing.json",
    }).as("getSubmission");

    cy.get('[data-cy="submit-btn"]').click();
    cy.wait("@createSubmission");

    cy.get('[data-cy="submission-result-dialog"]').should("be.visible");

    // The shadcn DialogContent renders a close button with data-slot="dialog-close"
    cy.get('[data-slot="dialog-close"]').click();

    cy.get('[data-cy="submission-result-dialog"]').should("not.exist");
  });
});
