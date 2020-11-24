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
        if (!empty(this.route_data.dependencies) && Array.isArray(this.route_data.dependencies)) {
            await new loader().load(this.route_data.dependencies);
        }
        let result = await this.render(navigation_data);
        if (!empty(result)) {
            switch (typeof result) {
                case "string":
                    await new Response().write(result);
                    break;
                case "object":

                    let html = await result.render();

                    console.log(html);

                    await new Response().write(html);

                    break;
                default:
                    break;
            }
        }
        this.navigation_data = navigation_data;
        this.component_ready();
        $('._loader').fadeOut(500);
    }

    forceUpdate() {
        this.run(this.navigation_data);
    }
}

window.Component = Component;
export default Component;