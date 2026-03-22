describe("Accounts", () => {
  beforeEach(function () {
    cy.intercept("GET", "/api/v1/account/find/profile").as("getProfile");
    cy.intercept("POST", "/api/v1/account").as("createAccount");

    cy.visit("/");
  });

  it("Creating an account", () => {
    cy.get("[data-cy=signup-btn]").click();

    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        cy.signupViaAuth0Ui(email, password);
      });
    });

    cy.wait("@getProfile").its("response.statusCode").should("eq", 404);
    cy.url().should("include", "/account/setup");

    cy.generateRandomUsername().then((username) => {
      cy.get("[data-cy=username-input]").type(username);
      cy.get("[data-cy=complete-setup-btn]").click();
    });

    cy.wait("@createAccount").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/");
  });

  it("Existing user can login and access account setup if they haven't completed it", () => {
    cy.get("[data-cy=signup-btn]").click();

    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        cy.signupViaAuth0Ui(email, password);

        cy.wait("@getProfile").its("response.statusCode").should("eq", 404);
        cy.url().should("include", "/account/setup");

        cy.get("[data-cy=account-dropdown-trigger]").click();
        cy.get("[data-cy=logout-btn]").click();

        cy.get("[data-cy=login-btn]").click();

        cy.loginViaAuth0Ui(email, password);

        cy.wait("@getProfile").its("response.statusCode").should("eq", 404);
        cy.url().should("include", "/account/setup");
      });
    });

    cy.generateRandomUsername().then((username) => {
      cy.get("[data-cy=username-input]").type(username);
      cy.get("[data-cy=complete-setup-btn]").click();
    });

    cy.wait("@createAccount").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/");
  });

  it("Log in successfully and access home page if their account is already set up", () => {
    cy.get("[data-cy=signup-btn]").click();

    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        cy.signupViaAuth0Ui(email, password);

        cy.wait("@getProfile").its("response.statusCode").should("eq", 404);
        cy.url().should("include", "/account/setup");

        cy.generateRandomUsername().then((username) => {
          cy.get("[data-cy=username-input]").type(username);
          cy.get("[data-cy=complete-setup-btn]").click();
        });

        cy.wait("@createAccount").its("response.statusCode").should("eq", 200);

        cy.get("[data-cy=account-dropdown-trigger]").click();
        cy.get("[data-cy=logout-btn]").click();

        cy.get("[data-cy=login-btn]").click();

        cy.loginViaAuth0Ui(email, password);

        cy.wait("@getProfile").its("response.statusCode").should("eq", 200);
        cy.url().should("include", "/");
      });
    });
  });
});
