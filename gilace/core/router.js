class routeItem {
    constructor(data = {}) {
        this.route_data = data;
    }

    data() {
        return this.route_data;
    }

    url() {
        return empty(this.route_data.url) ? '' : '/#!/' + this.route_data.url;
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
                let controller_path = APPPATH + gApp.system.paths.controller;
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

export default class Router {
    _route_args = {}

    constructor() {

    }

    routeMiddleware(name = '') {
        gApp.routes_middleware = name;
    }

    route(url = '', callback) {
        let route_item = new routeItem({
            id: uuid(),
            url: url,
            command: callback,
            ...this._route_args
        });
        this.add(route_item);

        return route_item;
    }

    crud_routes(name = '', crudResource = '') {
        /** list route **/
        this.add(new routeItem({
            id: uuid(),
            name: name + '.list',
            url: name + '/list',
            command: crudResource + '/list',
            ...this._route_args
        }));
        /** create route **/
        this.add(new routeItem({
            id: uuid(),
            name: name + '.create',
            url: name + '/create',
            command: crudResource + '/create',
            ...this._route_args
        }));
        /** update route **/
        this.add(new routeItem({
            id: uuid(),
            name: name + '.update',
            url: name + '/update',
            command: crudResource + '/update',
            ...this._route_args
        }));
    }

    add(route = {}) {
        if (typeof gApp == "undefined") {
            window.gApp = {
                routes: new Array()
            }
        }
        if (!Array.isArray(gApp.routes)) {
            gApp.routes = new Array();
        }
        gApp.routes.push(route);
    }

    find(url = '') {
        let find = null;
        /** check sys routes **/
        if (!empty(gApp.routes) && Array.isArray(gApp.routes))
            find = gApp.routes.find(route_item => (route_item.route_data.name === url || route_item.route_data.url === url));

        console.log(find);

        if (empty(find)) {
            find = new routeItem({
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
}

