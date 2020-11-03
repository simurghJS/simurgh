import {Application} from '/gilace/gilace.js';


let myApp = new Application();

myApp.set_title('ساخت سریع و راحت داشبورد', 'GilaceJS | ');
myApp.registerDependencies(['css/app.css']);
myApp.registerRoutes('routes.js');

myApp.registerDrawerNavigation({
    'شروع به کار': "home",
    'ساختار پوشه ها': "folders",
    'پیکره بندی': "configuration",
    'روتینگ': "routing",
    'ایجاد صفحه': 'new_page',
    'سوئیچ بین صفحات': 'navigation',
    'کار با api': 'api',
    'توابع کمکی': 'helpers',
    'کامپوننت ها': {
        'جدول': 'table',
        'فایل منیجر': 'fileManager',
        'modal': 'modal',
        'فرم': 'form'
    }

});

export default myApp;