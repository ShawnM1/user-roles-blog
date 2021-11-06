import { PASSWORD, USERNAME } from "./constants"

describe('login page', () => {

    describe('on a sucuessful login', () => {
        it('should store the JWT in local storage and navigate to the home page', () => {
            cy.visit('/login')
            cy.get('[formcontrolname="email"]').type(USERNAME)
            cy.get('[formcontrolname="password"]').type(PASSWORD)
            cy.get('[type="submit"').click().should(() => {
                expect(localStorage.getItem('blog-token')).to.not.be.null
            })
            cy.url().should('include', 'home')
        })
    })

    describe('on an unsuccessful login', () => {
        it('should display an error dialog', () => {
            cy.visit('/login')
            cy.get('[formcontrolname="email"]').type('notreal@mail.com')
            cy.get('[formcontrolname="password"]').type(PASSWORD)
            cy.get('[type="submit"').click()
            cy.get('mat-dialog-content')
            cy.contains('Invalid email or password')
            cy.get('[mat-dialog-close]').click()
            cy.get('mat-dialog-content').should('not.exist')
        })
    })

    describe('on invalid input', () => {
        it('should disable the login button', () => {
            cy.visit('/login')
            cy.get('[type="submit"]').should('be.disabled')
        })
    })
})