import Core from "./gilace/core/Core.js";
import Application from "/gilace/core/Application.js";
import Component from "/gilace/core/Component.js";
import Navigation from "/gilace/core/Navigation.js";
import Router from "/gilace/core/Router.js";

export {
    Application,
    Component,
    Navigation,
    Router
}

class Gilace extends Core {
    constructor() {
        super();
        import('./app.js').then(app => {
            let application = app.default;
            this.registerApp(application.build());
        })
    }
}

export default new Gilace();
