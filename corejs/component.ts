/** you should extends this class **/
class Component extends Response {
    /** property **/
    title = !empty(global().title) ? global().title : this.constructor.name;
    tagName = 'div'
    props = {
        style: {},
        className: ''
    }
    state = {}

    parse(args = {}) {

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
        element = this.render_props(element, navigation_data);
        return element;
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
                    value.split(' ').map((cls) => {
                        element.classList.add(cls);
                    });
                    break;
                case 'nodeValue':
                    element.innerText = value.toString();
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
        this.run(this.navigation_data);
    }
}
export { Component };
window.Router = Router;