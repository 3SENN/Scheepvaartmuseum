/**
 * -- THIS IS AN EXAMPLE REPOSITORY WITH EXAMPLE DATA FROM DB --
 * Repository responsible for all room related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Pim Meijer
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class DataRepository {
    //# is a private field in Javascript
    #route
    #networkManager
    #routeRoom
    #rooms

    constructor() {
        this.#route = "/data/electra"
        this.#networkManager = new NetworkManager();
        this.#routeRoom = "/api/v1/rooms"
    }

    async getAll() {

    }

    /**
     * Async function to get a piece of room example data by its id via networkmanager
     * in the back-end we define :roomId as parameter at the end of the endpoint
     *
     * GET requests don't send data via the body like a POST request but via the url
     * @param roomId
     * @returns {Promise<>}
     */
    /**
     * Async function to get data from the Scheepvaartmuseum API about energy usage for a year
     *
     * @param year - Year to ask Data of
     * @returns {Promise<*>}
     */
    async getYear(year) {
        return await this.#networkManager.doRequest(`${this.#route}/${year}`, "GET");
    }

    async getMonth(year,month){
        return await this.#networkManager.doRequest(`${this.#route}/${year}/${month}`, "GET");
    }

    async getDay(year,month, day){
        return await this.#networkManager.doRequest(`${this.#route}/${year}/${month}/${day}`, "GET");
    }

    async getAllRooms(){
        return await this.#networkManager.doRequest(`${this.#routeRoom}`, "GET");
    }

    async getRoomData(id,year){
        return await this.#networkManager.doRequest(`${this.#routeRoom}/${id}/data/${year}`, "GET");
    }

    async getRoomDataDay(id,year, month, day){
        return await this.#networkManager.doRequest(`${this.#routeRoom}/${id}/data/${year}/${month}/${day}`, "GET");
    }

    async getRoomDataMonth(id,year, month){
        return await this.#networkManager.doRequest(`${this.#routeRoom}/${id}/data/${year}/${month}`, "GET");
    }

    async create() {

    }

    async delete() {

    }

    async update(id, values = {}) {

    }
}