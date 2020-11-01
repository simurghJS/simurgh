class BaseController {
    /** property **/
    title = this.constructor.name
    actions = ``
    navigation_header = `<div class="col-sm-12">
    <div class="d-flex justify-content-between align-content-end pb-5 pt-5">
        <div style="max-width: 50%;">
            <h3 id="gcore_app_title"></h3>
            <p></p>
        </div>
        <div id="gcore_app_actions">
        </div>
    </div>
</div>`;
    pre_loader = `<div class="_loader" style="background-color: #fff;position: fixed;z-index: 1000;top: 0;left: 0;width: 100%;height: 100%">
    <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);text-align: center">
        <div class="spinner-border" role="status">
            <span class="sr-only">درحال بارگزاری...</span>
        </div>
        <p style="text-align: center;padding-top: 2.5rem">...</p>
    </div>
</div>`;
    toolbar = new Object();
    drawer_navigation = 'default'
    main_html = null


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
            this.navigation_data=navigation_data;
            this.on_rendered();
        }).catch(() => {

        }).finally(() => {
            gilace.layoutManager.init_cli_exec();
            $('._page_loader').fadeOut(500);
        });
    }

    forceUpdate() {
        this.run(this.navigation_data);
    }
}

export default BaseController;