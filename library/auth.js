/** authentication class **/
export default class Auth {
    _authorization = null
    _user = {}

    set_token(token = null) {
        this._authorization = token
    }

    get_authorization() {
        let session_token = sessionStorage.getItem('authorization');
        if (!empty(session_token) && this._authorization != null) {
            this._authorization = session_token
        }
        this._authorization = this._authorization == null ?
            !empty(session_token) ?
                session_token : this._authorization
            : this._authorization;
        return this._authorization
    }

    authenticate(user = {}, token = null) {
        console.log('user = >');
        console.log(user);

        sessionStorage.setItem('user', user);
        if (token != null) {
            this.set_token(token);
            sessionStorage.setItem('authorization', token);
        }
    }

    user() {
        console.log(sessionStorage.getItem('user'))
        return sessionStorage.getItem('user');
    }
}