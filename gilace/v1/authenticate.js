import * as G from "/gilace/gilace.js";
import {Form} from "/gilace/components.js";

class Authenticate {

    constructor() {
        /* constructor */
    }

    login() {

        let loginForm=new Form();


        let LOGIN_APP = new G.BaseController({
            title: 'ورود به سیستم',
            template: 'login.html',
            toolbar: null,
            drawer_navigation:null
        });

        LOGIN_APP.start = (navigation_data = {}) => {
            console.log('login start!');
            $('#submit').click((ev) => {
                new request('/login').post({
                    identity: $('#identity').val(),
                    password: $('#password').val()
                }).then((responseJson) => {
                    let user = responseJson.data.user;
                    if (!empty(user)) {
                        gilace.auth.set_auth(user, user.api_token);
                    }
                    gilace.navigation.navigate('/');
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
        }

        gilace.layoutManager.render_layout(LOGIN_APP).then(() => {
            LOGIN_APP.run({});
        });
    }

    run(_route = {}, next, data) {
        if (empty(gilace.auth.get_auth())) {
            this.login();
        } else {
            next(_route, data);
        }
    }

}

export default new Authenticate();