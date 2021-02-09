/** router **/
class RouteItem {
    constructor(data = {}) {
        this.route_data = data;
    }

    data() {
        return this.route_data;
    }

    url(data) {
        let url = empty(this.route_data.url) ? '/#!/' : '/#!/' + this.route_data.url;
        for (const [key, value] of Object.entries(data.navigation_data)) {
            url = url.replace('(?' + key.toString() + ')', value.toString());
        }
        return url;
    }

    name(name = '') {
        let self = this;
        let row = gApp.routes.find(item => item.route_data.id == self.route_data.id);
        row.route_data.name = name;
    }

    get_path() {
        let callback = this.route_data.command;

        switch (typeof callback) {
            case "function":
                return callback;
                break;

            case "string":
                let controller_path =gApp.system.paths.controller;
                let namespace = !empty(this.data().namespace) ? this.data().namespace + '/' : '';
                let file = this.data().command;
                callback = controller_path + '/' + namespace + (!empty(file) ? file : 'index') + '.js';
                return callback;
        }
    }

    json() {
        return JSON.stringify(this.route_data);
    }

}

class Router {
    _route_args = {};

    constructor() {
    }

    routeMiddleware(name = '') {
        gApp.routes_middleware = name;
    }

    add(url = '', callback, args = {}) {
        let _args = {};
        Object.assign(_args, this._route_args);
        Object.assign(_args, args);
        let route_item = new RouteItem({
            id: uuid(),
            url: url,
            command: callback,
            ..._args
        });
        this.route(route_item);
        return route_item;
    }

    crud_routes(name = '', crudResource = '') {
        /** list route **/
        this.add(new RouteItem({
            id: uuid(),
            name: name + '.list',
            url: name + '/list',
            command: crudResource + '/list',
            ...this._route_args
        }));
        /** create route **/

        this.add(new RouteItem({
            id: uuid(),
            name: name + '.create',
            url: name + '/create',
            command: crudResource + '/create',
            ...this._route_args
        }));
        /** update route **/

        this.add(new RouteItem({
            id: uuid(),
            name: name + '.update',
            url: name + '/update',
            command: crudResource + '/update',
            ...this._route_args
        }));
    }

    route(route = {}) {
        if (typeof gApp == "undefined") {
            window.gApp = {
                routes: new Array()
            };
        }

        if (!Array.isArray(gApp.routes)) {
            gApp.routes = new Array();
        }

        gApp.routes.push(route);
    }

    find(url = '') {
        let find = null;
        /** check sys routes **/

        if (!empty(gApp.routes) && Array.isArray(gApp.routes)) find = gApp.routes.find(route_item => route_item.route_data.name === url || route_item.route_data.url.match(url));

        if (empty(find)) {
            find = new RouteItem({
                url: url,
                command: url
            });
        }

        return find;
    }

    route_group(args = {}, callback = () => {
    }) {
        let current = Object.create(this._route_args);

        if (!empty(args.namespace) && !empty(current.namespace)) {
            args.namespace = current.namespace + '/' + args.namespace;
        }

        Object.assign(this._route_args, args);
        callback();
        this._route_args = current;
    }

    navigate(route = '', params = {}) {
        window.gApp.current_stack_uuid = uuid();
        this.navigation_params = params;

        let _route = this.find(route);

        _route['id'] = gApp.current_stack_uuid;

        if (!empty(_route.route_data.middleware)) {
            import(APPPATH + gApp.system.paths.middleware + '/' + _route.route_data.middleware + '.js').then(middleware => {
                middleware.default.run(_route, this.do_nav, this.navigation_params);
            }).catch(err => {
                console.log(err.message, 'failed');
            }).then(() => {

            });
        } else {
            this.do_nav(_route, this.navigation_params);
        }
    }

    do_nav(_route = {}, data = {}) {
        /** navigating... **/
        if (_route.id == gApp.current_stack_uuid) {
            new Promise((resolve, reject) => {
                let callback = _route.get_path();
                switch (typeof callback) {
                    case "string":
                        console.log(callback);
                        /** load controller **/
                        import(callback).then(module => {
                            let args = {
                                ..._route,
                                navigation_data: data,
                            }
                            let controller = new module.default().parse(args);
                            args.controller = controller;
                            new Response().render_layout(controller).then(() => {
                                resolve(args);
                            }).catch(err => {
                                reject(err);
                            });
                        });
                        break;

                    case "function":
                        let response = new Component().parse({});

                        response.render = (navigation_data = {}) => {
                            return callback();
                        };

                        new Response().render_layout(response).then(() => {
                            resolve({
                                controller: response
                            });
                        });
                        break;
                }
            }).then(args => {
                /** run controller and update history **/
                new Application()._run(args);
                let new_title = args.controller.title;
                history.pushState({
                    id: Math.random(),
                    command: _route.json()
                }, new_title, _route.url(args));
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

    data() {
        let data_json = document.cookie.split('; ').find(row => row.startsWith('GilaceJS'));
        let app_data = {};

        if (!empty(data_json)) {
            data_json = data_json.split('=')[1];
            app_data = JSON.parse(unescape(data_json));
        }

        return app_data;
    }

}

export { Router };
window.Router = Router;