class routeItem {
    constructor(data = {}) {
        this.route_data = data;
        console.log(data);
    }

    data() {
        return this.route_data;
    }

    url() {
        return '/#!/' + this.route_data.url;
    }

    name(name = '') {
        let  self=this;
        let row = SYS_ROUTES.find(item => item.route_data.id == self.route_data.id);
        row.route_data.name = name;

        console.log(SYS_ROUTES);
    }

    get_path() {

        let path = this.route_data.command == 'auto-crud' ?
            APPPATH + 'application/models/' + this.data().model_name + '.js' :
            APPPATH + 'application/controllers/'
            + (!empty(this.data().namespace) ?
            this.data().namespace + '/' : '')
            + this.data().command + '.js';
        return path;
    }

    json() {
        return JSON.stringify(this.route_data);
    }
}

export default class Router {
    _route_args = {}

    constructor() {
        window.SYS_ROUTES_MIDDLEWARE = '';
        window.SYS_ROUTES = [];
    }

    routeMiddleware(name = '') {
        window.SYS_ROUTES_MIDDLEWARE = name;
    }

    route(url = '', path = '') {

        let route_item = new routeItem({
            id: uuid(),
            url: url,
            command: path,
            ...this._route_args
        });
        this.add(route_item);

        return route_item;
    }
    crud_routes(name = '', crudResource = '') {
        /** list route **/
        this.add(new routeItem({
            id: uuid(),
            url: name+'/list',
            command: crudResource+'/list.js',
            ...this._route_args
        }));
        /** create route **/
        this.add(new routeItem({
            id: uuid(),
            url: name+'/create',
            command: crudResource+'/create.js',
            ...this._route_args
        }));
        /** update route **/
        this.add(new routeItem({
            id: uuid(),
            url: name+'/update',
            command: crudResource+'/update.js',
            ...this._route_args
        }));
    }

    add(route = {}) {
        if (!empty(SYS_ROUTES) && !Array.isArray(SYS_ROUTES)) {
            window.SYS_ROUTES = new Array();
        }
        SYS_ROUTES.push(route);
    }

    find(url = '') {
        let find = null;
        /** check sys routes **/
        if (!empty(SYS_ROUTES) && Array.isArray(SYS_ROUTES))
            find = SYS_ROUTES.find(route_item => (route_item.route_data.name === url || route_item.route_data.url === url));

        if (empty(find)) {
            switch (url) {
                case "":
                case "/":
                case "index":
                    find = new routeItem({
                        url: '',
                        command: 'index'
                    });
                    break;
                default:
                    find = new routeItem({
                        url: url,
                        command: url
                    });
                    break;
            }
        }
        return find;
    }

    route_group(args = {}, callback = () => {
    }) {
        let current = this._route_args;

        if(!empty(args.namespace)&&!empty(current.namespace)) {
            args.namespace = current.namespace + '/' + args.namespace;
        }

        Object.assign(this._route_args, args);
        callback();
        this._route_args = current;
    }
}

