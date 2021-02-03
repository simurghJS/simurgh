/*
|--------------------------------------------------------------------------
| Grids & Views
|--------------------------------------------------------------------------
|  components for views & grid system
|
*/

class HtmlView extends Component {


    readFromFile(path = '') {
        return fetch(path).then(response => response.text());
    }

    bind(data = {}) {
        let exec = this.source.match(/{{.[^}]+}}/g);

        if (!empty(exec)) {
            for (let exec_item of exec) {
                let extracted = this.extract_exec(exec_item);
                let e = this.get_exec_type(extracted);

                switch (e) {
                    case 'function':
                        let res = this.run_function(extracted);
                        this.source = this.source.replace(exec_item, res);
                        break;

                    default:
                        if (!empty(data)) {
                            let found = Object.entries(data).find(row => row[0] == extracted.trim());

                            if (!empty(found)) {
                                this.source = this.source.replace(exec_item, found[1]);
                            }
                        }

                        break;
                }
            }
        }

        return this.source;
    }

    run_function(e) {
        let name = e.substr(0, e.indexOf('('));
        let argument = e.substring(e.indexOf('(') + 2, e.indexOf(')') - 1);
        return window[name](argument);
    }

    get_exec_type(e) {
        if (!empty(e)) {
            if (/.*\(.*\)/.test(e)) {
                return "function";
            }
        }

        return null;
    }

    extract_exec(exec) {
        if (!empty(exec)) {
            return exec.substr(2, exec.length - 4);
        }

        return null;
    }

    async render(navigation_data = {}) {
        let _path = APPPATH + gApp.system.paths.views + '/' + (!empty(this.props.src) ? this.props.src : this.path);
        if (!empty(_path)) {
            this.source = await this.readFromFile(_path);
            let parsed=new DOMParser().parseFromString(this.bind(this.data),'text/html').body;
            console.log(parsed);
            return parsed;
        } else {
            return '';
        }
    }

}

export {
    HtmlView,
}
