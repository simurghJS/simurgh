const ViewGrid = Object.freeze({FALSE: false, TRUE: true})

class View extends Component {

    props = {
        ...parent.props,
        grid: ViewGrid.FALSE
    }

    async render(navigation_data = {}) {
        let cnt = document.createElement(this.tagName);
        cnt = await this.render_props(cnt, navigation_data);
        if (this.props.grid) {
            cnt.classList.add('container-fluid');
            let row = document.createElement('div');
            row.classList.add('row');
            for (const node of cnt.childNodes) {
                row.append(node.cloneNode(true));
            }
            cnt.innerHTML = "";
            cnt.append(row);
        }
        return cnt;
    }
}

class HtmlView extends Component {

    constructor(args) {
        console.log(args);
        super(args);
    }

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
        let _path = APPPATH + gApp.system.paths.views + '/' + (!empty(this.src) ? this.src : this.path);
        if (!empty(_path)) {
            this.source = await this.readFromFile(_path);
            return this.bind(this.data);
        } else {
            return '';
        }
    }

}

class Cell extends Component {

    props = {
        ...parent.props,
        size: 12,
        offset: 0
    }

    async render(navigation_data = {}) {
        let col = document.createElement(this.tagName);
        col = await this.render_props(col, navigation_data);
        col.classList.add('col');
        if (this.props.size > 0 && this.props.size <= 12) {
            col.classList.add('col-sm-' + this.props.size);
        }
        if (this.props.offset > 0 && this.props.offset <= 12) {
            col.classList.add('offset-sm-' + this.props.offset);
        }
        return col;
    }

}

class Button extends Component {

    props = {
        ...parent.props,
        onPress: () => {
        }
    }

    async render(navigation_data = {}) {
        let button = document.createElement('button');
        button = await this.render_props(button, navigation_data);
        ['btn','btn-primary'].forEach((cls)=>{
            button.classList.add(cls);
        });
        button.type = "button";
        button.id = generateRandomString();
        this.name = button.id;
        return button;
    }

    on_rendered() {
        let self = this;
        if (typeof self.props.onPress == "function") {
            $("#" + self.name).click(() => {
                self.props.onPress();
            })

        }
    }

}

/** general **/
export {
    View,
    HtmlView,
    Cell,
    Button
}
