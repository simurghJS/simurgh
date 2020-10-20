import Router from '/gilace/core/router.js';

/** application routes **/

let router = new Router();

router.route_group({middleware: 'authenticate'}, () => {

    router.route('/', 'index');

});
