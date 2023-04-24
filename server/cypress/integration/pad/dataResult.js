//context: When a date is selected and loaded, in data result screen icebergs appear or disappear
describe("Dashboard Data Result", () => {
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#dashboard");
    });
    //Test: Validate load button, icebergs and platforms in result
    it("Valid result page", () => {
        //Find the button for the load, check if it exists.
        cy.get('#loadButton', {timeout: 10000}).should("exist");
        //Find the dropdown for the year, check if it exists.
        cy.get('#sortYearElectricity', {timeout: 10000}).should("exist");
        cy.get('#resultCard', {timeout: 10000}).should("exist");
        cy.get('.iceberg-container', {timeout: 10000}).should("exist");
        cy.get('.ice-platform-container', {timeout: 10000}).should("exist");

    });

    it("Successful graph result: more ice", () => {
        //wait for page to load
        cy.wait(2000)

        // Find the dropdown for period selection and input the value "year"
        cy.get('#sortElectricity').select('year')

        // Find the dropdown for the year and input the value "2020"
        cy.get('#sortYearElectricity').select('2020')

        //wait for page to update
        cy.wait(2000)

        //Find the button to load and click it
        cy.get('#loadButton').click();

        //Intercepts data of 2020
        cy.intercept('GET', '/api/data/electra/2020', {
            statusCode: 200
        });
        //Intercepts data of 2019 (previous year)
        cy.intercept('GET', 'api/data/electra/2019', {
            statusCode: 200
        });

        cy.get('.ice-platform').should("exist");
        cy.get('.iceberg').should("exist");
    });

    it("Unsuccesful graph result", () => {
        //wait for page to load
        cy.wait(2000)

        const mockedResponse = {
            reason: "ERROR"
        };

        // Find the dropdown for period selection and input the value "year"
        cy.get('#sortElectricity').select('year')

        // Find the dropdown for the year and input the value "2020"
        cy.get('#sortYearElectricity').select('2020')

        //wait for page to update
        cy.wait(2000)

        //Find the button to load and click it
        cy.get('#loadButton').click();

        cy.get('.ice-platform').should("exist");
        cy.get('.iceberg').should("exist");
        //Intercepts data of 2018
        cy.intercept('GET', '/api/data/electra/2018', {
            statusCode: 500,
            body: mockedResponse
        }).as('displayError2020');

        //Intercepts data of 2019 (previous year)
        cy.intercept('GET', 'api/data/electra/2017', {
            statusCode: 500,
            body: mockedResponse
        }).as('displayError2019');

        cy.wait('@displayError2019');
        cy.wait('@displayError2020');

        cy.get('#resultText').should("exist").should("contain", 'Er is geen data beschikbaar voor de vorige periode van de gekozen periode!')


    });
});