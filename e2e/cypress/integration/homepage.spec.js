describe('homepage', () => {
    it('should load successfully', () => {
        cy.visit('/');
    })

    it('should contain the correctly spelled text', () => {
        cy.contains('Users')
        cy.contains('Admin')
        cy.contains('Login')
        cy.get('mat-select').click()
        cy.contains('Register')
    })
})