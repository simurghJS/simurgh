import Navigation from "./Navigation.js";

class LayoutManager {
    components = []

    constructor() {
    }

    async render_layout(app = {}) {
        this.request = app;

        console.log('creating layout for =>');
        console.log(this.request);

        let html = await this.createAppLayout(app);

        $('#application_wrapper').html(html);

        document.title = app.title;

        let drawer_wrapper = $("div[gilace-rel=drawer_navigation]");
        if (!empty(drawer_wrapper.toArray())) {
            if (empty(gApp.drawer_navigation)) {
                drawer_wrapper.hide();
                drawer_wrapper.html(``);
            } else {
                drawer_wrapper.show();
                drawer_wrapper.html(new Navigation().createDrawerNavigation());
            }
        }
    }

    /** response **/
    async createAppLayout(app) {
        let layout = (typeof app.layout == "undefined" ? (empty(global().layout) ? '' : global().layout) : app.layout);

        if (!empty(layout)) {
            let html = await loadView(layout);
            return this.getResponse(html);
        }
        return this.getResponse(``);
    }

    /** generating response template **/
    getResponse(layout = ``) {
        return `<div class="container-fluid">
                    <div class="row">
                        ${layout}
                    </div>
                </div>`;
    }

    render_html(html = ``, wrapper = '') {
        if (!empty(wrapper)) {
            $(wrapper).html(html);
        } else {
            if ($("div[gilace-rel=response]").length == 1) {
                $("div[gilace-rel=response]").html(html);
            } else {
                $('#application_wrapper').html(html);
            }
        }
        this.init_cli_exec();
    }

    /** add or get components **/
    get_component(component) {
        if (typeof component == "string") {
            for (let cmp of this.components) {
                if (cmp.name == component) {
                    return cmp;
                }
            }
            return null;
        } else {
            this.components.push(component);
            return component;
        }
        return null;
    }

    /** render component data **/
    render_component(component, wrapper = '#gcore_app_wrapper', resolve = null) {
        try {
            wrapper = empty(wrapper) ? '#gcore_app_wrapper' : wrapper;
            let cmp = this.get_component(component);
            if (cmp != null && typeof cmp == "object") {
                cmp.render(wrapper, resolve);
            }
        } catch (e) {
            alert(e.message, 'danger');
        }
    }

    init_cli_exec() {
        $('[gilace-navigate]').unbind('click');
        $('[gilace-navigate]').click((ev) => {
            let navigate_to = $(ev.currentTarget).attr('gilace-navigate');
            new Navigation().navigate(navigate_to);
        });
    }

}

export default LayoutManager;