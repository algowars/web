describe("Problem Submission Flow", () => {
  const slug = "hello-or-goodbye";

  beforeEach(() => {
    cy.intercept("PUT", "/api/v1/account/username").as("updateUsername");
    cy.intercept("POST", "/api/v1/submission/execute").as("createSubmission");
    cy.intercept("GET", `/api/v1/submission/**`).as("getSubmission");

    cy.visit("/");
  });

  it("should let a user create a submission", () => {
    cy.get("[data-cy=signup-btn]").click();

    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        cy.signupViaAuth0Ui(email, password);
      });
    });

    cy.url().should("include", "/account/setup");

    cy.generateRandomUsername().then((username) => {
      cy.get("[data-cy=username-input]").type(username);
      cy.get("[data-cy=complete-setup-btn]").click();
    });

    cy.wait("@updateUsername").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", Cypress.config("baseUrl") + "/");

    cy.visit("/problems");
    cy.contains("Hello or Goodbye").click();
    cy.url().should("include", `/problems/${slug}`);

    cy.get(".cm-editor .cm-content")
      .click()
      .type("{ctrl+a}")
      .then(($el) => {
        $el[0].ownerDocument.execCommand(
          "insertText",
          false,
          "function solution(n) {\n  if (n% 2 === 0) return 'hello';\n  return 'goodbye';\n}"
        );
      });

    cy.get("[data-cy=submit-btn]").click();

    cy.wait("@createSubmission").its("response.statusCode").should("eq", 200);

    cy.get("[data-cy=submission-result-tab]").should("exist");
    cy.wait("@getSubmission");
    cy.get("[data-cy=submission-result-view]", { timeout: 15000 }).should(
      "be.visible"
    );
    cy.get("[data-cy=submission-overall-status]").should("contain", "Accepted");

    cy.get("[data-cy=view-submissions-btn]").click();

    cy.url().should("include", `/problems/${slug}/submissions`);
    cy.get("[data-cy=my-submissions-filter]").click();
  });

  it("should let a user fail a submission", () => {
    cy.get("[data-cy=signup-btn]").click();

    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        cy.signupViaAuth0Ui(email, password);
      });
    });

    cy.url().should("include", "/account/setup");

    cy.generateRandomUsername().then((username) => {
      cy.get("[data-cy=username-input]").type(username);
      cy.get("[data-cy=complete-setup-btn]").click();
    });

    cy.wait("@updateUsername").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", Cypress.config("baseUrl") + "/");

    cy.visit("/problems");
    cy.contains("Hello or Goodbye").click();
    cy.url().should("include", `/problems/${slug}`);

    cy.get(".cm-editor .cm-content")
      .click()
      .type("{ctrl+a}")
      .then(($el) => {
        $el[0].ownerDocument.execCommand(
          "insertText",
          false,
          "function solution(n) {\n  return 'Wrong';\n}"
        );
      });

    cy.get("[data-cy=submit-btn]").click();

    cy.wait("@createSubmission").its("response.statusCode").should("eq", 200);

    cy.get("[data-cy=submission-result-tab]").should("exist");
    cy.wait("@getSubmission");
    cy.get("[data-cy=submission-overall-status]", { timeout: 15000 }).should(
      "contain",
      "Wrong Answer"
    );
  });
});
