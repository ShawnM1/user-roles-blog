describe('Users page', () => {

    it('should load user table', () => {
        cy.visit('/users')
        cy.get('[routerlink="users"]').click()
        cy.get('mat-table')
    }) 

    it('should display correct column names', () => {
        cy.contains('Id')
        cy.contains('Name')
        cy.contains('Username')
        cy.contains('Email')
        cy.contains('Role')
    })

    it('should filter by username', () => {
        cy.get('[data-placeholder="Search username"]').type('shawn')
        cy.get('mat-table').find('mat-row').should('have.length', 1)
    })

})
