import {Arnahit} from "/core/Arnahit.js";
import Sidebar from "/app/inc/sidebar.js"

/*
|--------------------------------------------------------------------------
| Build Your Application
|--------------------------------------------------------------------------
|  define your application instance.
|  this example contents is for hello world application, replace them with your apps setting.
|  at the end, you should build your app like example below (myApp.build())
|
*/
let myApp = new Arnahit();

/** define constants **/
myApp.define('version', '0.6.8 beta');
myApp.define('app_name', 'arnahitJS');

/** register routes **/
myApp.registerRoutes(() => {

    let router = new Router();
    router.add('', 'index');
    router.add('docs/(?file)', 'docs', {
        layout: 'layout/base.html',
        dependencies: [
            resources('css/prism.css'),
            resources('js/prism.js')
        ]
    }).name('docs');

});

/** register sidebar **/
myApp.registerDrawerNavigation(Sidebar);

/** register global dependencies **/
myApp.registerDependencies([
    'css/app.css'
]);

/** load rtl settings **/
myApp.forceRTL();


/** build your application **/
myApp.build();

