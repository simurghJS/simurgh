/** response **/
class Response {
    components = [];

    constructor() {
    }

    async render_layout(args = {}) {
        let html = '';
        let layout = typeof args.layout == "undefined" ? empty(global().layout) ? '' : global().layout : args.layout;
        console.log(layout);

        if (!empty(layout)) {
            let html_view = new (await import('/node_modules/simurgh-bootstrap/components.js')).HtmlView();
            html_view.props.src = layout;
            html = await html_view.render();
            console.log(html);
        }
        document.title = args.title;
        args.component_ready = [];
        let drawer_wrapper = $(html).find("div[gilace-rel=drawer_navigation]");
        if (!empty(drawer_wrapper.toArray()) && !empty(gApp.drawer_navigation)) {
            let _drw = new gApp.drawer_navigation();
            _drw.parse(args);
            let drw = await new Application().render(await _drw.render(args), args);
            $(html).find("div[gilace-rel=drawer_navigation]").html(drw);
        }
        document.body.innerHTML = "";
        this.write(html);
        if (args.component_ready.length > 0) {
            args.component_ready.forEach((callback => {
                callback();
            }))
        }
    }

    write(html = ``, wrapper = '') {

        if (empty(wrapper)) {
            if ($("div[gilace-rel=response]").length == 1) {
                wrapper = "div[gilace-rel=response]";
            } else {
                wrapper = document.body
            }
        }
        switch (typeof wrapper) {
            case "string":
                $(wrapper).html(html);
                break;
            case "object":
                console.log(html);
                console.log(wrapper);
                $(wrapper).append(html);
                break;
        }
    }

    /** functions **/

    render(navigation_data = {}) {
        return null;
    }

    on_rendered() {
    }

    createElement(type, props, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children.map(child => typeof child === "object" ? child : {
                    type: "Text",
                    props: {
                        nodeValue: child,
                        children: []
                    }
                })
            }
        };
    }

}
export {Response}