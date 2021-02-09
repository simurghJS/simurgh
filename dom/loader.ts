window.loadView = (path = '', data = {}) => {
    return new HTMLReader().readFromFile('views/' + path).then(html => {
        return new HTMLDataBinder(html).bind(data);
    });
};
window.HTMLReader = class {
    constructor() {
    }

    readFromFile(path = '') {
        return fetch(resources(path)).then(response => response.text());
    }

};
window.HTMLDataBinder = class {
    constructor(source = '') {
        this.source = source;
    }

    bind(data = {}) {
        let exec = this.source.match(/{{.[^}]+}}/g);

        if (!empty(exec)) {
            for (let exec_item of exec) {
                let extracted = this.extract_exec(exec_item);
                let e = this.get_exec_type(extracted);

                switch (e) {
                    case 'function':
                        let res = this.run_function(extracted);
                        this.source = this.source.replace(exec_item, res);
                        break;

                    default:
                        if (!empty(data)) {
                            let found = Object.entries(data).find(row => row[0] == extracted.trim());

                            if (!empty(found)) {
                                this.source = this.source.replace(exec_item, found[1]);
                            }
                        }

                        break;
                }
            }
        }

        return this.source;
    }

    run_function(e) {
        let name = e.substr(0, e.indexOf('('));
        let argument = e.substring(e.indexOf('(') + 2, e.indexOf(')') - 1);
        return window[name](argument);
    }

    get_exec_type(e) {
        if (!empty(e)) {
            if (/.*\(.*\)/.test(e)) {
                return "function";
            }
        }

        return null;
    }

    extract_exec(exec) {
        if (!empty(exec)) {
            return exec.substr(2, exec.length - 4);
        }

        return null;
    }

};
window.loader = class {
    loaded = [];
    core_dependencies = [];

    constructor(deps) {
        this.core_dependencies = deps;
    }

    init(_resolve) {
        new Promise((resolve, reject) => {
            if (this.core_dependencies.length > 0) {
                let dep = this.core_dependencies[0];
                let exists = !empty(this.loaded.find(key => key === dep));

                if (!exists) {
                    this.loaded.push(dep);

                    switch (dep.substr(dep.lastIndexOf('.') + 1)) {
                        case 'js':
                            console.log(dep);
                            import(dep).then(() => {
                                this.core_dependencies.shift();
                            }).catch(err => {
                                $.getScript(dep).done((script, textStatus) => {
                                    this.core_dependencies.shift();
                                    resolve({
                                        readystate: 'uncompleted'
                                    });
                                }).fail(() => {
                                    reject(err);
                                    console.log(err);
                                });
                            }).then(() => {
                            }).finally(() => {
                                resolve({
                                    readystate: 'uncompleted'
                                });
                            });
                            break;

                        case 'css':
                            this.core_dependencies.shift();
                            let link = document.createElement('link');
                            link.href = dep;
                            link.rel = 'stylesheet';
                            document.head.appendChild(link);
                            resolve({
                                readystate: 'uncompleted'
                            });
                            break;
                    }
                } else {
                    resolve({
                        readystate: 'completed'
                    });
                }
            } else {
                resolve({
                    readystate: 'completed'
                });
            }
        }).then(resolve => {
            if (resolve.readystate == 'uncompleted') {
                this.init(_resolve);
            } else {
                setTimeout(() => {
                    _resolve({
                        message: 'success'
                    });
                }, 500);
            }
        }).catch(err => {
            console.log('FATAL ERROR ====> cannot load dependency');
            console.log(err.message);
        });
    }

    load(deps = []) {
        return new Promise((resolve, reject) => {
            this.core_dependencies = deps;
            this.init(resolve);
        });
    }

};