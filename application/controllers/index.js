import {BaseController} from '/gilace/gilace.js'

class Index extends BaseController {

    layout = 'layout/home.html';

    start(navigation_data = {}) {
        return `
        
        <h1 style="font-size: 7rem">
        Gilace.js
        </h1>
        <h3>فریم ورکی بر پایه javascript برای توسعه آسان UI</h3>
        
        `;
    }

}

export default Index;