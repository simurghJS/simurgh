/// <reference path="../global.d.ts" />
import http from 'http'
import { empty, resources, parseError, show_404 } from './dom'
import Component from './component'
import { JSDOM } from "jsdom"
const { document, window } = (new JSDOM()).window;
import { Request } from './request'
import { Response } from './response'

export const simurgh: simurgh = {
    config: {
        constants: new Map(),
        global: {
            dependencies: new Array(),
            jquery: true,
            bootstrap: true,
            rtl: true,
            layout: ""
        },
        navigation: {
            default_route: '',
            drawer_navigation: {}
        },
        domain: 'localhost:3000'
    },
    system: {
        paths: {
            controller: "",
            middleware: ""
        }
    },
}

export class Application {
    navigation_data: Object
    public get constant() { return simurgh.config.constants }
    public get dependencies() { return simurgh.config.global.dependencies }
    public get navigation() { return simurgh.config.navigation.routes }

    public set navigation(value: any) {
        simurgh.config.navigation.routes = value;
    }

    build(): void {

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

        for (let dependency of simurgh.config.global.dependencies) {
            dep.push(resources(dependency));
        }
        /** load app constants **/

        for (let [key, value] of Object.entries(simurgh.config.constants)) {
            window[key.toString()] = value;
        }

        /* if (!empty(args.route_data) && !empty(args.route_data.dependencies) && Array.isArray(args.route_data.dependencies)) {
          await new loader().load(args.route_data.dependencies);
      }*/
        if (!empty(this.navigation)) {
            console.log('navigation registered as :' + (typeof this.navigation));
            switch (typeof this.navigation) {
                case "object":
                    this.runServer();
                    break;
                case "function":
                    (this.navigation as Function)();
                    this.runServer();
                    break;
                case "string":
                    import('/' + this.navigation).then(() => {
                    }).catch(err => {
                        console.log(err);
                    }).then(() => {
                        this.runServer();
                    });
                    break;
                default:
                    break;
            }
        } else {
            this.runServer();
        }
    }

    runServer(): void {

        let conf = {
            server: "127.0.0.1",
            port: 3000
        };

        let server = http.createServer(async (req: any, res) => {
            const { url } = req;
            let route = this.navigation.find(url);
            console.log('request => ' + url + " : " + JSON.stringify(route));
            if (!empty(route)) {
                try {
                    req.route = route;
                    let html = await new Request(req).parse({});
                    if (!empty(html)) {
                        console.log('render finished!');
                        new Response(res).write(await new Request(req).parse({}));
                    }

                }
                catch (err) {
                    res.write(parseError(err));
                    console.log(err);
                }
                res.end();
            }
            else {
                console.log('request starting...');
                var fs = require('fs');
                var path = require('path');
                var filePath = req.url;
                if (filePath == './')
                    filePath = './index.html';

                var extname = path.extname(filePath);
                var contentType = 'text/html';
                switch (extname) {
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.json':
                        contentType = 'application/' + extname.replace('.', '');
                        break;
                    case '.png':
                    case '.jpg':
                        contentType = 'image/' + extname.replace('.', '');
                        break;
                    case '.mp4':
                        contentType = 'video/' + extname.replace('.', '');
                        break;
                }

                fs.stat('.' + filePath, function (err, stats) {
                    if (err) {
                        res.end(err);
                    }


                    var stream = fs.createReadStream('.' + filePath)
                        .on("open", function () {
                            res.writeHead(206, {
                                "Accept-Ranges": "bytes",
                                "Content-Range": "bytes 0-" + (parseInt(stats.size) - 1) + "/" + stats.size,
                                "Content-Length": stats.size,
                                "Content-Type": contentType
                            });
                            stream.pipe(res);
                        }).on("error", function (err) {
                            res.end(err);
                        });
                });
            }
        });

        server.listen(conf.port, conf.server, () => {
            console.log(`server started succesfully`);
            console.log(`open http://${conf.server}:${conf.port}/ in your browser`);
        });
    }

    getConstant(name: string) {
        let found = Object.entries(simurgh.config.constants).find(row => row[0] == name);
        if (!empty(found)) {
            return found[1];
        }
        return null;
    }

    async _run(args) {
        /* if (!empty(args.route_data) && !empty(args.route_data.dependencies) && Array.isArray(args.route_data.dependencies)) {
             await new loader().load(args.route_data.dependencies);
         }*/
        await args.controller.component_did_mount(args);
        let result = await args.controller.render(args);

        if (!empty(result)) {
            let html = {};
            html = await render(result, args);
            console.log(html);
            await args.controller.write(html);
            if (args.component_ready.length > 0) {
                args.component_ready.forEach((callback => {
                    callback();
                }))
            }
            this.navigation_data = args;
        }
    }

    registerDrawerNavigation(navigation = {}) {
        simurgh.config.navigation.drawer_navigation = navigation;
    }

    set_layout(path = '') {
        simurgh.config.global.layout = path;
    }

    enable_jquery(status = true) {
        simurgh.config.global.jquery = status;
    }

    enable_bootstrap(status = true) {
        simurgh.config.global.bootstrap = status;
    }

    forceRTL() {
        simurgh.config.global.rtl = true;
    }

}

export function createElement(type: any, props, ...children) {
    console.log('******************create element');
    console.log('type');

    console.log(type);

    let el = {
        type: (typeof type == "string") ? (class htmlComponent extends Component {
            constructor() {
                super();
                this.tagName = type;
            }
        }) : type,
        props: {
            ...props,
            children: children.map((child) => {
                console.log('child=>');

                console.log(child);
                console.log(JSON.stringify(child));
                return typeof child == "string" ? {
                    type: (class htmlComponent extends Component {
                        constructor() {
                            super();
                            this.tagName = 'span';
                        }
                    }),
                    props: {
                        nodeValue: child,
                        children: []
                    }
                } : child

            })
        }
    };
    console.log('el=>');
    console.log(el);
    console.log(JSON.stringify(el));
    console.log('******************END create element');

    return el;
}

export async function render(obj, args) {
    console.log('***render =>***');
    let _do = true;
    let res = obj;
    console.log('obj');
    console.log(JSON.stringify(obj));
    console.log('children');
    console.log(JSON.stringify(obj.props.children));

    do {
        res = await _do_render(res, args);
        if (typeof res == "string" || res instanceof window.HTMLElement) {
            _do = false;
            break;
        }
    } while (_do == true)
    console.log("res.outerHTML=>");
    console.log(res);
    return res;
}

export async function _do_render(obj, args) {
    console.log('***do_render***');
    console.log(obj);

    let html = '';

    if (obj instanceof window.HTMLElement) {
        return obj;
    }
    if (typeof obj == "object") {
        if (typeof obj.type == "function") {
            let _obj = obj;
            if (!empty(obj.type.constructor) && !(obj.type.constructor.prototype instanceof Component)) {
                _obj = new obj.type().parse(args);
                console.log(_obj);
            }
            await _obj.component_did_mount(args);
            _obj.props = obj.props;
            html = ((await _obj.render(args)) as any).outerHTML;
            console.log('html=>');
            let a = document.createElement('a');
            a.textContent = 'ajshdg';
            console.log(a.outerHTML);
            console.log((html as any).outerHTML);

        } else {
            return html;
        }
    }
    return html;
}

export default Application;