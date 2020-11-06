import GCore from "./gilace/core/GCore.js";

class Index extends GCore {
    constructor() {
        super();
        import('./app.js').then(app => {
            let application = app.default;
            this.registerApp(application.build());
        })
    }
}

export default new Index();
