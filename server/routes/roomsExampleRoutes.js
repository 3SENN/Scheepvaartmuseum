const axios = require("axios");

/**
 * This class contains ExpressJS routes specific for the roomsExample entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */

class RoomsExampleRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the rooms entity
        this.#getRoomById()
        // this.#getAllRooms()
        this.#test()
        this.#test2()
    }


    /**
     * dummy data example endpoint - rooms (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */

    // #getAllRooms(){
    //     this.#app.get("",async (req, res) => {
    //         try {
    //             const data = await axios.get('https://svm.hbo-ict.cloud/api/v1/rooms')
    //             res.json(data.data)
    //         } catch (e) {
    //             res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
    //         }
    //     })
    // }

    #getRoomById() {
        this.#app.get("/rooms_example/:roomId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT id, surface FROM rooms_example WHERE id = ?",
                    values: [req.params.roomId]
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
    #test() {
        this.#app.get("/test",  (req, res) => {
                res.status(this.#errorCodes.HTTP_OK_CODE).json({"id":8 +"==>"})
        });
    }

    #test2() {
        this.#app.get("/testt", async (req, res) => {
            const id = await this.#databaseHelper.handleQuery({
                query: `SELECT *
                        FROM user`});
            res.status(this.#errorCodes.HTTP_OK_CODE).json({id})
            })
        }


}

module.exports = RoomsExampleRoutes