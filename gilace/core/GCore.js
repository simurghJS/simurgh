import Navigation from "./Navigation.js";

import('./Helpers.js');

class GCore {

    constructor() {
    }

    import_shortcuts() {
        window.addEventListener('keyup', (ev) => {
            if (ev.key == 'Escape') {
                window.history.back();
            }
        });
    }

    registerApp(env = {}) {

        /** register global variables **/
        let app_url = !empty(env.api_url) ? new URL(env.api_url) : '';
        if (typeof gApp == "undefined") {
            window.gApp = {}
        }
        gApp.global = {
            layout: env.layout,
            app_title: env.title,
            title_prefix: env.title_prefix,
            prefix_separator: ' | '
        };
        gApp.drawer_navigation = env.drawer_navigation;
        gApp.default_route = '';
        gApp.domain = !empty(app_url) ? (app_url.protocol + '//' + app_url.hostname) : '';

        window.APPPATH = window.location.protocol + '//' + window.location.hostname + '/';
        window.BASEURL = env.api_url;
        window.ASSETSPATH = !empty(app_url) ? app_url.protocol + '//' + app_url.hostname + '/' : '';

        /** load dependencies **/
        let dep = [
            '../../node_modules/jquery/dist/jquery.min.js',
            '../../node_modules/bootstrap/dist/js/bootstrap.min.js',
            '../../node_modules/popper.js/dist/popper.min.js',
            APPPATH + 'node_modules/bootstrap/dist/css/bootstrap.css',
            APPPATH + 'node_modules/font-awesome/css/font-awesome.min.css',
            APPPATH + 'gilace/src/rtl.css'
        ];
        for (let dependency of env.dependencies) {
            dep.push(assets(dependency));
        }

        /** load app constants **/

        gApp.constants = env.constants;

        for (let [key, value] of Object.entries(env.constants)) {
            window[key] = value;
        }

        new loader().load(dep).then(() => {

            //all dependencies loaded

        }).catch((err) => {

            console.log('cannot load some dependencies! read logs');
            console.log(err);

        }).then(() => {
                /** load drawerNavigation & routes & environment shortcuts **/
                if (!empty(env.routes)) {
                    switch (typeof env.routes) {
                        case "function":
                            env.routes();
                            new Navigation().start();
                            break;
                        case "string":
                            import('/' + env.routes).then(() => {

                                this.import_shortcuts();

                            }).catch((err) => {
                                console.log(err);
                            }).then(() => {
                                new Navigation().start();
                            });
                            break;
                        default:
                            break;
                    }

                } else {
                    new Navigation().start();
                }
            }
        );
    }
}

export default GCore