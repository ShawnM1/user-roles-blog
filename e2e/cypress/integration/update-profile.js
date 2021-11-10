describe('update-profile page', () => {
    describe('given a user who is not logged in', () => {
    })
    it('should redirect to the login page', () => {
        cy.visit('update-profile')
        cy.url().should('include', 'login')
    })
})