class Response {
    components = []

    constructor() {
    }

    async render_layout(app = {}) {
        this.request = app;

        let html = '';
        let layout = (typeof app.layout == "undefined" ? (empty(global().layout) ? '' : global().layout) : app.layout);
        if (!empty(layout)) {
            let HtmlView = (await import('../components/htmlView.js')).default;
            html = await new HtmlView(layout).render();
        }
        document.title = app.title;

        let drawer_wrapper = $(html).find("div[gilace-rel=drawer_navigation]");
        if (!empty(drawer_wrapper.toArray())) {
            let DrawerNavigation = (await import("../components/drawerNavigation.js")).default;
            html = new DrawerNavigation().createDrawerNavigation(html);
        }
        this.write(html);
    }

    write(html = ``, wrapper = '') {
        console.log($("div[gilace-rel=response]").length );

        if (!empty(wrapper)) {
            $(wrapper).html(html);
        } else {
            if ($("div[gilace-rel=response]").length == 1) {
                console.log(html);
                $("div[gilace-rel=response]").html(html);
            }
        }
    }

    /** functions **/
    render(navigation_data = {}) {
        return null;
    }

    on_rendered() {

    }
}

export default Response;