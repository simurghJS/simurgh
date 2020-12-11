/*
|--------------------------------------------------------------------------
| Grids & Views
|--------------------------------------------------------------------------
|  components for views & grid system
|
*/
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

export {
    View,
    Cell,
}
