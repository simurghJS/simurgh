import http from 'http'
import { empty, resources } from "./dom"
import { CreateStackNavigation, RouteItem } from './navigation'
import { simurgh, Application, render } from './application'

class Response {
    response: any
    constructor(res?: any) {
        this.response = res;
    }

    async render_layout(args: any) {
        let html = '';
        let layout = typeof args.route_data.layout == "undefined" ? empty(simurgh.config.global.layout) ? '' : simurgh.config.global.layout : args.route_data.layout;
        console.log(layout);

        if (!empty(layout)) {
            /*
               let html_view = new (await import('/node_modules/simurgh-bootstrap/components.js')).HtmlView();
               html_view.props.src = layout;
               html = await html_view.render();
               console.log(html); 
           */
        }
        document.title = args.title;
        args.component_ready = [];
        /*   
             let drawer_wrapper = $(html).find("div[gilace-rel=drawer_navigation]");
                 if (!empty(drawer_wrapper.toArray()) && !empty(gApp.drawer_navigation)) {
                 let _drw = new gApp.drawer_navigation();
                 _drw.parse(args);
                 let drw = await new Application().render(await _drw.render(args), args);
                 $(html).find("div[gilace-rel=drawer_navigation]").html(drw);
             }
         */
        document.body.innerHTML = "";
        this.write(html);
        if (args.component_ready.length > 0) {
            args.component_ready.forEach((callback => {
                callback();
            }))
        }
    }

    write(html = ``, wrapper?: any) {
        let res = this.setheader(this.response);
        html = "<html><head></head><body>" + html + "</body></html>";
        res.write(html);
    }

    async render(url: string, params?: any) {
        let nav = new CreateStackNavigation();
        let _route = nav.find(url);
        console.log(JSON.stringify(_route));
        let html = '';
        if (!empty((_route.route_data as any).middleware)) {
            import('/' + simurgh.system.paths.middleware + '/' + (_route.route_data as any).middleware + '.js').then(middleware => {
                middleware.default.run(_route, this.do_nav, params);
            }).catch(err => {
                console.log(err.message, 'failed');
            }).then(() => {

            });
        } else {
            if (!empty(_route)) {
                html = await this.do_nav(_route, params);
            } else {
                console.log('error => route not found');
            }
        }
        return html;
    }

    async do_nav(_route: RouteItem, data = {}) {
        console.log(JSON.stringify(_route));

        let callback = _route.get_path();
        let html = '';
        console.log('response registered as : ' + typeof callback)
        switch (typeof callback) {
            case "string":
                /*console.log(callback);
                import(callback).then(module => {
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
                        reject(err);
                    });
                });*/
                break;

            case "function":
                let responseOBJ = (callback as Function)();
                html = await render(responseOBJ, data);
                break;
        }
        return html;
        /*.then(args => {
            new Application()._run(args);
            let new_title = (args as any).controller.title;
            history.pushState({
                id: Math.random(),
                command: _route.json()
            }, new_title, _route.url(args));
            localStorage.setItem('current_stack', _route.json());
        })
        .catch(err => {
            console.log(err.message, 'failed');
        })
        .finally(() => {
        });*/
    }



    setheader(response) {
        response.statusCode = 200;
        response.setHeader('charset', 'utf-8');
        response.setHeader('Content-Type', 'text/html');
        return response;
    }

    /*  createElement(type, props, ...children) {
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
      }*/

}
export { Response }