describe('Accounts', () => {
  beforeEach(function () {
    cy.task('db:seed')
    cy.intercept('POST', '/graphql').as('createBankAccount')

    cy.env(['AUTH0_USERNAME', 'AUTH0_PASSWORD']).then(
      ({ username, password }) => {
        cy.loginToAuth0(username, password)
      }
    )
    cy.visit('/')
  });

  it('should create an account successfully', () => {
    cy.visit('/');

    cy.get('[data-cy=signup-btn]').click();

     const randomString = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
     const email = `${randomString()}@example.com`;
     const password = randomString();

      cy.origin('https://aw-dev01.us.auth0.com', () => {
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();
      });
  });
})