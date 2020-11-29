import './Dom.js'
import Router from "./Router.js";
import Component from "./Component.js";

const system = {
    paths: {
        controller: '/app/controllers',
        middleware: '/app/middleware',
        views: '/resources/views'
    }
}

class Arnahit {

    api_url = ''
    title = ''
    title_prefix = ''
    dependencies = []
    drawer_navigation = []
    routes = []
    constants = []
    jquery = true
    bootstrap = true
    rtl = false

    constructor() {
    }

    define(name = '', value = '') {
        this.constants[name] = value;
    }

    registerDrawerNavigation(navs = []) {
        Object.entries(navs).map(nav => {
            switch (typeof nav[1]) {
                case "string":
                    this.drawer_navigation.push({
                        name: nav[0],
                        action: nav[1]
                    });
                    break;
                case "object":
                    let child = []
                    Object.entries(nav[1]).map(nv => {
                        child.push({
                            name: nv[0],
                            action: nv[1]
                        });
                    });
                    this.drawer_navigation.push({
                        name: nav[0],
                        childs: child
                    });
                    break;
            }
        });
    }

    registerDependencies(deps = []) {
        this.dependencies = deps;
    }

    set_layout(path = '') {
        this.layout = path;
    }

    enable_jquery(status = true) {
        this.jquery = status;
    }

    enable_bootstrap(status = true) {
        this.bootstrap = status
    }

    forceRTL() {
        this.rtl = true;
    }

    registerRoutes(callback = '') {
        this.routes = callback;
    }

    import_shortcuts() {
        window.addEventListener('keyup', (ev) => {
            if (ev.key == 'Escape') {
                window.history.back();
            }
        });
    }

    build() {
        /** register global variables **/
        let app_url = !empty(this.api_url) ? new URL(this.api_url) : '';
        if (typeof gApp == "undefined") {
            window.gApp = {}
        }
        gApp.global = {
            layout: this.layout,
            app_title: this.title,
            title_prefix: this.title_prefix,
            prefix_separator: ' | '
        };
        gApp.drawer_navigation = this.drawer_navigation;
        gApp.default_route = '';
        gApp.domain = !empty(app_url) ? (app_url.protocol + '//' + app_url.hostname) : '';
        gApp.system = {...system};
        window.APPPATH = window.location.protocol + '//' + window.location.hostname;
        window.BASEURL = this.api_url;
        window.ASSETSPATH = !empty(app_url) ? app_url.protocol + '//' + app_url.hostname + '/' : '';

        /** load dependencies **/
        let dep = [];
        if (this.jquery) {
            dep.push('../../node_modules/jquery/dist/jquery.min.js')
        }
        if (this.bootstrap) {
            dep.push(APPPATH + '/node_modules/bootstrap/dist/css/bootstrap.css');
            dep.push(APPPATH + '/node_modules/bootstrap/dist/js/bootstrap.min.js');
            dep.push('../../node_modules/popper.js/dist/popper.min.js');
            dep.push(APPPATH + '/node_modules/font-awesome/css/font-awesome.min.css');
        }
        if (this.rtl) {
            dep.push(APPPATH + '/arnahit/src/rtl.css');
        }

        for (let dependency of this.dependencies) {
            dep.push(resources(dependency));
        }

        /** load app constants **/

        gApp.constants = this.constants;

        for (let [key, value] of Object.entries(this.constants)) {
            window[key] = value;
        }

        new loader().load(dep).then(() => {

            //all dependencies loaded

        }).catch((err) => {

            console.log('cannot load some dependencies! read logs');
            console.log(err);

        }).then(() => {
                this.import_shortcuts();
                if (!empty(this.routes)) {
                    switch (typeof this.routes) {
                        case "function":
                            this.routes();
                            this.run();
                            break;
                        case "string":
                            import('/' + this.routes).then(() => {
                            }).catch((err) => {
                                console.log(err);
                            }).then(() => {
                                this.run();
                            });
                            break;
                        default:
                            break;
                    }

                } else {
                    this.run();
                }
            }
        );
    }

    run() {
        console.log(window.location.hash);
        let url = window.location.hash.replace('#!/', '');
        new Router().navigate(url);
    }

    createElement(type, props, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children.map(child =>
                    typeof child === "object"
                        ? child
                        : {
                            type: "Text",
                            props: {
                                nodeValue: child,
                                children: [],
                            },
                        }
                ),
            },
        }
    }
}

export default Arnahit
