function signUpViaAuth0Ui(email: string, password: string) {
  cy.origin(
    Cypress.expose("auth0_domain"),
    { args: { email, password } },
    ({ email, password }) => {
      cy.get("input#email").type(email);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
    }
  );

  cy.url().should("contain", "http://localhost:3000");
}

function loginViaAuth0Ui(username: string, password: string) {
  cy.origin(
    Cypress.expose("auth0_domain"),
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("input#username").type(username);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
    }
  );

  cy.url().should("contain", "http://localhost:3000");
}

Cypress.Commands.add(
  "loginViaAuth0Ui",
  (username: string, password: string) => {
    const log = Cypress.log({
      displayName: "AUTH0 LOGIN",
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    });
    log.snapshot("before");

    loginViaAuth0Ui(username, password);

    log.snapshot("after");
    log.end();
  }
);

Cypress.Commands.add("signupViaAuth0Ui", (email: string, password: string) => {
  const log = Cypress.log({
    displayName: "AUTH0 SIGNUP",
    message: [`📝 Signing up | ${email}`],
    autoEnd: false,
  });
  log.snapshot("before");

  signUpViaAuth0Ui(email, password);

  log.snapshot("after");
  log.end();
});
