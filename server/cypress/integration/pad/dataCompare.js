//context: Compare dates in graph
describe("Dashboard compare graph",  () => {
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#dashboard");
    });
    //Test: Validate preference form
    it("Valid preference form", () => {
        //Find the radiobutton for the compare, check if it exists.
        cy.get('#customSwitches',{ timeout: 20000 }).should("exist");
        //Find the button for the load, check if it exists.
        cy.get('#loadButton',{ timeout: 10000 }).should("exist");
        //Find the dropdown for the month, check if it exists.
        cy.get('#sortMonthElectricity',{ timeout: 10000 }).should("exist");
        cy.get('#compareMonthElectricity',{ timeout: 10000 }).should("exist");
        //Find the dropdown for the year, check if it exists.
        cy.get('#sortYearElectricity',{ timeout: 10000 }).should("exist");
        cy.get('#compareYearElectricity',{ timeout: 10000 }).should("exist");
    });
    it("Successful compare graph", () => {
       //wait for page to load
        cy.wait(2000)
        cy.get('#customSwitches').click()
        //wait for compare month and compare year to load
        cy.wait(2000)

        // Find the dropdown for the Month and compareMonth and put the value "3","1".
        cy.get('#sortMonthElectricity').select('3')
        cy.get('#compareMonthElectricity').select('1')
        //Find the dropdown for the Year and compareYear and put the value "2020","2019".
        cy.get('#sortYearElectricity').select('2020')
        cy.get('#compareYearElectricity').select('2019')
        cy.wait(2000)
        //Find the button to load and click it
        console.log(cy.get('#loadButton'));
        cy.get('#loadButton').click();

        //Test: Successful graph test
        it("Successful graph", () =>{
                cy.get('#myAreaChart').should("exist");
            }
        )
    });


});