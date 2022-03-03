/// <reference types="cypress" />
const email = Cypress.env('email')
const password = Cypress.env('password')
const url = Cypress.env('url')
describe('Check every case to login the page', () => {
  let userdetails
  before(function () {
    cy.fixture('userlogin').then(function (data) {
      userdetails = data
    })
  })
  before(() => {
    cy.log('Visit the page before each test')
    cy.visit(url + '/login')
    cy.url().should('contain', '/login')
    cy.clearLocalStorage()
    cy.get('h2').should('contain', 'Hi, Welcome Back')
    cy.get('input[type="checkbox"]').should('be.checked').and('not.be.visible')
    cy.get('input[type="email"]').type(email, { log: false })
    cy.get('input[type="password"]').type(password, { log: false })
    cy.get('button[type="submit"]').click()
    cy.wait(12000)
    cy.url().should('contain', '/')
  })

  it('Check if all fieds are validated when adding a user', () => {
    cy.get('.scrollbar-container > .MuiList-root > :nth-child(4)').click()
    cy.get('[href="/users"]').click()
    cy.url().should('contain', '/users')
    cy.get(
      '.MuiTypography-root > .MuiGrid-container > :nth-child(2) > .MuiButtonBase-root'
    ).click()
    cy.log('Register a new user')
    cy.wait(10000)
    cy.get('button[type="submit"]').click({ force: true })
    cy.somethingIsRequired('#name-helper-text', userdetails.requiredName)
    cy.somethingIsRequired('#email-helper-text', userdetails.requiredEmail)
    cy.somethingIsRequired(
      '#standard-weight-helper-text-roles-user',
      userdetails.roleIsRequired
    )
    cy.somethingIsRequired(
      '#password-helper-text',
      userdetails.requiredPassword
    )
    cy.somethingIsRequired(
      '#confirmPassword-helper-text',
      userdetails.confirmPasswordRequired
    )
    cy.log('Check if the email is valide')
    cy.get('#email').clear().type(userdetails.wrongEmail)
    cy.somethingIsRequired('#email-helper-text', userdetails.isEmailValide)
    cy.typeLabels('#email', userdetails.addUser)
  })

  it('Register a user', () => {
    cy.url().should('contain', '/users/create')
    cy.log('Register a user')
    cy.typeLabels('#name', userdetails.test)
    cy.typeLabels('#email', userdetails.addUser)
    cy.typeLabels('#password', userdetails.password)
    cy.typeLabels('#confirmPassword', userdetails.password)
    cy.get('#outlined-adornment-roles-user').click()
    cy.get('.MuiMenuItem-root').eq(0).click()
    cy.get('button[type="submit"]').click({ force: true })
    cy.wait(8000)
    cy.checkAlert(userdetails.alertUserCreated)
    cy.url().should('contain', '/users')
  })

  it('edit only the username', () => {
    cy.wait(2000)
    cy.editUser(userdetails.test)
    cy.wait(6000)
    cy.typeLabels('#name', userdetails.test1)
    cy.get('button[type="submit"]').click()
    cy.checkAlert(userdetails.alertUserUpdated)
    cy.url().should('contain', '/users')
  })

  it('Edit the username and the password', () => {
    cy.url().should('contain', '/users')
    cy.wait(6000)
    cy.typeLabels('#name', userdetails.test1)
    cy.typeLabels('#password', userdetails.password)
    cy.typeLabels('#confirmPassword', userdetails.password)
    cy.get('button[type="submit"]').click()
    cy.wait(6000)
    cy.checkAlert(userdetails.alertUserUpdated)
    cy.url().should('contain', '/users')
  })

  it('Check if you can search user', () => {
    cy.url().should('contain', '/users')
    cy.get('[placeholder="Search"]').type(userdetails.test1)
    cy.get('tr td:nth-child(2)').should('have.text', userdetails.test1)
    cy.get('[placeholder="Search"]').clear()
  })

  it('Delete the user', () => {
    cy.url().should('contain', '/users')
    cy.deleteUser(userdetails.test1)
    cy.get('.MuiLoadingButton-root').click()
    cy.checkAlert(userdetails.alertUserDeleted)
    cy.url().should('contain', '/users')
  })
})
