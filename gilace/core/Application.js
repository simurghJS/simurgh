export default class Application {
    api_url = ''
    title = ''
    title_prefix = ''
    dependencies = []
    drawer_navigation = []
    routes = []
    constants = []
    jquery = true
    bootstrap = true
    rtl=false

    constructor() {
    }

    define(name = '', value = '') {
        this.constants[name] = value;
    }


    registerDrawerNavigation(navs = []) {
        Object.entries(navs).map(nav => {
            switch (typeof nav[1]) {
                case "string":
                    this.drawer_navigation.push({
                        name: nav[0],
                        action: nav[1]
                    });
                    break;
                case "object":
                    let child = []
                    Object.entries(nav[1]).map(nv => {
                        child.push({
                            name: nv[0],
                            action: nv[1]
                        });
                    });
                    this.drawer_navigation.push({
                        name: nav[0],
                        childs: child
                    });
                    break;
            }
        });
    }

    registerDependencies(deps = []) {
        this.dependencies = deps;
    }

    set_layout(path = '') {
        this.layout = path;
    }

    set_url(url = '') {
        this.api_url = url;
    }

    enable_jquery(status = true) {
        this.jquery = status;
    }

    enable_bootstrap(status = true) {
        this.bootstrap = status
    }
    forceRTL() {
        this.rtl = true;
    }

    set_url(url = '') {
        this.api_url = url;
    }

    set_title(title = '', prefix = '') {
        this.title = title;
        this.title_prefix = prefix;
    }

    build() {
        return this;
    }

    registerRoutes(callback = '') {
        this.routes = callback;
    }
}