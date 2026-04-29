describe("Accounts", () => {
  beforeEach(() => {
    cy.intercept("PUT", "/api/v1/account/username").as("updateUsername");

    cy.visit("/");
  });

  it("signs up and completes account setup", () => {
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
  });

  it("logs in and redirects to home when account is already set up", () => {
    cy.get("[data-cy=signup-btn]").click();

    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        cy.signupViaAuth0Ui(email, password);

        cy.url().should("include", "/account/setup");

        cy.generateRandomUsername().then((username) => {
          cy.get("[data-cy=username-input]").type(username);
          cy.get("[data-cy=complete-setup-btn]").click();
        });

        cy.wait("@updateUsername").its("response.statusCode").should("eq", 200);

        cy.get("[data-cy=account-dropdown-trigger]").click();
        cy.get("[data-cy=logout-btn]").click();

        cy.get("[data-cy=login-btn]").click();
        cy.loginViaAuth0Ui(email, password);

        cy.url().should("eq", Cypress.config("baseUrl") + "/");
      });
    });
  });
});
