export default class RouteItem {
    constructor(data = {}) {
        this.route_data = data;
    }

    data() {
        return this.route_data;
    }

    url() {
        return empty(this.route_data.url) ? '/#!/' : '/#!/' + this.route_data.url;
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