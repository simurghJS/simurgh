import {Application} from '/gilace/gilace.js';


let myApp = new Application();

myApp.set_url('http://crm.com');
myApp.set_title('آموزشگاه بشکول', 'پنل مدیریت | ');
myApp.registerDependencies(['css/app.css']);
myApp.registerRoutes('routes.js');
myApp.registerDrawerNavigation({
    ' خانه': '/',
    'مقدمات': {
        'روتینگ': 'routing'
    }
});

export default myApp;