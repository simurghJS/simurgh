import Navigation from "./Navigation.js";

import('./Helpers.js');

/** authentication class **/
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

class GCore {

    constructor() {
    }

    import_shortcuts() {
        window.addEventListener('keyup', (ev) => {
            if (ev.key == 'Escape') {
                window.history.back();
            }
        });
    }

    registerApp(env = {}) {

        /** register global variables **/
        let app_url = !empty(env.api_url) ? new URL(env.api_url) : '';
        window.gApp = {
            global: {
                layout: env.layout,
                app_title: env.title,
                title_prefix: env.title_prefix,
                prefix_separator: ' | '
            },
            drawer_navigation:env.drawer_navigation,
            routes: new Array(),
            default_route:'',
            domain: !empty(app_url) ? (app_url.protocol + '//' + app_url.hostname) : ''
        }
        window.APPPATH = window.location.protocol + '//' + window.location.hostname + '/';
        window.BASEURL = env.api_url;
        window.ASSETSPATH = !empty(app_url) ? app_url.protocol + '//' + app_url.hostname + '/' : '';

        /** load dependencies **/
        let dep = [
            '../../node_modules/jquery/dist/jquery.min.js',
            '../../node_modules/bootstrap/dist/js/bootstrap.min.js',
            '../../node_modules/popper.js/dist/popper.min.js',
            APPPATH + 'node_modules/bootstrap/dist/css/bootstrap.css',
            APPPATH + 'node_modules/font-awesome/css/font-awesome.min.css',
            APPPATH + 'gilace/src/rtl.css'
        ];
        for (let dependency of env.dependencies) {
            dep.push(assets(dependency));
        }
        new loader().load(dep).then(() => {

            //all dependencies loaded

        }).catch((err) => {

            console.log('cannot load some dependencies! read logs');
            console.log(err);

        }).then(() => {
                /** load drawerNavigation & routes & environment shortcuts **/
                if (!empty(env.routes)) {
                    import('/' + env.routes).then(() => {

                        this.import_shortcuts();

                    }).catch((err) => {
                        console.log(err);
                    }).then(() => {
                        new Navigation().start();
                    });
                } else {
                    new Navigation().start();
                }
            }
        );
    }
}

export default GCore