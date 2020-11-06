import {Application} from '/gilace/gilace.js';

/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
| here you can customize your application settings.
|
*/

let myApp = new Application();

myApp.registerDependencies(['css/hello_world.css']);
myApp.set_layout('layout/base.html');
myApp.registerRoutes('routes.js');
myApp.set_title('home','gilaceJS');

export default myApp;