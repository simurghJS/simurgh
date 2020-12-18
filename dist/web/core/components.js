/*
|--------------------------------------------------------------------------
| Buttons
|--------------------------------------------------------------------------
|  buttons components ...
|
*/
class Button extends Component {
  props = { ...parent.props,
    onPress: () => {},
    type: 'primary',
    disabled: false
  };

  async render(navigation_data = {}) {
    let button = document.createElement('button');
    button = await this.render_props(button, navigation_data);
    ['btn', 'btn-' + this.props.type].forEach(cls => {
      button.classList.add(cls);
    });
    button.type = "button";
    button.disabled = this.props.disabled;
    button.id = generateRandomString();
    this.name = button.id;
    return button;
  }

  on_rendered() {
    let self = this;

    if (typeof self.props.onPress == "function") {
      $("#" + self.name).click(() => {
        self.props.onPress();
      });
    }
  }

}

class Navigate extends Component {
  props = { ...parent.props,
    route: '',
    data: {},
    disabled: false
  };

  async render(navigation_data = {}) {
    let button = document.createElement('button');
    button = await this.render_props(button, navigation_data);
    ['btn', 'btn-link'].forEach(cls => {
      button.classList.add(cls);
    });
    button.type = "button";
    button.disabled = this.props.disabled;
    button.id = generateRandomString();
    this.name = button.id;
    return button;
  }

  on_rendered() {
    let self = this;
    $("#" + self.name).click(() => {
      new Router().navigate(self.props.route, self.props.data);
    });
  }

}

class CollapseToggle extends Component {
  props = { ...parent.props,
    target: ""
  };

  async render(navigation_data = {}) {
    let button = document.createElement('a');
    button = await this.render_props(button, navigation_data);
    ['btn', 'btn-link'].forEach(cls => {
      button.classList.add(cls);
    });
    button.href = "#" + this.props.target;
    button.role = "button";
    button.setAttribute('data-toggle', 'collapse');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', this.props.target);
    return button;
  }

}

export { Button, Navigate, CollapseToggle };
/*
|--------------------------------------------------------------------------
| Cards
|--------------------------------------------------------------------------
| ...
|
*/
class Card extends Component {
  props = { ...parent.props,
    title: ''
  };

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

export { Card, CardBody };
/*
|--------------------------------------------------------------------------
| Collapse
|--------------------------------------------------------------------------
|  collapse components ...
|
*/
class Collapse extends Component {
  props = { ...parent.props,
    id: generateRandomString()
  };

  async render(navigation_data = {}) {
    let collapse = document.createElement('div');
    collapse = await this.render_props(collapse, navigation_data);
    ['collapse'].forEach(cls => {
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
        return new bootstrap.Collapse(collapseEl[0], {
          toggle: false,
          parent: '#' + collapseEl[0].id
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

}

export { Collapse };
/*
|--------------------------------------------------------------------------
| Grids & Views
|--------------------------------------------------------------------------
|  components for views & grid system
|
*/
const ViewGrid = Object.freeze({
  FALSE: false,
  TRUE: true
});

class View extends Component {
  props = { ...parent.props,
    grid: ViewGrid.FALSE
  };

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
  props = { ...parent.props,
    size: 12,
    offset: 0
  };

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

export { View, Cell };
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
      let parsed = new DOMParser().parseFromString(this.bind(this.data), 'text/html').body;
      console.log(parsed);
      return parsed;
    } else {
      return '';
    }
  }

}

export { HtmlView };
/*
|--------------------------------------------------------------------------
| Grids & Views
|--------------------------------------------------------------------------
|  components for views & grid system
|
*/
class ListView extends Component {
  static style = {
    FLUSH: "list-group-flush"
  };
  props = { ...parent.props,
    listStyle: ListView.style.FLUSH
  };

  async render(navigation_data = {}) {
    let cnt = document.createElement('ul');
    cnt = await this.render_props(cnt, navigation_data);
    cnt.classList.add(this.props.listStyle);
    return cnt;
  }

}

class ListItem extends Component {
  props = { ...parent.props
  };

  async render(navigation_data = {}) {
    let cnt = document.createElement('li');
    cnt = await this.render_props(cnt, navigation_data);
    cnt.classList.add('list-group-item');
    return cnt;
  }

}

export { ListView, ListItem };
