import {BaseController} from '/gilace/gilace.js'

class Index extends BaseController {

    start(navigation_data = {}) {
        return 'hello world! - from controller '
    }
}

export default Index