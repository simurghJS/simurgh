import {Component, Navigation} from "/gilace.js";
import LayoutManager from "/gilace/core/layoutManager.js";
import Auth from "/gilace/library/auth.js";
import Request from "/gilace/library/request.js";


class Authenticate {

    constructor() {
        /* constructor */
    }

    async login() {
        let login_page = new Component({
            title: 'ورود به سیستم',
            layout: null
        });
        login_page.render = () => {
            return loadView('login.html');
        }
        login_page.on_rendered = (navigation_data = {}) => {
            $('#submit').click((ev) => {
                new Request(api_url + '/login').post({
                    identity: $('#identity').val(),
                    password: $('#password').val()
                }).then((responseJson) => {
                    let user = responseJson.data.user;
                    console.log(responseJson);
                    if (!empty(user)) {
                        new Auth().authenticate(user, user.api_token);
                    }
                    new Navigation().navigate('');
                });
            });
            $("#password").on('keyup', function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    $('#submit').click();
                }
            });
            $("#identity").on('keyup', function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    $('#submit').click();
                }
            });
        };
        new LayoutManager().render_layout(login_page).then(() => {
            login_page.run({});
        });
    }

    async run(_route = {}, next, data) {
        let user = new Auth().user();
        console.log('asd');
        if (empty(user)) {
            await this.login();
        } else {
            next(_route, data);
        }
    }

}

export default new Authenticate();