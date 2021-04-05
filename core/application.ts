#!/usr/bin/env node
/// <reference path="../global.d.ts" />

import { empty } from './dom'

export class Application {

    conf: simurgh = {
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

    public get navigation() { return this.conf.config.navigation.routes }
    public set navigation(value: any) { this.conf.config.navigation.routes = value; }

    /**register & run application */
    async register() {
        console.log('check for routing');
        await this.parseAppRoutes();
        console.log('navigation inited');
        const { Server } = require('./server');
        (new Server()).run(this);

    }

    /**parse application routes & assign it to this object*/
    async parseAppRoutes() {
        if (!empty(this.navigation) && typeof this.navigation == "function") {
            (this.navigation as Function)();
            console.log('navigation inited dynamiclly')
        }
        else {
            const fs = require('fs');
            const navPath = require.resolve('../../../config/routes');
            console.log(navPath);
            if (fs.existsSync(navPath)) {
                this.navigation = (await import(require.resolve(navPath))).default;
                console.log('parsed => config/routes');
            }else{
                console.log('navigation not found');
            }
        }
    }
}