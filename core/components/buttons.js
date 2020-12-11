/*
|--------------------------------------------------------------------------
| Buttons
|--------------------------------------------------------------------------
|  buttons components ...
|
*/
class Button extends Component {

    props = {
        ...parent.props,
        onPress: () => {
        }
    }

    async render(navigation_data = {}) {
        let button = document.createElement('button');
        button = await this.render_props(button, navigation_data);
        ['btn', 'btn-primary'].forEach((cls) => {
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

class Navigate extends Component {

    props = {
        ...parent.props,
        route:''
    }

    async render(navigation_data = {}) {
        let button = document.createElement('button');
        button = await this.render_props(button, navigation_data);
        ['btn', 'btn-link'].forEach((cls) => {
            button.classList.add(cls);
        });
        button.type = "button";
        button.id = generateRandomString();
        this.name = button.id;
        return button;
    }

    on_rendered() {
        let self = this;
        $("#" + self.name).click(() => {
            new Router().navigate(self.props.route)
        })
    }

}

export {
    Button,
    Navigate
}