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
    router.route('helpers','helpers')
});