import Arnahit from "/arnahit/core/Arnahit.js";

/*
|--------------------------------------------------------------------------
| Builder
|--------------------------------------------------------------------------
|  define your application instance of GilaceJS
|
*/
let myApp = new Arnahit();
window.Arnahit = myApp;
/** initialize your instance **/

myApp.registerRoutes(() => {

    new Router().add('', 'index');

});

//load bootstrap rtl settings for persian layouts
myApp.forceRTL();

// comment/uncomment codes if need to remove/add libraries from/to auto loading
//myApp.enable_jquery(false);
//myApp.enable_bootstrap(false);

/** build your application **/
myApp.build();