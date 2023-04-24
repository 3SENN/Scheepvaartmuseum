const axios = require('axios');
class MuseumRoutes {
    #app;

    constructor(app) {
        this.#app = app;
        this.#getYear();
        this.#getDay();
        this.#getMonth();
    }

    // Link voor jaar
   async #getYear(){
        try {
            const response = await axios.get("https://svm.hbo-ict.cloud/api/v1/data/2021");
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    // Link voor dag
    async #getDay(){
        try {
            const response = await axios.get("https://svm.hbo-ict.cloud/api/v1/data/2021/6/15");
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    async #getMonth(){
        try{
            const response = await axios.get("https://svm.hbo-ict.cloud/api/v1/data/2021/2");
            console.log(response);
        }catch (error){
            console.error(error);
        }
    }
}


module.exports = MuseumRoutes;