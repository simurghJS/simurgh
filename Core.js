import './Dom.js';

/*******************************

--------------------------------------------------------------------------
   Simurgh Application
--------------------------------------------------------------------------

  Application & dom (global function & class & ...)

*******************************/

const system = {
    paths: {
        controller: '/app',
        middleware: '/middleware',
        views: '/resources/views'
    }
};

class Application {
    api_url = '';
    title = '';
    title_prefix = '';
    dependencies = [];
    drawer_navigation = Component;
    routes = [];
    constants = [];
    jquery = true;
    bootstrap = true;
    rtl = false;

    constructor() {
    }

    define(name = '', value = '') {
        this.constants[name] = value;
    }

    registerDrawerNavigation(navigation = {}) {
        this.drawer_navigation = navigation;
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
        this.bootstrap = status;
    }

    forceRTL() {
        this.rtl = true;
    }

    registerRoutes(callback = '') {
        this.routes = callback;
    }

    import_shortcuts() {
        window.addEventListener('keyup', ev => {
            if (ev.key == 'Escape') {
                window.history.back();
            }
        });
    }

    build() {
        /** register global variables **/
        let app_url = !empty(this.api_url) ? new URL(this.api_url) : '';

        if (typeof gApp == "undefined") {
            window.gApp = {};
        }

        gApp.global = {
            layout: this.layout,
            app_title: this.title,
            title_prefix: this.title_prefix,
            prefix_separator: ' | '
        };
        gApp.drawer_navigation = this.drawer_navigation;
        gApp.default_route = '';
        gApp.domain = !empty(app_url) ? app_url.protocol + '//' + app_url.hostname : '';
        gApp.system = {
            ...system
        };
        window.APPPATH = window.location.protocol + '//' + window.location.hostname;
        window.BASEURL = this.api_url;
        window.ASSETSPATH = !empty(app_url) ? app_url.protocol + '//' + app_url.hostname + '/' : '';
        /** load dependencies **/

        let dep = [];

        if (this.jquery) {
            dep.push('../../node_modules/jquery/dist/jquery.min.js');
        }

        if (this.bootstrap) {
            dep.push(APPPATH + '/node_modules/bootstrap/dist/css/bootstrap.css');
            dep.push(APPPATH + '/node_modules/bootstrap/dist/js/bootstrap.min.js');
            dep.push('/node_modules/popper.js/dist/popper.min.js');
            dep.push(APPPATH + '/node_modules/font-awesome/css/font-awesome.min.css');
        }

        if (this.rtl) {
            dep.push(APPPATH + '/Application/src/rtl.css');
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
            $('#msg').html('msgasd');
        }).catch(err => {
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
                        }).catch(err => {
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


        });
    }

    run() {
        window.Simurgh = this;
        let url = window.location.hash.replace('#!/', '');
        new Router().navigate(url);
    }

    createElement(type, props, ...children) {
        return {
            type: (typeof type == "string") ? (class htmlComponent extends Component {
                tagName = type
            }) : type,
            props: {
                ...props,
                children: children.map((child) => {

                    return typeof child === "object" ? child : {
                        type: class htmlComponent extends Component {
                            tagName = 'span'
                        },
                        props: {
                            nodeValue: child,
                            children: []
                        }
                    }

                })
            }
        };
    }

    async _run(args) {
        if (!empty(args.route_data) && !empty(args.route_data.dependencies) && Array.isArray(args.route_data.dependencies)) {
            await new loader().load(args.route_data.dependencies);
        }
        await args.controller.component_did_mount(args);
        let result = await args.controller.render(args);

        if (!empty(result)) {
            let html = {};
            html = await this.render(result, args);
            console.log(html);
            await new Response().write(html);
            if (args.component_ready.length > 0) {
                args.component_ready.forEach((callback => {
                    callback();
                }))
            }
            this.navigation_data = args;
        }
    }

    async render(obj, args) {
        let _do = true;
        let res = obj;
        do {
            res = await this._do_render(res, args);
            if (typeof res == "string" || res instanceof HTMLElement) {
                _do = false;
                break;
            }
        } while (_do == true)
        return res;
    }

    async _do_render(obj, args) {
        let html = '';

        if (obj instanceof HTMLElement) {
            return obj;
        }
        if (typeof obj == "object") {
            if (typeof obj.type == "function") {
                let _obj = obj;
                if (!empty(obj.type.constructor) && !(obj.type.constructor.prototype instanceof Component)) {
                    _obj = new obj.type().parse(args);
                }
                await _obj.component_did_mount(args);
                _obj.props = obj.props;
                html = await _obj.render(args);
            } else {
                return html;
            }
        }
        return html;
    }
}

/** response **/
class Response {
    components = [];

    constructor() {
    }

