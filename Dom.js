/*******************************
 |--------------------------------------------------------------------------
 |   SimutghDom
 |--------------------------------------------------------------------------
 |
 |  global functions and object to use..
 |
 |------------------------------------
 |  1.Component             (class)
 |  2.Router                (class)
 |  3.env                   (function)
 |  4.empty                 (function)
 |  5.uuid                  (function)
 |  6.alert                 (function)
 |  7.resources             (function)
 |  8.core_assets           (function)
 |  9.generateRandomString  (function)
 |  10.global               (function)
 |  11.loadView             (class)
 |  12.HTMLReader           (class)
 |  13.HTMLDataBinder       (class)
 |  14.loader               (class)
 |------------------------------------
 |
 *******************************/

window.env = name => {
    let found = Object.entries(gApp.constants).find(row => row[0] == name);

    if (!empty(found)) {
        return found[1];
    }

    return null;
};

window.empty = object => {
    let result = false;

    if (typeof object == "undefined" || object == null) {
        return !result;
    }

    if (Array.isArray(object) && object.length == 0) {
        return !result;
    }

    if (typeof object == "string") {
        if (object.length <= 0) {
            return !result;
        }
    }

    if (typeof object == "object") {
        let arr = Object.entries(object);

        if (arr.length <= 0) {
            return !result;
        }
    }

    return result;
};

window.uuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

window.alert = (text = '', status = 'success', args, callback = null) => {
    if (typeof callback != 'function') {
        let html = `<div class="alert alert-${status}">
        <button type="button" class="close" data-dismiss="alert">×</button>
        <p>${text}</p>
    </div>`;
        $(document.body).append(html);
        let delay = status == 'success' ? 3000 : 5000;
        $('.alert').delay(delay).slideUp(300);
    } else {
        if (typeof swal != 'undefined') {
            swal({
                title: args.title != undefined ? args.title : text,
                text: args.text != undefined ? args.text : "",
                type: args.type != undefined ? args.type : "",
                showCancelButton: args.showCancelButton != undefined ? args.showCancelButton : false,
                animation: args.animation != undefined ? args.animation : 'slide-from-top',
                cancelButtonText: args.cancelButtonText != undefined ? args.cancelButtonText : "لغو",
                confirmButtonColor: args.confirmButtonColor != undefined ? args.confirmButtonColor : "",
                confirmButtonText: args.confirmButtonText != undefined ? args.confirmButtonText : "",
                closeOnConfirm: args.closeOnConfirm != undefined ? args.closeOnConfirm : true,
                showLoaderOnConfirm: args.showLoaderOnConfirm != undefined ? args.showLoaderOnConfirm : true
            }, function () {
                callback();
            });
        } else {
            gilace.Loader.load([APPPATH + 'assets/js/sweetalert.min.js', APPPATH + 'assets/css/sweetalert.css']).then(() => {
                alert(text, status, args, callback);
            });
        }
    }

    return this;
};

window.resources = (path = '') => {
    return window.location.protocol + '//' + window.location.hostname + '/resources/' + path;
};

window.core_assets = assets => {
    return window.location.protocol + '//' + window.location.hostname + '/system/core/' + assets;
};

window.generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

window.global = () => {
    return gApp.global;
};

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