/*
|--------------------------------------------------------------------------
| Collapse
|--------------------------------------------------------------------------
|  collapse components ...
|
*/
class Collapse extends Component {

    props = {
        ...parent.props,
        id: generateRandomString()
    }

    async render(navigation_data = {}) {
        let collapse = document.createElement('div');
        collapse = await this.render_props(collapse, navigation_data);
        ['collapse'].forEach((cls) => {
            collapse.classList.add(cls);
        });
        collapse.id = this.props.id;
        this.id = collapse.id;
        return collapse;
    }

    on_rendered() {
        try {
            console.log('#' + this.id);
            let collapseEl = $('#' + this.id);
            if (!empty(collapseEl.toArray())) {
                return new bootstrap.Collapse(collapseEl[0], {toggle: false, parent: '#' + collapseEl[0].id});
            }
        } catch (e) {
            console.log(e);
        }
    }

}

export {
    Collapse,
}