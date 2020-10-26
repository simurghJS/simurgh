export default class Application {
    api_url = ''
    title = ''
    title_prefix = ''
    dependencies = []
    drwnavs = []
    routes = []

    constructor() {
    }

    registerDrawerNavigation(navs = []) {
        Object.entries(navs).map(nav => {
            switch (typeof nav[1]) {
                case "string":
                    this.drwnavs.push({
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
                    this.drwnavs.push({
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

    registerRoutes(file_path = '') {
        this.routes = 'config/' + file_path;
    }
}