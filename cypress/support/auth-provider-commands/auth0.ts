function loginViaAuth0Ui(username: string, password: string) {
  cy.visit('/')

  cy.origin(
    Cypress.expose('auth0_domain'),
    { args: { username, password } },
    ({ username, password }) => {
      cy.get('input#username').type(username)
      cy.get('input#password').type(password, { log: false })
      cy.contains('button[value=default]', 'Continue').click()
    }
  )

  cy.url().should('equal', 'http://localhost:3000/')
}

Cypress.Commands.add('loginToAuth0', (username: string, password: string) => {
  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  })
  log.snapshot('before')

  loginViaAuth0Ui(username, password)

  log.snapshot('after')
  log.end()
})