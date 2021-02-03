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
        },
        type:'primary',
        disabled:false
    }

    async render(navigation_data = {}) {
        let button = document.createElement('button');
        button = await this.render_props(button, navigation_data);
        ['btn', 'btn-'+this.props.type].forEach((cls) => {
            button.classList.add(cls);
        });
        button.type = "button";
        button.disabled=this.props.disabled;
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
        route: '',
        data: {},
        disabled:false

    }

    async render(navigation_data = {}) {
        let button = document.createElement('button');
        button = await this.render_props(button, navigation_data);
        ['btn', 'btn-link'].forEach((cls) => {
            button.classList.add(cls);
        });
        button.type = "button";
        button.disabled=this.props.disabled;
        button.id = generateRandomString();
        this.name = button.id;
        return button;
    }

    on_rendered() {
        let self = this;
        $("#" + self.name).click(() => {
            new Router().navigate(self.props.route, self.props.data)
        })
    }

}

class CollapseToggle extends Component {
    props = {
        ...parent.props,
        target: ""
    }

    async render(navigation_data = {}) {
        let button = document.createElement('a');
        button = await this.render_props(button, navigation_data);
        ['btn', 'btn-link'].forEach((cls) => {
            button.classList.add(cls);
        });
        button.href = "#" + this.props.target;
        button.role="button";
        button.setAttribute('data-toggle','collapse');
        button.setAttribute('aria-expanded','false');
        button.setAttribute('aria-controls',this.props.target);
        return button;
    }
}

export {
    Button,
    Navigate,
    CollapseToggle
}