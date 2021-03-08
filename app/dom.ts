/**
 * 
 * @param object 
 * @description check if object is empty
 * @returns true if object is empty or false if not empty
 */
export function empty(object: any): boolean {

    if ((typeof object == "undefined" || object == null) ||
        (Array.isArray(object) && object.length == 0) ||
        (typeof object == "string" && object.length <= 0) ||
        (typeof object == "object" && Object.entries(object).length <= 0)) {
        return true;
    }

    return false;
}
/**
 * 
 * @param dep resource path
 * @description get path to resource files
 */
export function resources(dep: string): string {
    return global.window.location.protocol + '//' + global.window.location.hostname + '/resources/' + dep;
}

export function parseError(err: any): string {
    return "<html><head><meta charset='utf-8'/></head><body>" +
        "<h1>خطای سرور - " + err.name + "</h1>" +
        "<p>متن خطا به شکل زیر است</p>" +
        "<br/>" + "<p>" + err.message + "</p>" +
        (!empty(err.stack) ?
        ("<br/>" + (err.stack as String).split(')').join(')<br/>')) : '') +
        "</body></html>"
}
export function show_404(): string {
    return parseError({
        name: "404",
        message: "چیزی یافت نشد"
    })
}


export function loadView(path = '', data = {}) {
    return new HTMLReader().readFromFile('views/' + path).then(html => {
        return new HTMLDataBinder(html).bind(data);
    });
};
export class HTMLReader {
    constructor() {
    }

    readFromFile(path = '') {
        return fetch(resources(path)).then(response => response.text());
    }

};
export class HTMLDataBinder {
    source: string
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
                                this.source = this.source.replace(exec_item, found[1] as string);
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
        return "";
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
export class loader {
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
                                /* $.getScript(dep).done((script, textStatus) => {
                                     this.core_dependencies.shift();
                                     resolve({
                                         readystate: 'uncompleted'
                                     });
                                 }).fail(() => {
                                     reject(err);
                                     console.log(err);
                                 });*/
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
            if ((resolve as any).readystate == 'uncompleted') {
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
