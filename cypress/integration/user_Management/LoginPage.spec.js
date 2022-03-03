describe('Check every case to login the page', () => {
  const email = Cypress.env('email')
  const password = Cypress.env('password')
  const url = Cypress.env('url')

  let userdetails
  before(function () {
    cy.fixture('userlogin').then(function (data) {
      userdetails = data
    })
  })
  before(() => {
    cy.log("Make a post request and check it's status")
    cy.request({
      method: 'POST',
      url: url,
      body: {
        email: userdetails.adminEmail,
        password: userdetails.adminPassword,
      },
    }).then((res) => {
      expect(res.status).to.eq(200)
      cy.log(res)
    })
  })
  beforeEach(function () {
    cy.visit(url + '/login')
  })
  it('When the credentials are correctly written', () => {
    cy.log('Visit the page before each test')

    cy.url().should('contain', '/login')
    cy.get('h2').should('contain', 'Hi, Welcome Back')
    cy.get('input[type="checkbox"]').should('be.checked').and('not.be.visible')
    //  cy.typeLabels('input[type="email"]',email)
    //  cy.typeLabels('input[type="password"]',password)
    cy.get('input[type="email"]').type(email, { log: false })
    cy.get('input[type="password"]').type(password, { log: false })
    cy.get('button[type="submit"]').click()
    cy.wait(9000)
    cy.url().should('contain', '/')
  })

  it('When the credentials are correct but the checkbox is unchecked', () => {
    cy.log('Visit the page before each test')
    cy.url().should('contain', '/login')
    cy.get('input[type="checkbox"]')
      .click()
      .should('not.be.checked')
      .and('not.be.visible')
    cy.get('input[type="email"]').type(email, { log: false })
    cy.get('input[type="password"]').type(password, { log: false })
    cy.get('button[type="submit"]').click()
    cy.wait(8000)
    cy.url().should('contain', '/')
  })

  it('When email address lable is empty', () => {
    cy.log("The email shouldn't be empty")
    cy.url().should('contain', '/login')
    cy.get('input[type="checkbox"]').should('be.checked').and('not.be.visible')
    cy.get('input[type="password"]').type(password, { log: false })
    cy.get('button[type="submit"]').click()
    cy.somethingIsRequired(
      '#standard-weight-helper-text-email-login',
      userdetails.requiredEmail
    )
    cy.url().should('contain', '/login')
  })

  it('When password lable is empty', () => {
    cy.log("The password shouldn't be empty")
    cy.url().should('contain', '/login')
    cy.get('h2').should('contain', 'Hi, Welcome Back')
    cy.get('input[type="checkbox"]').should('be.checked').and('not.be.visible')
    cy.get('input[type="email"]').type(email, { log: false })
    cy.get('button[type="submit"]').click()
    cy.somethingIsRequired(
      '#standard-weight-helper-text-password-login',
      userdetails.requiredPassword
    )
    cy.url().should('contain', '/login')
  })

  it('When the email is not valide', () => {
    cy.log('The password should be valide')
    cy.url().should('contain', '/login')
    cy.get('h2').should('contain', 'Hi, Welcome Back')
    cy.get('input[type="checkbox"]').should('be.checked').and('not.be.visible')
    cy.typeLabels('input[type="email"]', userdetails.wrongEmail)
    cy.get('input[type="password"]').type(password, { log: false })
    cy.get('button[type="submit"]').click()
    cy.somethingIsRequired(
      '#standard-weight-helper-text-email-login',
      userdetails.isEmailValide
    )
    cy.url().should('contain', '/login')
  })

  it('When the password is incorrect', () => {
    cy.log('The password should be incorrect')
    cy.url().should('contain', '/login')
    cy.get('h2').should('contain', 'Hi, Welcome Back')
    cy.get('input[type="checkbox"]').should('be.checked').and('not.be.visible')
    cy.get('input[type="email"]').type(email, { log: false })
    cy.typeLabels('input[type="password"]', userdetails.password)
    cy.get('button[type="submit"]').click()
    cy.wait(6000)
    cy.somethingIsRequired(
      '.MuiFormHelperText-root',
      userdetails.wrongCredentialt
    )
    cy.url().should('contain', '/login')
  })

  it('Test reset password', () => {
    cy.get('.MuiTypography-subtitle1').click()
    cy.get('h2').should('contain', 'Enter your email address')
    cy.url().should('contain', '/login/forgot-password')
    cy.typeLabels('#outlined-adornment-email-login', email)
    cy.get('.MuiButton-root').click()
    cy.get('.MuiFormHelperText-root').should(
      'not.have.text',
      'Request failed with status code 500'
    )
  })
})
