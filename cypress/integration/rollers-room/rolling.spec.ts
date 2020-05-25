context('Rolling dice', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    // scaffolding some saved rolls
    window.localStorage.setItem(
      'rollIds',
      '["6bb28328-6a84-4ed2-b045-37c6cbc9a330","b8aa1619-39ac-47af-9fc1-1e4a6681d020"]'
    );
    window.localStorage.setItem(
      '6bb28328-6a84-4ed2-b045-37c6cbc9a330',
      '{"rollName":"Weird","dice":["6","6"],"modifier":"2","id":"6bb28328-6a84-4ed2-b045-37c6cbc9a330"}'
    );
    window.localStorage.setItem(
      'b8aa1619-39ac-47af-9fc1-1e4a6681d020',
      '{"rollName":"Kick Some Ass","dice":["6","6"],"modifier":"-1","id":"b8aa1619-39ac-47af-9fc1-1e4a6681d020"}'
    );
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
      cy.findByText('Roll the Dice').click();
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
    cy.findByText('Roll the Dice').click();
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

  it('can use configured rolls', () => {
    // create a configured roll
    cy.findByText('Create a Roll').click();
    cy.findByTestId('add-roll-form').within(() => {
      cy.findByLabelText('Roll Name').type('Go Aggro');
      cy.findByLabelText('Die 1 Type').select('8');
      cy.findByText('Add another die').click();
      cy.findByLabelText('Die 2 Type').select('10');
      cy.findByLabelText('Modifier').type('2');
      cy.findByText('Done').click();
    });
    cy.contains('Go Aggro');
    // test rolling
    cy.findByTestId('configured-roll-Go Aggro').within(() => {
      cy.findByText('Roll').click();
    });
    cy.findByTestId('roll-history-item-0').within(() => {
      cy.contains('Go Aggro');
      cy.contains('cypress');
    });
    // test saving
    cy.findByTestId('configured-roll-Go Aggro').within(() => {
      cy.findByText('Save').click();
    });
    // test loading
    cy.findByText('Load Saved Rolls').click();
    cy.findByTestId('load-rolls-form').within(() => {
      cy.findByLabelText('Kick Some Ass').click({ force: true });
      cy.findByLabelText('Go Aggro').then(($el) => {
        expect($el.attr('disabled')).exist;
      });
      cy.findByText('Done').click();
    });
    cy.findByTestId('configured-roll-Kick Some Ass').within(() => {
      cy.findByText('Roll').click();
    });
    cy.findByTestId('roll-history-item-0').within(() => {
      cy.contains('Kick Some Ass');
      cy.contains('cypress');
    });
    // test removing
    cy.findByTestId('configured-roll-Go Aggro').within(() => {
      cy.findByText('Delete').click();
    });
    cy.findByText('Load Saved Rolls').click();
    cy.findByTestId('load-rolls-form').within(() => {
      cy.findByLabelText('Go Aggro').should('not.exist');
    });
  });
});
