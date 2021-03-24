#!/usr/bin/env node

/// <reference path="../global.d.ts" />
import http from 'http'
import { empty, resources, parseError } from './dom'
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

    async build() {

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
        /** CHECK FOR NAVIGATION (defined routes) */
        if (!empty(this.navigation)) {
            console.log('1')
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
        }
        else {
            console.log('2' + require.resolve('../../../config/routes'));
            const fs = require('fs');
            const navPath = require.resolve('../../../config/routes');
            if (fs.existsSync(navPath)) {
                console.log('yes');
                this.navigation = (await import(require.resolve(navPath))).default;
                console.log('run server');
                this.runServer();

            } else {
                console.log('no')
            }

        }

    }

    runServer(): void {

        let conf = {
            server: "127.0.0.1",
            port: 3000
        };

        let server = http.createServer(async (req: any, res) => {
            try {
                const { url } = req;
                let route = this.navigation.find(url);
                console.log('request => ' + url + " : " + JSON.stringify(route));
                if (!empty(route)) {
                    req.route = route;
                    let html = await new Request(req).parse({});
                    if (!empty(html)) {
                        console.log('render finished!');
                        new Response(res).write(await new Request(req).parse({}));
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
                        try {
                            if (err) {
                                throw err;
                            }
                            console.log('kajsgdkajhsdjasd');
                            var stream = fs.createReadStream('.' + filePath)
                                .on("open", function () {
                                    res.writeHead(206, {
                                        "Accept-Ranges": "bytes",
                                        "Content-Range": "bytes 0-" + (parseInt(stats.size) - 1) + "/" + stats.size,
                                        "Content-Length": stats.size,
                                        "Content-Type": contentType
                                    });
                                    stream.pipe(res);
                                    console.log('piped');
                                }).on("error", function (err) {
                                    res.end(err);
                                });
                        } catch (err) {
                            /** should return 404 error */
                            res.write(parseError(err));
                            console.log(err);
                        }
                    });
                }
            }
            catch (err) {
                res.write(parseError(err));
                console.log(err);
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