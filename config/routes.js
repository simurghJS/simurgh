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
router.route('test', () => {
    return 'hello world!';
});