/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {RoomsExampleRepository} from "../repositories/roomsExampleRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {DataRepository} from "../repositories/dataRepository.js";



export class WelcomeController extends Controller{
    #roomExampleRepository
    #welcomeView
    #dataRepository

    constructor() {
        super();
        this.#roomExampleRepository = new RoomsExampleRepository();
        this.#dataRepository = new DataRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoDashboard("html_views/welcome.html")

        //from here we can safely get elements from the view via the right getter
        // const anchors = this.#welcomeView.querySelectorAll(".container");
        this.#welcomeView.querySelector("#dashboardButton").addEventListener("click",  event => {
            App.loadController("dashboard");
        });
     }



}