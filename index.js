import {Arnahit} from "/core/Arnahit.js";
import Sidebar from "/app/inc/sidebar.js"

/*
|--------------------------------------------------------------------------
| Builder
|--------------------------------------------------------------------------
|  define your application instance of GilaceJS
|
*/
let myApp = new Arnahit();

myApp.define('version', '0.6.5');

/** initialize your instance **/
myApp.registerRoutes(() => {
    let router = new Router();
    router.add('', 'index');
    router.route_group({
        namespace: 'docs',
        layout: 'layout/base.html',
        dependencies: [
            resources('css/prism.css'),
            resources('js/prism.js')
        ]
    }, () => {
        router.add('docs/quick_start', 'quick_start');
    })
});
myApp.registerDrawerNavigation(Sidebar);

myApp.registerDependencies([
    'css/app.css'
]);

//load bootstrap rtl settings for persian layouts
myApp.forceRTL();

// comment/uncomment codes if need to remove/add libraries from/to auto loading
//myApp.enable_jquery(false);
//myApp.enable_bootstrap(false);

/** build your application **/
myApp.build();

