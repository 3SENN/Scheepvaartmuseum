const axios = require("axios");

class DataRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #dataHelper = require("../framework/utils/dataHelper");

    #app

    constructor(app) {
        this.#app = app;
        this.#dataHelper.loadFiles();

        //call method per route for the rooms entity
        this.#getAll()
        this.getYear()
        this.getMonth()
        this.getDay()
        this.getAllRooms()
        this.getRoomData()
        this.getRoomDatDay()
    }

    async getAllRooms(){
        this.#app.get("/api/v1/rooms",async (req, res) => {
            try {
                const data = await axios.get('https://svm.hbo-ict.cloud/api/v1/rooms')
                res.json(data.data)
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    async getRoomData(){
        this.#app.get("/api/v1/rooms/:id/data/:year",async (req, res) => {
            try {
                const data = await axios.get('0https://svm.hbo-ict.cloud/api/v1/rooms/' + req.params.id +"/data/"+ req.params.year)
                res.json(data.data)
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    async getRoomDatDay(){
        this.#app.get("/api/v1/rooms/:id/data/:year/:month/:day",async (req, res) => {
            try {
                const data = await axios.get('0https://svm.hbo-ict.cloud/api/v1/rooms/' + req.params.id +"/data/"+ req.params.year + "/" + req.params.month + "/" + req.params.day)
                res.json(data.data)
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }



    #getJson(type) {
        switch (type) {
            case "gas":
                return this.#dataHelper.get(type);
            case "elektra":
                return this.#dataHelper.get(type);
            default:
                return null;
        }
    }

    #getAll() {
        this.#app.get("/data/all/:type", async (req, res) => {
            try {
                const jsonData = this.#getJson(req.params.type.toLowerCase());

                if (jsonData === null) {
                    res.status(this.#errorCodes.HTTP_NO_CONTENT_CODE).json({reason: "No data found!"});
                } else {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json(jsonData);
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }


    async getYear() {
        this.#app.get("/data/electra/:year", async (req, res) => {
            try {
                const data = await axios.get('https://svm.hbo-ict.cloud/api/v1/data/' + req.params.year)

                res.json(data.data)

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    async getMonth(){
        this.#app.get("/data/electra/:year/:month", async (req, res) => {
            try {
                const data = await axios.get('https://svm.hbo-ict.cloud/api/v1/data/' + req.params.year + "/" + req.params.month)

                res.json(data.data)

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    async getDay(){
        this.#app.get("/data/electra/:year/:month/:day", async (req, res) => {
            try {
                const data = await axios.get('https://svm.hbo-ict.cloud/api/v1/data/' + req.params.year + "/" + req.params.month + "/" + req.params.day)

                res.json(data.data)

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}


module.exports = DataRoute;
