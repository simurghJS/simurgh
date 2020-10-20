class Authenticate {

    constructor() {

    }

    run(_route={}){
        if(empty(gilace.auth.get_auth())){
            gilace.navigation.navigate('login');
        }
    }

}
export default new Authenticate();