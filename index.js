import GilaceJS from "/gilace/core/Gilace.js";

/*
|--------------------------------------------------------------------------
| Builder
|--------------------------------------------------------------------------
|  define your application instance of GilaceJS
|
*/
let myApp = new GilaceJS();

/** initialize your instance **/

myApp.forceRTL();

//myApp.enable_jquery(false); //<--- remove jquery from auto loading
//myApp.enable_bootstrap(false); //<--- remove bootstrap from auto loading

/** build your application **/
myApp.build();