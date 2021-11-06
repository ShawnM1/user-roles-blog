describe('homepage', () => {
    it('should load successfully', () => {
        cy.visit('/');
    })

    it('should contain the correctly spelled text', () => {
        cy.contains('Users')
        cy.contains('Admin')
        cy.get('[id="navBarDropdown"]').click()
        cy.contains('Register')
        cy.contains('Login')
        cy.contains('Update Profile')
        cy.contains('Logout')
    })

    it('should display blog entries', () => {
        cy.get('mat-card').should('exist')
    })
})