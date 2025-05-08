import 'cypress-real-events/support';
describe('Booking flow with mocked email verification', () => {
    it('submits reservation after clicking Send Verification Code', () => {
        // Visit the page
        cy.visit('http://localhost:3000/bookingDetail');

        // Choose service
        cy.contains('Cafe Visit').click();

        // Open the datepicker
        cy.get('.react-datepicker__input-container input').click();

        // Navigate to June if needed (한 달 넘기기)
        cy.get('.react-datepicker__navigation--next').click();

        // Click on June 4th (ensure it's not disabled)
        cy.get('.react-datepicker__day--004:not(.react-datepicker__day--disabled)').click();

        // Search for time and pick first slot
        cy.contains('Search Time').click();
        cy.get('button').contains(':').first().click();

        // Fill basic form fields
        cy.get('input[name="name"]').type('Sample Name ');
        cy.get('input[name="phone"]').type('123456789');
        cy.get('textarea[name="message"]').type('Looking forward to it!');
        cy.get('select[name="numberOfPeople"]').select('2');

        // Submit reservation
        cy.contains('Submit Reservation').click();

        // Check for confirmation screen
        cy.contains('Reservation Submitted!').should('exist');
    });
});
