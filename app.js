import {Application, Router} from '/gilace/gilace.js';

/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
| describe your build [ title, layouts, routes and ...]
|
*/

let myApp = new Application();

/** here you can customize your build **/

let router = new Router();
router.route('',()=>{
   return 'hello world 1';
});
router.route('test','index');
//myApp.registerRoutes('routes.js');
//myApp.set_title('hello world','my app');
export default myApp;