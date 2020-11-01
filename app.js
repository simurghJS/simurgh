import {Application} from '/gilace/gilace.js';


let myApp = new Application();

myApp.set_title('ساخت سریع و راحت داشبورد', 'GilaceJS | ');
myApp.registerDependencies(['css/app.css']);
myApp.registerRoutes('routes.js');

myApp.registerDrawerNavigation({
    'شروع به کار':"home",
    'پیکره بندی':"configuration",
    'ساختار پوشه ها':"folders",
    'روتینگ':"",
    'ایجاد صفحه':'',
    'سوئیچ بین صفحات':'',
    'کار با api':'',
    'توابع کمکی':'helpers',
    'کامپوننت ها':''

});

export default myApp;