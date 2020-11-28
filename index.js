import Arnahit from "/arnahit/core/Arnahit.js";
/*
|--------------------------------------------------------------------------
| Builder
|--------------------------------------------------------------------------
|  define your application instance of GilaceJS
|
*/
let myApp = new Arnahit();

/** initialize your instance **/

myApp.registerRoutes(() => {

    new Router().add('', () => {
        return loadView('hello_world.html');
    });

});

//load bootstrap rtl settings for persian layouts
myApp.forceRTL();

// comment/uncomment codes if need to remove/add libraries from/to auto loading
//myApp.enable_jquery(false);
//myApp.enable_bootstrap(false);

/** build your application **/
myApp.build();