import { render } from './render'
import { empty } from './dom'

class Request {
    request: any
    app: any
    route: any
    constructor(app: any, req?: any, args?: any) {
        this.app = app;
        this.request = req;

        /**auto nav */
        if (empty(this.app.navigation)) {
            console.log('user auto routing for '+this.getURL());
            const { CreateStackNavigation } = require('./navigation');
            app.navigation = CreateStackNavigation();
            app.navigation.add(this.getURL(), this.getURL() + '/index');
        }
        this.route = app.navigation.find(this.getURL());
    }



    async render(data: any) {
        let callback = this.route.get_path();
        let html = '';
        console.log('response registered as : ' + typeof callback)
        switch (typeof callback) {
            case "string":

                console.log('loading controller => ' + 'app/http/' + callback);
                let module = await import(require.resolve('../../../app/http/' + callback));
                let args = {
                    ...this.route,
                    controller: {},
                    navigation_data: data,
                }
                let controller = new module.default().parse(args);
                args.controller = controller;
                html = await render(await controller.render(args), this.route.data);

                break;
            case "function":

                let responseOBJ = (callback as Function)();
                html = await render(responseOBJ, this.route.data);

                break;
        }
        return html;
    }

    getURL(): String {
        const { url } = this.request;
        return url;
    }

    isRenderable(): boolean {
        let path = require('path');
        if (empty(path.extname(this.getURL())) && !empty(this.route)) {
            return true;
        }
        return false;
    }
}
export { Request }