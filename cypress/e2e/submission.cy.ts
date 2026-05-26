describe("Submissions", () => {
  const CORRECT_SOLUTION =
    'function solution(n) { return n % 2 === 0 ? "hello" : "goodbye"; }';
  const INCORRECT_SOLUTION = 'function solution(n) { return "wrong"; }';

  const loginTestUser = () => {
    cy.get("[data-cy=login-btn]").click();
    cy.loginViaAuth0Ui(
      Cypress.expose("test_user_email"),
      Cypress.expose("test_user_password")
    );
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  };

  const typeCodeInEditor = (code: string) => {
    cy.get("[data-cy=code-editor] .cm-content")
      .click({ force: true })
      .type("{ctrl+a}", { force: true })
      .type(code, { delay: 30, force: true, parseSpecialCharSequences: false });
  };

  const waitForSubmissionResult = () => {
    cy.get("[data-cy=submission-result-view]", { timeout: 30000 }).should(
      "exist"
    );
  };

  beforeEach(() => {
    cy.visit("/");
  });

  it("submits a correct solution and receives Accepted", () => {
    loginTestUser();
    cy.visit("/problems/hello-or-goodbye");
    typeCodeInEditor(CORRECT_SOLUTION);
    cy.get("[data-cy=submit-btn]").click();
    waitForSubmissionResult();
    cy.get("[data-cy=submission-overall-status]").should(
      "contain.text",
      "Accepted"
    );
  });

  it("submits an incorrect solution and receives Wrong Answer", () => {
    loginTestUser();
    cy.visit("/problems/hello-or-goodbye");
    typeCodeInEditor(INCORRECT_SOLUTION);
    cy.get("[data-cy=submit-btn]").click();
    waitForSubmissionResult();
    cy.get("[data-cy=submission-overall-status]").should(
      "contain.text",
      "Wrong Answer"
    );
  });

  it("views all submissions after clicking the View Submissions button", () => {
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Problem required")) return false;
    });
    cy.intercept("GET", "/api/v1/problem/*/solutions*").as("getSolutions");
    loginTestUser();
    cy.visit("/problems/hello-or-goodbye");
    typeCodeInEditor(CORRECT_SOLUTION);
    cy.get("[data-cy=submit-btn]").click();
    waitForSubmissionResult();
    cy.get("[data-cy=view-submissions-btn]").click();
    cy.url().should("include", "/submissions");
    cy.wait("@getSolutions");
    cy.get("[data-cy=submissions-card]").should("exist");
    cy.get("[data-cy=submission-card]").should("have.length.at.least", 1);
  });
});
