//context: Load data in graph
describe("Dashboard graph",  () => {
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#dashboard");
    });
    //Test: Validate preference form
    it("Valid date form", () => {
        //Find the select options for the graph date picker, check if it exists.
        cy.get('#sortElectricity',{ timeout: 20000 }).should("exist");
        //Find the button for the load, check if it exists.
        cy.get('#loadButton',{ timeout: 10000 }).should("exist");
        //Find the dropdown for the year, check if it exists.
    });
    it("Successful graph", () => {
        //wait for page to load
        cy.wait(2000)
        cy.get('#sortElectricity').select('years');

        //wait for compare month and compare year to load
        cy.wait(10000)
        //Find the button to load and click it
        console.log(cy.get('#loadButton'));
        cy.get('#loadButton').click();


        //Test: Successful graph
        it("Displayed graph", () =>{
                cy.get('#myAreaChart').should("exist");
            }
        )
    });


});