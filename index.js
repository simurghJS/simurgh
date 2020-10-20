import G_core from "./gilace/core/g_core.js";

class Index extends G_core {
    constructor() {
        super();
        import('./app.js').then(app => {
            let application = app.default;
            this.registerApp(application.build());
        })
    }
}

export default new Index();
