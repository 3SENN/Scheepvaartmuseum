//Context: Login
describe("Dashboard",  () => {

    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8081");
    });
    it('if valid dashboard ', function () {
        cy.get(".nav-link").click();
        //Find the field for the username, check if it exists.
        cy.get("#sortElectricity").should("exist");

    });

});
