import { NetworkManager } from "../framework/utils/networkManager.js";

export class TranslationRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/translation";
        this.#networkManager = new NetworkManager();
    }

    async getTranslation(page, language) {
        try {
            return await this.#networkManager
                .doRequest(`${this.#route}/${page}/${language}`, 'GET');
        } catch (e) {
            console.log(`Something went wrong: ${e.reason}`)
        }
    }

    updateHtml(id, update) {
        document.querySelectorAll(`[data-translation-${id}]`).forEach(element => {
            element.innerHTML = update;
        });
    }
}