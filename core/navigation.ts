/// <reference path="./application.ts" />

import { Application } from './application'
import { render } from './render'
import { empty } from "./dom"
import { v4 as uuidv4 } from 'uuid'
import { Response } from "./response"

export class RouteItem {
    route_data: route_data
    constructor(data) {
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

        //let self = this;
        //let row = this.routes.find(item => item.route_data.id == self.route_data.id);
        //row.route_data.name = name;
    }

    get_path(): any {
        let callback = this.route_data.command;

        switch (typeof callback) {
            case "function":
                return callback;
            case "string":
                let controller_path = "";
                let namespace = !empty(this.data().namespace) ? this.data().namespace + '/' : '';
                let file = this.data().command;
                callback = (!empty(controller_path) ? controller_path + '/' : '') + namespace + (!empty(file) ? file : 'index');
                return callback;
        }
    }

    json() {
        return JSON.stringify(this.route_data);
    }

}

export class StackNavigation {
    _route_args = {}
    navigation_params = {}
    routes = new Array()
    current_stack_uuid: string

    routeMiddleware(name = '') {
        // simurgh.routes_middleware = name;
    }

    add(url = '', callback, args = {}) {
        let _args = Object.create(this._route_args);
        Object.assign(_args, args);
        let route_item = new RouteItem({
            id: uuidv4(),
            url: url,
            command: callback,
            ..._args
        });
        this.routes.push(route_item);
        return route_item;
    }

    find(url = ''): RouteItem {
        let find = null;
        /** check sys routes **/

        if (!empty(this.routes) && Array.isArray(this.routes)){
         find = this.routes.find(route_item => route_item.route_data.name === url || route_item.route_data.url.match(url));
        }

        return find;
    }

    group(callback: Function, args: route_data) {
        let current = Object.create(this._route_args);
        Object.assign(this._route_args, args);
        callback();
        this._route_args = current;
    }

    navigate(route = '', params = {}) {
        this.current_stack_uuid = uuidv4();
        this.navigation_params = params;

        let _route = this.find(route);

        _route.route_data.id = this.current_stack_uuid;

        if (!empty((_route.route_data as any).middleware)) {
            import('/' + 'app/middleware' + '/' + (_route.route_data as any).middleware + '.js').then(middleware => {
                middleware.default.run(_route, this.do_nav, this.navigation_params);
            }).catch(err => {
                console.log(err.message, 'failed');
            }).then(() => {

            });
        } else {
            if (!empty(_route)) {
                this.do_nav(_route, this.navigation_params);
            } else {
                console.log('error => route not found');
            }
        }
    }

    do_nav(_route: RouteItem, data = {}) {
        console.log('navigating to (uuid : ' + this.current_stack_uuid + ') =>');
        console.log(JSON.stringify(_route));
        if (_route.route_data.id == this.current_stack_uuid) {
            new Promise((resolve, reject) => {
                let callback = _route.get_path();
                switch (typeof callback) {
                    case "string":
                        console.log('loading controller => ' + 'app/http/' + callback);
                        /** load controller **/

                        import(require.resolve('app/http/' + callback)).then(module => {
                            let args = {
                                ..._route,
                                controller: {},
                                navigation_data: data,
                            }
                            let controller = new module.default().parse(args);
                            args.controller = controller;
                            new Response().render_layout(controller).then(() => {
                                resolve(args);
                            }).catch(err => {
                                /** should return 404 error instead... **/
                                throw err;
                            });
                        });
                        break;

                    case "function":
                        let responseOBJ = (callback as Function)();
                        render(responseOBJ, data).then(html => new Response().write(html));
                        break;
                }
            }).then(args => {
                /** run controller and update history **/
                new Application()._run(args);
                let new_title = (args as any).controller.title;
                history.pushState({
                    id: Math.random(),
                    command: _route.json()
                }, new_title, _route.url(args));
                localStorage.setItem('current_stack', _route.json());
            }).catch(err => {
                /** log error **/
                console.log(err.message, 'failed');
            }).finally(() => {
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
}

export function CreateStackNavigation(): StackNavigation {
    return new StackNavigation();
}