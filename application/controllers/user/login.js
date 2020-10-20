import * as G from '/gilace/gilace.js'

class Login extends G.BaseController {


    title = 'ورود به سیستم';
    template = 'login.html'

    start(navigation_data = {}) {

        $('#submit').click((ev) => {
            Post('/login', {
                identity: $('#identity').val(),
                password: $('#password').val()
            }, (responseJson) => {
                let user=responseJson.data.user;
                if(!empty(user)) {
                    gilace.auth.set_auth(user, user.api_token);
                }
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


}

export default Login