import Response from "./Response.js";

class Component extends Response {
    /** property **/
    title = (!empty(global().title) ? global().title : this.constructor.name);

    constructor(args = {}) {
        super();
        if (typeof args == "object") {
            args && Object.assign(this, args);
        }
        if (!empty(args.route_data) && !empty(args.route_data.layout)) {
            this.layout = args.route_data.layout;
        }
    }


    async component_ready() {
        await this.on_rendered();
        $('[gilace-navigate]').unbind('click');
        $('[gilace-navigate]').click((ev) => {
            let navigate_to = $(ev.currentTarget).attr('gilace-navigate');
            new Router().navigate(navigate_to);
        });
    }


    /** sdff **/
    async run(navigation_data) {
        if (
            !empty(this.route_data) &&
            !empty(this.route_data.dependencies) &&
            Array.isArray(this.route_data.dependencies)
        ) {
            await new loader().load(this.route_data.dependencies);
        }

        let result = await this.render(navigation_data);

        if (!empty(result)) {
            let html = ``;
            switch (typeof result) {
                case "string":
                    html = result;
                    break;
                case "object":
                    html = await result.render();
                    break;
                default:
                    break;
            }
            await new Response().write(html);
        }

        this.navigation_data = navigation_data;
        this.component_ready();
    }

    forceUpdate() {
        this.run(this.navigation_data);
    }
}

window.Component = Component;
export default Component;