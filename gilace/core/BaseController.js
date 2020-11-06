class BaseController {
    /** property **/
    title = (!empty(global().title) ? global().title : this.constructor.name);
    actions = ``;
    toolbar = 'default';
    drawer_navigation = 'default';

    constructor(args = {}) {
        if (typeof args == "object") {
            args && Object.assign(this, args);
        }
    }

    /** functions **/
    start(navigation_data = {}) {
        return null;
    }

    on_rendered() {

    }

    /** sdff **/
    run(navigation_data) {
        new Promise((resolve, reject) => {
            let response = this.start(navigation_data);
            /** render controller start function return val **/
            if (!empty(response)) {
                switch (typeof response) {
                    case "string":
                        gilace.layoutManager.render_html(response);
                        resolve();
                        break;
                    case "object":
                        console.log(response);
                        gilace.layoutManager.render_component(response, '#gcore_app_wrapper', resolve);
                        break;
                    default:
                        resolve();
                        break;
                }
            } else {
                resolve();
            }
        }).then(() => {
            this.navigation_data = navigation_data;
            this.on_rendered();
        }).catch(() => {

        }).finally(() => {

            $('._loader').fadeOut(500);
        });
    }

    forceUpdate() {
        this.run(this.navigation_data);
    }
}

export default BaseController;