describe('Accounts', () => {
  beforeEach(function () {
    cy.task('db:seed');

    cy.intercept('GET', '/api/v1/account/find/profile').as('getProfile');
    cy.intercept('POST', '/api/v1/account/create').as('createAccount');

    cy.visit('/');
  });

  it('should create an account successfully', () => {
    cy.visit('/');

    cy.get('[data-cy=signup-btn]').click();
    cy.generateRandomEmail().then((email) => {
    cy.generateRandomPassword().then((password) => {
        cy.origin(
          Cypress.expose('auth0_domain'),
          { args: { email, password } },
          ({ email, password }) => {
            cy.get('input#email').type(email);
            cy.get('input#password').type(password, { log: false });
            cy.contains('button[value=default]', 'Continue').click();
          }
        );
      });
    });

    cy.url().should('include', '/account/setup');
    cy.wait('@getProfile').its('response.statusCode').should('eq', 404);

    cy.generateRandomUsername().then((username) => {
      cy.get('[data-cy=username-input]').type(username);
      cy.get('[data-cy=complete-setup-btn]').click();
    });

    cy.wait('@createAccount').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/');
  });

  it("should allow an existing user to log in and access account setup if their account isn't fully set up", () => {
  
  });

  it("should allow user to log in successfully and access home page if their account is already set up", () => {
    
  });

  it("should allow a user to log out successfully", () => {});
})