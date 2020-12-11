/*
|--------------------------------------------------------------------------
| Grids & Views
|--------------------------------------------------------------------------
|  components for views & grid system
|
*/

class ListView extends Component {

    static style = {FLUSH: "list-group-flush"}
    props = {
        ...parent.props,
        listStyle: ListView.style.FLUSH
    }

    async render(navigation_data = {}) {
        let cnt = document.createElement('ul');
        cnt = await this.render_props(cnt, navigation_data);
        cnt.classList.add(this.props.listStyle);
        return cnt;
    }
}
class ListItem extends Component {

    props = {
        ...parent.props
    }

    async render(navigation_data = {}) {
        let cnt = document.createElement('li');
        cnt = await this.render_props(cnt, navigation_data);
        cnt.classList.add('list-group-item');
        return cnt;
    }
}
export {
    ListView,
    ListItem
}
