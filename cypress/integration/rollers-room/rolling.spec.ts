context('Rolling dice', () => {
  beforeEach(() => {
    cy.viewport(1200, 800);
    cy.visit('http://localhost:3000/');
    cy.findByText('Make a new room').click();
    cy.findByLabelText('Username').type('cypress');
    cy.findByText('Done').click();
  });

  const dice = [
    {
      type: 'd6',
      modifier: '0',
    },
    {
      type: 'd8',
      modifier: '2',
    },
    {
      type: 'd10',
      modifier: '0',
    },
    {
      type: 'd12',
      modifier: '3',
    },
    {
      type: 'd20',
      modifier: '0',
    },
    {
      type: 'd100',
      modifier: '-5',
    },
  ];

  dice.forEach((die) => {
    it(`can roll ${die.type} through assorted dice`, () => {
      cy.findByLabelText(`Number of ${die.type}`).type('2');
      cy.findByLabelText('Modifier').click().type(die.modifier);
      cy.findByText('Roll dice').click();
      cy.findByTestId('roll-results-column').within(() => {
        // roll results
        cy.findByText(die.type);
        cy.findByTestId(`dice-results-${die.type}`);
        cy.contains(' + ');
        cy.findByText('Roll Modifier');
        cy.findByText('Total');
      });
      cy.findByTestId('roll-history-item-0').within(() => {
        // roller name
        cy.findByText('cypress');
        // roll name
        cy.findByText(`2${die.type} + ${die.modifier}`);
      });
      cy.findByTestId('roll-history-item-0').click();
      cy.findByTestId('roll-history-popup-0').within(() => {
        cy.findByText(die.type);
        cy.findByText('Roll Modifier');
        cy.findByText(die.modifier);
      });
      cy.findByTestId(`roll-bubble-2${die.type} + ${die.modifier}`).within(
        () => {
          cy.findByText(`cypress`);
          cy.findByTestId('roll-bubble-roll-name').within(() => {
            cy.findByText(`rolled 2${die.type} + ${die.modifier}!`);
          });
        }
      );
      cy.findByLabelText(`Number of ${die.type}`).clear();
      cy.findByLabelText('Modifier').clear();
    });
  });

  it('can roll lots of dice at once', () => {
    cy.findByLabelText('Number of d6').click().type('3');
    cy.findByLabelText('Number of d10').click().type('4');
    cy.findByLabelText('Number of d20').click().type('5');
    cy.findByLabelText('Modifier').click().type('2');
    cy.findByText('Roll dice').click();
    cy.findByTestId('roll-results-column').within(() => {
      // roll results
      cy.findByText('d6');
      cy.findByTestId(`dice-results-d6`);
      cy.findByText('d10');
      cy.findByTestId(`dice-results-d10`);
      cy.findByText('d20');
      cy.findByTestId(`dice-results-d20`);
      cy.findByText('Roll Modifier');
      cy.findByText('Total');
    });
    cy.findByTestId('roll-history-item-0').within(() => {
      // roller name
      cy.findByText('cypress');
      // roll name
      cy.findByText('3d6, 4d10, 5d20 + 2');
    });
    cy.findByTestId('roll-history-item-0').click();
    cy.findByTestId('roll-history-popup-0').within(() => {
      cy.findByText('d6');
      cy.findByText('d10');
      cy.findByText('d20');
      cy.findByText('Roll Modifier');
    });
  });
});
