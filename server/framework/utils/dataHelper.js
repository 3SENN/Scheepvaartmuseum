/**
 *  This is the class that holds the Business logic for working with the json files.
 *  This class doesn't have an normal constructor because of the async file read operations.
 *      Thus after creating an instance of the class, the loadFiles() method must be called!
 * @author - Mick Veenman
 */

class DataHelper {
    #fs = require('fs/promises');

    #gas
    #elektra

    constructor() {  }

    /**
     * async method for constructing the object.
     * @returns {Promise<void>}
     */
    async loadFiles() {
        this.#gas = await this.#getJson('gas.json');
        this.#elektra = await this.#getJson('elektra.json');
    }

    get(type) {
       switch (type.toLowerCase()) {
           case "gas": return this.#gas;
           case "elektra": return this.#elektra;
       }
    }

    async #getJson(path) {
        try {
            const data = await this.#fs.readFile(path);

            return JSON.parse(data);
        } catch (e) {
            console.log(e)
        }
    }

    log() {
        console.log(this.gas);
        console.log(this.elektra);
    }
}



module.exports = new DataHelper();