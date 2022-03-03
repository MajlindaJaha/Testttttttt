// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add('selectRole', (linkName) =>{

//  cy.get('#outlined-adornment-roles-user').each(($el, index, $list)=>{
//  if($el.text().includes(linkName))
//   {
//   (cy.get('.MuiMenuItem-root')).eq(index).click({force: true})
//   }
//  })
// })
// Cypress.Commands.add('selectRole', (linkName) =>{

//  cy.get('tr td:nth-child(2)').each(($el, index, $list)=>{
//  if($el.text().includes(linkName))
//   {
//   (cy.get('.MuiMenuItem-root')).eq(index).click({force: true})
//   }
//  })
// })

let userdetails
  before(function(){
  cy.fixture('userlogin').then(function(data){
   userdetails=data
  })
  })

Cypress.Commands.add('deleteUser', (user) =>{
 cy.get('tbody tr').each(($e1, index)=>{
 if( $e1.text().includes(user))
  {
   cy.get('button[aria-label="Delete"]').eq(index).click()
  }
 })
})

Cypress.Commands.add('editUser', (user) =>{
 cy.get('tbody tr').each(($e1, index)=>{
 if( $e1.text().includes(user))
  {
   cy.get('button[aria-label="Edit"]').eq(index).click()
  }
 })
})


Cypress.Commands.add('typeLabels', (selector,typeValue) =>{
 cy.get(selector).clear().type(typeValue, {log: false}).and('have.value', typeValue,{log: false})
})

Cypress.Commands.add('somethingIsRequired', (selector,typeValue) =>{
 cy.get(selector).should('contain',typeValue).and('have.css', 'color', 'rgb(217, 83, 79)')
})
Cypress.Commands.add('checkAlert', (alertMessage) =>{
 cy.get('.MuiAlert-message').should("have.text",alertMessage)
})

 