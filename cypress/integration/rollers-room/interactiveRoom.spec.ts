describe('Rolling dice', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/g/new-dice');
    cy.findByLabelText('Username').type('cypress');
    cy.findByText('Done').click();
    // beta warning
    cy.findByText("Dismiss (you won't see this warning again)").click();
  });

  it('can change color', () => {
    cy.findByTestId('color-picker').click();
  });

  it('can create and roll dice', () => {
    const dice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    dice.forEach((die, i) => {
      cy.findByTestId(die).click();
      cy.findByTestId(`die-cypress-${i + 1}`);
    });
    cy.findByTestId('die-cypress-1').click();
    cy.findByTestId('die-cypress-4').click();
    cy.findByTestId('die-cypress-6').click();
    cy.findByTestId('roll-3').click();

    cy.findByTestId('dCustom').click();
    cy.findByLabelText('Number of sides').type('7');
    cy.findByText('Done').click();
    cy.findByTestId('die-cypress-7');

    // check for text parts
    cy.findByText('D8');
    cy.findByText('D10');
    cy.findByText('D7');
  });

  it('can use clocks', () => {
    cy.findByTestId('clock').click();
    cy.findByLabelText('Clock name').type('Doom');
    cy.findByLabelText('How many segments should it have?').type('6');
    cy.findByText('Done').click();
    cy.findByTestId('clock-cypress-1-svg').dblclick();
    cy.findByTestId('clock-cypress-1-back').click();
    cy.findByTestId('clock-cypress-1-forward').click();
    cy.findByText('Doom');
  });

  it('can make tokens', () => {
    cy.findByTestId('token').click();
    cy.findByTestId('token-cypress-1');
    cy.findByTestId('token').click();
    cy.findByTestId('token-cypress-2');
  });
});
