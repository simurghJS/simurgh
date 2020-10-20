class Applet{
    onchange_eventHandler=()=>{};
    onchange(handler){
        this.onchange_eventHandler=handler;
    }
    initialize_eventHandler(resolve,reject){}
    constructor(obj) {
        if (typeof obj == "object") {
            obj && Object.assign(this, obj);
        }
    }

    initialize(launcher = {},onclose_evendhandler=()=>{}){
        return new Promise((resolve, reject) => {
            this.initialize_eventHandler(resolve,reject);
        });
    }

    /** applet function **/
    set_launcher(launcher = {},onclose_evendhandler=()=>{}) {
        this.initialize(launcher,onclose_evendhandler).then((cmp) => {
            cmp.onhide(onclose_evendhandler);
            $('#' + launcher.selector).unbind('click');
            $('#' + launcher.selector).on('click',(ev) => {
                cmp.openDialog();
            });
        }).catch((e) => {
            Gcore.alert(e.message, 'failed');
        }).then((e) => {
            $('#'+launcher.selector).click();
        });
    }

}
export default Applet