    async render_layout(args = {}) {
        let html = '';
        let layout = typeof args.layout == "undefined" ? empty(global().layout) ? '' : global().layout : args.layout;
        console.log(layout);

        if (!empty(layout)) {
            let html_view = new (await import('./components.js')).HtmlView();
            html_view.props.src = layout;
            html = await html_view.render();
            console.log(html);
        }
        document.title = args.title;
        args.component_ready = [];
        let drawer_wrapper = $(html).find("div[gilace-rel=drawer_navigation]");
        if (!empty(drawer_wrapper.toArray()) && !empty(gApp.drawer_navigation)) {
            let _drw = new gApp.drawer_navigation();
            _drw.parse(args);
            let drw = await new Application().render(await _drw.render(args), args);
            $(html).find("div[gilace-rel=drawer_navigation]").html(drw);
        }
        document.body.innerHTML = "";
        this.write(html);
        if (args.component_ready.length > 0) {
            args.component_ready.forEach((callback => {
                callback();
            }))
        }
    }

    write(html = ``, wrapper = '') {

        if (empty(wrapper)) {
            if ($("div[gilace-rel=response]").length == 1) {
                wrapper = "div[gilace-rel=response]";
            } else {
                wrapper = document.body
            }
        }
        switch (typeof wrapper) {
            case "string":
                $(wrapper).html(html);
                break;
            case "object":
                console.log(html);
                console.log(wrapper);
                $(wrapper).append(html);
                break;
        }
    }

    /** functions **/

    render(navigation_data = {}) {
        return null;
    }

    on_rendered() {
    }

    createElement(type, props, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children.map(child => typeof child === "object" ? child : {
                    type: "Text",
                    props: {
                        nodeValue: child,
                        children: []
                    }
                })
            }
        };
    }

}

/** response **/
class Request {
    constructor(url = '') {
        this.api_url = url;
    }

    async get() {
        return await this.send();
    }

    async delete() {
        return await this.send({
            method: 'DELETE'
        });
    }

    async put(data = {}) {
        data._method = 'PUT';
        return await this.send({
            data: data,
            method: 'POST'
        });
    }

    async patch(data = {}) {
        return await this.send({
            data: data,
            method: 'PATCH'
        });
    }

    async post(data = {}) {
        return await this.send({
            data: data
        });
    }

    guard(title = '', onAccess_handler = () => {
    }) {
        alert(title, 'warning', {
            showCancelButton: true,
            type: 'warning',
            confirmButtonClass: "btn-danger",
            cancelButtonText: 'خیر',
            confirmButtonText: 'بلی'
        }, () => {
            if (typeof onAccess_handler == "function") {
                onAccess_handler();
            }
        });
    }

    send(args = {}) {
        let url = this.api_url;
        let _method = 'GET';
        let req_args = new Object();

        if (!empty(args.data)) {
            _method = 'POST';
            let formData = new FormData();

            for (const [key, value] of Object.entries(args.data)) {
                formData.append(key, value);
            }

            req_args.body = formData;
        }

        req_args.method = !empty(args.method) ? args.method : _method;

        switch (req_args.method) {
            case "POST":
                req_args.encrypt = "multipart/form-data";
                break;

            case "PUT":
                req_args.encrypt = 'application/x-www-form-urlencoded';
                break;

            default:
                break;
        } // req_args.mode = 'cors';
        // let auth = new Auth().get_authorization();


        let req_url = url;
        /*  req_args.headers = new Headers({
              'Authorization': (!empty(auth) ? btoa(auth) : '')
          });*/

        /** make request **/

        return fetch(req_url, req_args).then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw response;
            }
        }).catch(error => {
            console.log(error);
            return Promise.reject();
        });
    }

}

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

/** you should extends this class **/
class Component extends Response {
    /** property **/
    title = !empty(global().title) ? global().title : this.constructor.name;
    tagName = 'div'
    props = {
        style: {},
        className: ''
    }
    state = {}

    parse(args = {}) {

        if (typeof args == "object") {
            args && Object.assign(this, args);
            if (!empty(args.route_data) && !empty(args.route_data.layout)) {
                this.layout = args.route_data.layout;
            }
        }
        if (args != undefined && !empty(args.component_ready)) {
            args.component_ready.push(this.on_rendered.bind(this));
        } else {
            args.component_ready = new Array();
            args.component_ready.push(this.on_rendered.bind(this));
        }
        return this;
    }

    async component_ready() {
        await this.on_rendered();

    }

    async component_did_mount(navigation_data) {
    }

    setState(data = {}) {
        this.state = data;
    }

    async render(navigation_data) {
        let element = document.createElement(this.tagName);
        element = this.render_props(element, navigation_data);
        return element;
    }

    async render_props(element, navigation_data) {
        for (const [key, value] of Object.entries(this.props)) {
            switch (key) {
                case 'children':
                    for (let child of value) {
                        let obj = new child.type().parse(navigation_data);
                        await obj.component_did_mount(navigation_data);
                        obj.props = child.props;
                        obj.parent = this;
                        element.append(await obj.render(navigation_data));
                    }
                    break;
                case 'className':
                    value.split(' ').map((cls) => {
                        element.classList.add(cls);
                    });
                    break;
                case 'nodeValue':
                    element.innerText = value.toString();
                    break;
                case 'style':
                    for (const [style_key, style_value] of Object.entries(value)) {
                        element.style[style_key] = style_value;
                    }
                    break;
                default:
                    element.setAttribute(key, value.toString());
                    break;
            }
        }
        return element;
    }

    forceUpdate() {
        this.run(this.navigation_data);
    }
}

export {Application, Component, Response, Request, Router};

window.Component = Component;
window.Router = Router;
