describe('Trophy Dark App', () => {
  context('Player', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/trophy-dark/cypress');
      cy.findByLabelText('Name and pronouns').type('Cypress (they / them)');
      cy.findByLabelText('Player').click({ force: true });
      cy.findByText('Done').click();
    });

    it('has a character sheet', () => {
      cy.findByPlaceholderText('Character name').type('Cygonia')
      cy.findByPlaceholderText('Character pronouns').type('She / Her')
      cy.findByLabelText('Background').type('computer')
      cy.findByLabelText('Occupation').type('tester')
      cy.findByText('1').should('have.attr', 'disabled')
      cy.findByText('2').should('not.have.attr', 'disabled')
      cy.findByTestId('ritual-1').type('Fire')
      cy.findByTestId('ritual-2').type('Water')
      cy.findByTestId('ritual-3').type('Earth')
      cy.findByText('2').should('have.attr', 'disabled')
      cy.findByText('3').should('have.attr', 'disabled')
      cy.findByText('4').should('have.attr', 'disabled')
      cy.findByText('6').click();
      cy.findByText('5').then($el => {
        expect($el.attr('data-marked')).to.eql('true');
      })
      cy.findByText('6').then($el => {
        expect($el.attr('data-marked')).to.eql('true');
      })
    });
    it('has a lines and veils sheet', () => {
      cy.findByText('Safety').click();
      cy.findByText("Line")
      cy.findByText("Veil")
      cy.findByText("Ask First")
      cy.findByText("Enthusiastic Consent")
      cy.findByText("Notes")
      cy.findByLabelText('New item').type('colonizing')
      cy.findByText('Add New').click();
      cy.findByLabelText('colonizing note').type('good riddance');
      cy.findByLabelText('line colonizing').click();
    });

    it('can roll light and dark dice', () => {
      cy.findByLabelText('Light Dice').type('2')
      cy.findByLabelText('Dark Dice').type('1')
      cy.findByText('Roll').click();
      cy.findAllByTestId('light-die').then($el => {
        expect($el.length).to.eql(2)
      })
      cy.findAllByTestId('dark-die').then($el => {
        expect($el.length).to.eql(1)
      })
    });
    it('can play the x-card', () => {
      cy.findByText('X').click();
      cy.findByText("X-Card Played");
      cy.findByText("Acknowledge").click();
    });
  })
});
