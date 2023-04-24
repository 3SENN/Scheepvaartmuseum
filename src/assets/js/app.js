/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { SessionManager } from "./framework/utils/sessionManager.js"
import { LoginController } from "./controllers/loginController.js"
import { NavbarController }  from "./controllers/navbarController.js"
import { UploadController }  from "./controllers/uploadController.js"
import { WelcomeController }  from "./controllers/welcomeController.js"
import { SidebarController }  from "./controllers/sidebarController.js"
import { DashboardheaderController } from "./controllers/dashboardheaderController.js"
import {dashboardController} from "./controllers/dashboardController.js";

export class App {
    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_LOGIN = "login";
    static CONTROLLER_LOGOUT = "logout";
    static CONTROLLER_WELCOME = "welcome";
    static CONTROLLER_UPLOAD = "upload";
    static CONTROLLER_REGISTER = "register";
    static CONTROLLER_DASHBOARD = "dashboard";

    constructor() {
        //Always load the navigation

        new NavbarController();
        //Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
        App.loadControllerFromUrl(App.CONTROLLER_WELCOME );
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData = {}) {
        console.log("loadController: " + name);

        //log the data if data is being passed via controllers
        if (controllerData && Object.entries(controllerData).length !== 0) {
            console.log(controllerData);
        }
        console.log(name, "here")

        //load right controller based on the passed name to this function
        switch (name) {
            case App.CONTROLLER_DASHBOARD:
                new dashboardController();
                break;

            case App.CONTROLLER_NAVBAR:
                new NavbarController();
                break;
c
            case App.CONTROLLER_LOGIN:
                App.setCurrentController(name);
                App.isLoggedIn(() => new WelcomeController(), () => new LoginController());
                break;

            case App.CONTROLLER_LOGOUT:
                App.setCurrentController(name);
                App.handleLogout();
                break;

            case App.CONTROLLER_WELCOME:
                App.setCurrentController(name);
                new dashboardController();
                new WelcomeController();
                break;

            case App.CONTROLLER_UPLOAD:
                App.isLoggedIn(() => new UploadController(),() => new LoginController());
                break;

            case App.CONTROLLER_REGISTER:
                App.setCurrentController(name);
                break;

            default:
                return false;
        }

        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController)) {
                App.loadController(fallbackController);
            }
        } else {
            App.loadController(fallbackController);
        }
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        return location.hash.slice(1);
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     */
    static setCurrentController(name) {
        location.hash = name;
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    static isLoggedIn(whenYes, whenNo) {
        if (App.sessionManager.get("username")) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {
        App.sessionManager.remove("username");

        //go to login screen
        App.loadController(App.CONTROLLER_LOGIN);
    }
}

//When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", _ => {
    new App();
});