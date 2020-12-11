import {HtmlView} from "/core/components.js";

class Docs extends Component {

    async component_did_mount(args) {

        this.setState({
            file: args.navigation_data.file,
        });

    }

    render(navigation_data = {}) {
        return <HtmlView src={this.state.file}></HtmlView>
    }

    on_rendered() {
        console.log('hi there! im rendered');
        $('code').each((i, e) => {
            let html = Prism.highlight($(e).text(), Prism.languages.javascript, 'javascript');
            $(e).html(html);
        })
    }

}

export default Docs;