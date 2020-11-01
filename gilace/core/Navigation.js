class Navigation {
    page_navigation_loader = `<div class="_page_loader bg-light" style="
    position: absolute;
    z-index: 1000;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    display: none;">
                    <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);text-align: center">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>
                </div>`

    constructor() {
        if ($('._page_loader').length == 0) {
            $(document.body).append(this.page_navigation_loader);
            window.onpopstate = (ev) => {
                this.start();
            };
        }
    }

    set_global_variables(args = {}) {
        window.APPPATH = window.location.protocol + '//' + window.location.hostname + '/';
        window.BASEURL = args.api_url;
        let app_url = new URL(args.api_url);
        window.ASSETSPATH = app_url.protocol + '//' + app_url.hostname + '/';
        window.DOMAIN = app_url.protocol + '//' + app_url.hostname;
        window.TITLE_PREFIX = args.title_prefix;
        window.APPTITLE = args.title;
        this.default_route = args.default_route;
    }

    navigate(route = '', params = {}) {
        let id = uuid();
        window.SYS_CURRENT_STACK_UUID = id;
        this.navigation_params = params;
        let _route = gilace.router.find(route);
        _route['id'] = id;


        console.log(_route);
        console.log(params);

        if (!empty(_route.route_data.middleware)) {
            import(APPPATH + 'application/middleware/' + _route.route_data.middleware + '.js')
                .then(middleware => {
                    middleware.default.run(_route, this.do_nav, this.navigation_params);
                })
                .catch(err => {
                    console.log(err.message, 'failed');
                    $('.gcore-loading').hide();
                })
                .then(() => {
                });
        } else {
            this.do_nav(_route, this.navigation_params);
        }
    }

    do_nav(_route={},data={}) {
        console.log(_route.get_path());

        if (_route.id == SYS_CURRENT_STACK_UUID)
            import(_route.get_path())
                .then((module) => {
                    let cntr = new module.default();
                    let new_title = cntr.title;
                    history.pushState({
                        id: Math.random(),
                        command: _route.json()
                    }, new_title, _route.url())

                    switch (_route.command) {
                        case 'auto-crud':
                            import('./crud.js').then(crd => {
                                let crud = new crd.default();
                                crud.set_model(cntr);
                                gilace.layoutManager.render_layout(crud).then(() => {
                                    localStorage.setItem('current_stack', _route.json());
                                    crud.run(data);
                                });

                            })
                            break;
                        default:
                            console.log(cntr);
                            gilace.layoutManager.render_layout(cntr).then(() => {
                                localStorage.setItem('current_stack', _route.json());
                                cntr.run(data);
                            });
                            break;
                    }
                })
                .catch(err => {
                    console.log(err.message, 'failed');
                    $('.gcore-loading').hide();
                })
                .finally(() => {
                    $('.gcore-loading').hide();
                });
    }

    getParam(name = '') {
        if (!gilace.helper.empty(this.navigation_params)) {
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

        gilace.navigation.navigate(url);
    }

    get_default_route() {
        return (!empty(this.default_route) ?
            this.default_route :
            '/');
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
        gilace.drawer_navigation_args = args;
    }

    createDrawerNavigation(args = []) {
        let navs = ``;
        if (Array.isArray(args)) {
            navs += `<ul>`;
            args.map((nav) => {
                if (!Array.isArray(nav.childs)) {
                    navs += `<li class="menu">
            <button type="button" class="btn btn-link" data-navigate="${nav.action}"><span>${nav.name}</span></button>
        </li>`
                } else {
                    let childs = ``;
                    nav.childs.map((chld) => {
                        childs += `<li class="menu">
            <button type="button" class="btn btn-link" data-navigate="${chld.action}"><span>${chld.name}</span></button>
        </li>`
                    });
                    navs += `<li class="menu">
            <a href="#"><i
                        class="fa fa-angle-left  pull-left"></i><span>${nav.name}</span></a>
            <ul>
                ${childs}
            </ul>
        </li>`
                }
            });
            navs += `</ul>`;
        }
        return `<div>
    <div class="text-center myHover">
    </div>
    ${navs}

</div>`;
    }
}

export default Navigation;