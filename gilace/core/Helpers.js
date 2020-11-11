/** models for auto cruds... **/
export class G_Models {

    string_field(name = '', placeholder = '', value = '') {
        return {
            type: 'text',
            title: name,
            value: value,
            placeholder: placeholder
        }
    }

    empty_state(title, image, text) {
        return {
            image: image,
            title: title,
            text: text
        }
    }

}

/** form input **/
class form_input {
    constructor() {
    }

    TextInput(value) {
        return {
            type: 'text',
            text: value
        }
    }

    LocationSelector(lat, lng) {
        return {
            type: 'location-selector',
            lat: lat,
            lng: lng
        }
    }

    fileSelector(src = {}) {
        return {
            type: 'file-selector',
            ...src
        }
    }
}

window.env = (name) => {
    console.log(gApp.constants);

    let found = Object.entries(gApp.constants).find(row => row[0] == name);
    return found[1];

}

window.empty = (object) => {
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
}

window.uuid = () => {

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );

}

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
                },
                function () {
                    callback();
                });
        } else {
            gilace.Loader.load([
                APPPATH + 'assets/js/sweetalert.min.js',
                APPPATH + 'assets/css/sweetalert.css'
            ]).then(() => {
                alert(text, status, args, callback);
            });
        }
    }
    return this;
}

window.assets = (assets) => {
    return window.location.protocol + '//' + window.location.hostname + '/assets/' + assets
}

window.core_assets = (assets) => {
    return window.location.protocol + '//' + window.location.hostname + '/system/core/' + assets
}

window.generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

window.global = () => {
    return gApp.global;
}

window.loadView = (path = '', data = {}) => {

    return new HTMLReader().readFromFile(path).then((html) => {
        return new HTMLDataBinder(html).bind(data);
    })

}

window.HTMLReader = class {

    constructor() {

    }

    readFromFile(path = '') {
        return fetch(APPPATH + 'application/views/' + path).then(response => response.text());
    }

}

window.HTMLDataBinder = class {
    exec_regex = /{{.*}}/g
    function_regex = /.*\(.*\)/g

    constructor(source = '') {
        this.source = source;
    }

    bind(data = {}) {

        let exec = this.source.match(this.exec_regex);
        if (!empty(exec)) {
            for (let exec_item of exec) {
                let extracted = this.extract_exec(exec_item);
                let e = this.get_exec_type(extracted);

                switch (e) {
                    case 'function':
                        this.source = this.source.replace(exec_item, this.run_function(extracted));
                        break;
                    default:
                        if(!empty(data)) {
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
        console.log(e.indexOf(')'));
        let name = e.substr(0, e.indexOf('('));
        let argument = e.substring(e.indexOf('(') + 2, e.indexOf(')') - 1);

        console.log(name);
        console.log(argument);

        return window[name](argument);
    }

    get_exec_type(e) {
        if (!empty(e)) {
            if (this.function_regex.test(e)) {
                return "function";
            } else {

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

}

/** load dependencies **/
window.loader = class {

    loaded = []
    core_dependencies = []

    constructor(deps) {
        this.core_dependencies = deps;
    }

    init(_resolve) {

        new Promise((resolve, reject) => {
            if (this.core_dependencies.length > 0) {
                let dep = this.core_dependencies[0];
                let exists = !empty(this.loaded.find((key) => key === dep));
                if (!exists) {
                    this.loaded.push(dep);
                    switch (dep.substr(dep.lastIndexOf('.') + 1)) {
                        case 'js':
                            import(dep).then(() => {
                                this.core_dependencies.shift();
                            }).catch(err => {
                                $.getScript(dep)
                                    .done((script, textStatus) => {
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
                    })
                }
            } else {
                resolve({
                    readystate: 'completed'
                })
            }
        }).then((resolve) => {
            if (resolve.readystate == 'uncompleted') {
                this.init(_resolve);
            } else {
                setTimeout(() => {
                    _resolve({
                        message: 'success',
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
        })
    }
}