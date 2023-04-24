/**
 * Responsible for handling the actions happening on the navigation
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {App} from "../app.js";
import {Controller} from "./controller.js";
import {TranslationRepository} from "../repositories/translationRepository.js";

export class DashboardheaderController extends Controller {
    #headerView
    #translationRepository

    constructor() {
        super();
        this.#translationRepository = new TranslationRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .navigation div
     * @returns {Promise<void>}
     * @private
     */
    async #setupView() {
        //await for when HTML is
        this.#headerView = await super.loadHtmlIntoDashboardHeader("html_views/dashboardheader.html")

        const langTrans = this.#headerView.querySelector("#langChanger");
        // let selectedOption = selectBox.options[selectBox.selectedIndex];
        // langTrans.addEventListener('change', (event) => this.#handleLangChange(event));

        //from here we can safely get elements from the view via the right getter
        const anchors = this.#headerView.querySelectorAll(".dashboard-header");

        //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => DashboardheaderController.#handleClickNavigationItem(event)))
    }

    /**
     * Reads data attribute on each .nav-link and then when clicked navigates to specific controller
     * @param event - clicked anchor event
     * @returns {boolean} - to prevent reloading
     * @private
     */
    #handleClickNavigationItem(event) {
        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

        if (typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        //TODO: You should add highlighting of correct anchor when page is active :)

        //Pass the action to a new function for further processing
        App.loadController(controller);

        //Return false to prevent reloading the page
        return false;
    }

    async #handleLangChange(event) {
        const language = event.target.value;
        const page = window.location.hash.replaceAll("#", "");
//Object { translation: "YOOO", htmlDataId: "test" }
        try {
            const translations = await this.#translationRepository.getTranslation(page, language);

            for (let i = 0; i < translations.length; i++) {
                console.log(translations[i].htmlDataId);
                this.#translationRepository.updateHtml(translations[i].htmlDataId, translations[i].translation);
            }
        } catch (e) {
            console.log(e)
        }

        return false;
    }
}
