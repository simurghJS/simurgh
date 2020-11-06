import Router from "./Router.js";
import LayoutManager from "./layoutManager.js";

class Navigation {

    constructor() {
        window.onpopstate = (ev) => {
            this.start();
        };
    }


    navigate(route = '', params = {}) {

        window.gApp.current_stack_uuid = uuid();

        this.navigation_params = params;
        let _route = new Router().find(route);
        _route['id'] = gApp.current_stack_uuid;

        if (!empty(_route.route_data.middleware)) {
            import(APPPATH + 'application/middleware/' + _route.route_data.middleware + '.js')
                .then(middleware => {
                    middleware.default.run(_route, this.do_nav, this.navigation_params);
                })
                .catch(err => {
                    console.log(err.message, 'failed');
                })
                .then(() => {
                });
        } else {
            this.do_nav(_route, this.navigation_params);
        }
    }

    /** do navigating to  route **/
    do_nav(_route = {}, data = {}) {
        /** navigating... **/
        if (_route.id == gApp.current_stack_uuid) {
            new Promise((resolve, reject) => {

                /** load controller **/
                import(_route.get_path()).then((module) => {
                    let controller = new module.default();
                    new LayoutManager().render_layout(controller).then(() => {
                        new LayoutManager().init_cli_exec();
                        resolve(controller);
                    }).catch(err => {
                        reject(err)
                    });
                })

            }).then((controller) => {

                /** run controller and update history **/
                controller.run(data);
                let new_title = controller.title;
                history.pushState({
                    id: Math.random(),
                    command: _route.json()
                }, new_title, _route.url());
                localStorage.setItem('current_stack', _route.json());

            }).catch(err => {

                /** log error **/
                console.log(err.message, 'failed');

            }).finally(() => {
                $('._loader').hide();
            });
        }
    }

    getParam(name = '') {
        if (!empty(this.navigation_params)) {
            for (let [key, value] of Object.entries(this.navigation_params)) {
                if (name === key) {
                    return value;
                }
            }
        }
        return '';
    }

    start() {
        let url = window.location.hash.replace('#!/', '');

        if (empty(url)) {
            let cashed = localStorage.getItem('current_stack');
            url = !empty(cashed) ? JSON.parse(cashed).url : this.get_default_route();
        }

        this.navigate(url);
    }

    get_default_route() {
        return gApp.default_route;
    }

    data() {
        let data_json = document.cookie.split('; ').find(row =>
            row.startsWith('GilaceJS')
        );
        let app_data = {};
        if (!gilace.helper.empty(data_json)) {
            data_json = data_json.split('=')[1];
            app_data = JSON.parse(unescape(data_json));
        }
        return app_data;
    }

    registerDrawerNavigation(args = []) {
        gApp.global.drawer_navigation_args = args;
    }

    createDrawerNavigation() {
        let args = gApp.drawer_navigation;
        let navs = ``;
        if (Array.isArray(args)) {
            navs += `<ul>`;
            args.map((nav) => {
                if (!Array.isArray(nav.childs)) {
                    navs += `<li class="menu">
                                <button type="button" class="btn btn-link" gilace-navigate="${nav.action}"><span>${nav.name}</span></button>
                             </li>`
                } else {
                    let childs = ``;
                    nav.childs.map((chld) => {
                        childs += `<li class="menu">
                                        <button type="button" class="btn btn-link" gilace-navigate="${chld.action}"><span>${chld.name}</span></button>
                                    </li>`
                    });
                    navs += `<li class="menu">
                                <a href="#">
                                    <iclass="fa fa-angle-left  pull-left"></i><span>${nav.name}</span>
                                </a>
                                <ul>
                                    ${childs}
                                </ul>
                             </li>`
                }
            });
            navs += `</ul>`;
        }
        return `<div>${navs}</div>`;
    }
}

export default Navigation;