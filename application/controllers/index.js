import {BaseController} from '/gilace/gilace.js'

class Index extends BaseController {
    layout='layout/base.html'
    start(navigation_data = {}) {
        return 'hello world!';
    }
}

export default Index;