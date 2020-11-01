import {Application} from '/gilace/gilace.js';


let myApp = new Application();

myApp.set_title('ساخت سریع و راحت داشبورد', 'GilaceJS | ');
myApp.registerDependencies(['css/app.css']);
myApp.registerRoutes('routes.js');

myApp.registerDrawerNavigation({
    ' خانه': 'home',
});

export default myApp;