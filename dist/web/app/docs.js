import { HtmlView, View } from "/core/components.js";

class Docs extends Component {
  async component_did_mount(args) {
    this.setState({
      file: args.navigation_data.file + ".html"
    });
  }

  render(navigation_data = {}) {
    return Arnahit.createElement(View, null, Arnahit.createElement(HtmlView, {
      src: this.state.file
    }));
  }

  on_rendered() {
    console.log('hi there! im rendered');
    $('code').each((i, e) => {
      let html = Prism.highlight($(e).text(), Prism.languages.javascript, 'javascript');
      $(e).html(html);
    });
  }

}

export default Docs;