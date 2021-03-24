import { render } from './render'
import { empty } from './dom'

class Request {
    request: any
    constructor(req?: any, args?: any) {
        this.request = req;
        let route = this.request.route;
        console.log(route);
        if (!empty(route.data) && !empty((route.data as any).middleware)) {

            //start loading middleware....

        }
    }

    async parse(data: any) {
        let callback = this.request.route.get_path();
        let html = '';
        console.log('response registered as : ' + typeof callback)
        switch (typeof callback) {
            case "string":

                console.log('loading controller => ' + 'app/http/' + callback);
                let module = await import(require.resolve('../../../app/http/' + callback));
                let args = {
                    ...this.request.route,
                    controller: {},
                    navigation_data: data,
                }
                let controller = new module.default().parse(args);
                args.controller = controller;
                html = await render(await controller.render(args), this.request.route.data);

                break;
            case "function":

                let responseOBJ = (callback as Function)();
                html = await render(responseOBJ, this.request.route.data);

                break;
        }
        return html;
    }
}
export { Request }