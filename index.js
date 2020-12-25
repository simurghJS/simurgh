import {Arnahit} from "/core/Arnahit.js";
/*
|--------------------------------------------------------------------------
| Build Your Application
|--------------------------------------------------------------------------
|  define your application instance.
|  this example contents is for hello world application, replace them with your apps setting.
|  at the end, you should build your app like example below (myApp.build())
*/

let myApp = new Arnahit();

/** register routes **/
myApp.registerRoutes(() => {

    let router = new Router();
    router.add('', ()=>{
        return <p>another application with arnahit</p>
    });

});

/** build your application **/
myApp.build();

