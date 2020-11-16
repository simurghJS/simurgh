import LayoutManager from "./layoutManager.js";

class Component {
    /** property **/
    title = (!empty(global().title) ? global().title : this.constructor.name);

    constructor(args = {}) {
        if (typeof args == "object") {
            args && Object.assign(this, args);
        }
    }

    /** functions **/
    render(navigation_data = {}) {
        return null;
    }
    on_rendered() {

    }
    async component_ready() {

    }
    /** sdff **/
    async run(navigation_data) {

        let response = await this.render(navigation_data);
        if (!empty(response)) {
            switch (typeof response) {
                case "string":
                    await new LayoutManager().render_html(response);
                    break;
                case "object":
                    let html = await response.render();
                    console.log(html);
                    await new LayoutManager().render_html(html);
                    break;
                default:
                    break;
            }
        }
        this.navigation_data = navigation_data;
        this.on_rendered();
        $('._loader').fadeOut(500);
    }

    forceUpdate() {
        this.run(this.navigation_data);
    }
}

export default Component;