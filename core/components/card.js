/*
|--------------------------------------------------------------------------
| Cards
|--------------------------------------------------------------------------
| ...
|
*/
class Card extends Component {
    props = {
        ...parent.props,
        title: ''
    }

    async render(navigation_data = {}) {
        let crd = document.createElement(this.tagName);
        crd.classList.add('card');

        crd = await this.render_props(crd, navigation_data);

        return crd;
    }
}

class CardBody extends Component {
    async render(navigation_data = {}) {
        let card_body = document.createElement(this.tagName);
        card_body.classList.add('card-body');
        card_body = await this.render_props(card_body, navigation_data);
        return card_body;
    }
}

class CardHeader extends Component {
    async render(navigation_data = {}) {
        let card_body = document.createElement(this.tagName);
        card_body.classList.add('card-body');
        card_body = await this.render_props(card_body, navigation_data);
        return card_body;
    }
}

export {
    Card,
    CardBody
};