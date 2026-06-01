describe("Accounts", () => {
  const signUpThroughAuth0 = (email: string, password: string) => {
    cy.get("[data-testid=sign-up-button]").click();
    cy.signupViaAuth0Ui(email, password);
  };

  const loginThroughAuth0 = (email: string, password: string) => {
    cy.get("[data-testid=sign-in-button]").click();
    cy.loginViaAuth0Ui(email, password);
  };

  beforeEach(() => {
    cy.intercept("PUT", "/api/v1/account/username").as("updateUsername");

    cy.visit("/");
  });

  it("should sign up the user", () => {
    cy.generateRandomEmail().then((email) => {
      cy.generateRandomPassword().then((password) => {
        signUpThroughAuth0(email, password);
      });
    });
  });

  it("should login the user", () => {
    const email = Cypress.expose("test_user_email");
    const password = Cypress.expose("test_user_password");
    loginThroughAuth0(email, password);
  });
});
