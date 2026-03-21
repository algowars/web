import { faker } from "@faker-js/faker";


Cypress.Commands.add('generateRandomEmail', () => {
    return cy.wrap(faker.internet.email());
});

Cypress.Commands.add('generateRandomUsername', () => {
  let username = faker.internet.username().replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 16);

  if (!username) username = 'user_' + faker.number.int({ min: 1, max: 9999 });
  return cy.wrap(username);
})

Cypress.Commands.add('generateRandomPassword', () =>{
  const lower = faker.string.alpha({ length: 1, casing: 'lower' });
  const upper = faker.string.alpha({ length: 1, casing: 'upper' });
  const number = faker.number.int({ min: 0, max: 9 }).toString();
  const special = faker.helpers.arrayElement(['!', '@', '#', '$', '%', '^', '&', '*']);
  const rest = faker.string.alphanumeric({ length: 8 });

  const password = faker.helpers.shuffle([lower, upper, number, special, ...rest.split('')]).join('');
  return cy.wrap(password);
});