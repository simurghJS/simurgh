import Tools from "./tools.js";
import filemanager from "../components/filemanager.js";
import LayoutManager from "./layoutManager.js";
import Navigation from "./Navigation.js";
import Form_manager from "../modules/form_manager.js";
import BaseController from './BaseController.js';
import Router from "./router.js";
import Application from "./Application.js";

const _gilace = {
    adaptor: {
        form: ''
    }
}

class loader {

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
                                resolve({
                                    readystate: 'uncompleted'
                                });
                            }).catch(err => {
                                reject(err);
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

class auth {
    _authorization = null
    _user = {}

    set_token(token = null) {
        this._authorization = token
    }

    get_authorization() {
        let session_token = localStorage.getItem('authorization');
        if (!empty(session_token) && this._authorization != null) {
            this._authorization = session_token
        }
        this._authorization = this._authorization == null ?
            !empty(session_token) ?
                session_token : this._authorization
            : this._authorization;
        return this._authorization
    }

    set_auth(user = '', token = null) {
        this._user = user
        if (token != null) {
            this.set_token(token);
            sessionStorage.setItem('authorization', token);
        }
    }

    get_auth() {
        return this._user
    }
}

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

class G_core {
    _env = {
        /** do not change this **/
    }

    constructor() {
    }

    _INITIALIZE_() {
        window.SYS_ROUTES = new Array();
        window.APPPATH = window.location.protocol + '//' + window.location.hostname + '/';
        window.BASEURL = this._env.api_url;
        window.ASSETSPATH = !empty(BASEURL) ? new URL(BASEURL).protocol + '//' + new URL(BASEURL).hostname + '/' : '';
        window.TITLE_PREFIX = this._env.title_prefix;
        window.APPTITLE = this._env.title;

        window.gilace = new Object();

        gilace.helper = Tools;
        gilace.Loader = new loader();
        gilace.modules = new Object();
        gilace.modules.form = Form_manager;
        let dep = [
            '../../node_modules/jquery/dist/jquery.min.js',
            '../../node_modules/bootstrap/dist/js/bootstrap.min.js',
            '../../node_modules/popper.js/dist/popper.min.js',
            APPPATH + 'node_modules/bootstrap/dist/css/bootstrap.css',
            APPPATH + 'node_modules/font-awesome/css/font-awesome.min.css',
            APPPATH + 'gilace/src/rtl.css'
        ];
        for (let dependency of this._env.dependencies) {
            dep.push(assets(dependency));
        }
        gilace.Loader.load(dep).then(() => {
            gilace.auth = new auth();
            gilace.form = {
                input: new form_input()
            }
            gilace.layoutManager = new LayoutManager();
            gilace.navigation = new Navigation();
            gilace.router = new Router();
            gilace.filemanager = new filemanager({
                name: 'filemanager'
            });
            gilace.navigation.set_global_variables(this._env);
            gilace.navigation.default_route = this._env.default_route;
        }).catch((err) => {
            console.log(err);
        }).then(() => {
                this.import_shortcuts();
                /** export objects.... **/
                window.Controller = BaseController;
                window.Application = Application;
                console.log(this._env);
                gilace.navigation.registerDrawerNavigation(this._env.drwnavs);
                if (!empty(this._env.routes)) {
                    import('/' + this._env.routes).then(() => {

                    }).catch((err) => {
                        console.log(err);
                    }).then(() => {
                        gilace.navigation.start();
                    });
                } else {
                    gilace.navigation.start();
                }
            }
        );
    }

    import_shortcuts() {
        window.addEventListener('keyup', (ev) => {
            if (ev.key == 'Escape') {
                window.history.back();
            }
        });
    }

    registerApp(env = {}) {
        this._env = env;
        this._INITIALIZE_();
    }
}

export default G_core