const {Router} =require("./navigation.ts")
const { Component }= require( "./component")
const { Response } =require("./response")


declare global {
    const simurgh: {
        config: __CONFIG
    }
}

class Application {
    
    constructor() {
        simurgh.config = {
            constants: new Map(),
            global: {
                dependencies: new Array(),
                jquery: true,
                bootstrap: true,
                rtl: true,
                layout: null
            },
            navigation: {
                routes: new Array(),
                default_route: '',
                drawer_navigation: null
            },
            domain: !empty(window.location) ? window.location.protocol + '//' + window.location.hostname : '',
        }

    }
    public get constant() { return simurgh.config.constants }
    public get dependencies() { return simurgh.config.global.dependencies }
    public get routes() { return simurgh.config.navigation.routes }

    build() {

        

        let dep = [];

        if (simurgh.config.global.jquery) {
            dep.push('../../node_modules/jquery/dist/jquery.min.js');
        }

        if (simurgh.config.global.bootstrap) {
            dep.push('/node_modules/bootstrap/dist/css/bootstrap.css');
            dep.push('/node_modules/bootstrap/dist/js/bootstrap.min.js');
            dep.push('/node_modules/popper.js/dist/popper.min.js');
            dep.push('/node_modules/font-awesome/css/font-awesome.min.css');
        }

        if (simurgh.config.global.rtl) {
            dep.push('/node_modules/simurgh/src/rtl.css');
        }

        for (let dependency of this.dependencies) {
            dep.push(resources(dependency));
        }
        /** load app constants **/

        for (let [key, value] of Object.entries(simurgh.config.constants)) {
            window[key] = value;
        }

        new loader().load(dep).then(() => {
        }).catch(err => {
            console.log('cannot load some dependencies! read logs');
            console.log(err);
        }).then(() => {
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

    /*registerDrawerNavigation(navigation = {}) {
       simurgh.config.navigation.drawer_navigation = navigation;
   }*/
    /* set_layout(path = '') {
          simurgh.config.global.layout = path;
      }*/
    /* enable_jquery(status = true) {
         simurgh.config.global.jquery = status;
     }
 
     enable_bootstrap(status = true) {
         simurgh.config.global.bootstrap = status;
     }
 
     forceRTL() {
         simurgh.config.global.rtl = true;
     }*/

}

export default Application;