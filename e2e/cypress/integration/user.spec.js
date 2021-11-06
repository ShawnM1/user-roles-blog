describe('user page', () => {

    describe('given the user has blog entries', () => {
        it('should contain blog entries', () => {
            cy.visit('/users/6')
            cy.get('[id="blog-card"]').should('exist')
        })
    })

    describe('given the user has no blog entries', () => {
        it('should not display blog entries', () => {
            cy.intercept(
                {
                    method: 'GET',
                    url: '/api/blog-entries/user/*'
                },
                []
            ).as('getBlogEntries')
            cy.visit('/users/6')
            cy.wait('@getBlogEntries')
            cy.get('[id="blog-card"]').should('not.exist')
        })
    })
})