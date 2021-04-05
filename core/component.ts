/// <reference path="./application.ts" />

import { empty } from "./dom"
import { JSDOM } from "jsdom"

const { document } = (new JSDOM()).window;

export class Component implements _component {

    tagName = 'div'
    layout?: string
    state?: Object
    props?: Object
    components?: Array<Component>;


    parse(args: any) {

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
        element = await this.render_props(element, navigation_data);
        return element;
    }

    on_rendered() {

    }

    async render_props(element, navigation_data) {
        for (const [key, value] of Object.entries(this.props)) {
            switch (key) {
                case 'children':
                    for (let child of value) {
                        if (!empty(child)) {
                            let obj = new child.type().parse(navigation_data);
                            await obj.component_did_mount(navigation_data);
                            obj.props = child.props;
                            obj.parent = this;
                            element.append(await obj.render(navigation_data));
                        } else {
                            console.log('childe null!')
                        }
                    }
                    break;
                case 'className':
                    value.toString().split(' ').map((cls) => {
                        element.classList.add(cls);
                    });
                    break;
                case 'nodeValue':
                    element.textContent = value.toString();
                   
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
        // this.run(this.navigation_data);
    }
}
export default Component