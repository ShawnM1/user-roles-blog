import { PASSWORD, USERNAME } from "./constants"

describe('login page', () => {

    it('should login the user', () => {
        cy.visit('/login')
        cy.get('[formcontrolname="email"]').type(USERNAME)
        cy.get('[formcontrolname="password"]').type(PASSWORD)
        cy.get('[type="submit"').click()
        cy.url().should('include', 'admin')
    })
})