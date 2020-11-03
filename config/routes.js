import Router from '/gilace/core/router.js';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|  remove default routes( document routes ) & define your application
|  routes.
|
*/

let router = new Router();

/** document routes... **/
let navigation_option = {toolbar: null}
router.route_group({namespace: 'docs', navigation_option: navigation_option}, () => {

    router.route('/', 'index').name('home');
    router.route('helpers', 'helpers');
    router.route('configuration', 'configuration');
    router.route('routing', 'routing');
    router.route('new_page', 'new_page');
    router.route('navigation', 'navigation');
    router.route('api', 'api');
    router.route('folders', 'folders');

    router.route_group({namespace: '/components'}, () => {

        router.route('table', 'table');
        router.route('fileManager', 'fileManager');
        router.route('modal', 'modal');
        router.route('form', 'form');

    });

});