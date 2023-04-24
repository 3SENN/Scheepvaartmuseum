//context: Compare dates in graph
describe("Dashboard get room-graph",  () => {
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#dashboard");
    });
    //Test: Validate preference form
    it("Valid preference form", () => {
        cy.reload;
        //Find the dropdown for the rooms, check if it exists.
        cy.get('#selectRoom',{ timeout: 20000 }).should("exist");
        //Find the button for the load, check if it exists.
        cy.get('#loadButton',{ timeout: 10000 }).should("exist");
        //Find the dropdown for the month, check if it exists.
        cy.get('#sortMonthElectricity',{ timeout: 10000 }).should("exist");
        //Find the dropdown for the year, check if it exists.
        cy.get('#sortYearElectricity',{ timeout: 10000 }).should("exist");
    });
    it("Successful room graph", () => {
    //Start a fake server
        cy.server();
    //Find the dropdown for the rooms and put the value "1".
        cy.get('#selectRoom').select('1')
        //Find the dropdown for the Month and put the value "3".
        cy.get('#sortMonthElectricity').select('3')
        //Find the dropdown for the Year and put the value "1".
        cy.get('#sortYearElectricity').select('2020')

    //Find the button to load and click it
        console.log(cy.get('#loadButton'));
        cy.get('#loadButton').click();
        it("Successful graph", () =>{
                cy.get('#myAreaChart').should("exist");
            }
        )
    });
    });