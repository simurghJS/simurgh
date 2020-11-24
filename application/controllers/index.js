import HtmlView from "/gilace/components/htmlView.js";

class Index extends Component {
    render(navigation_data = {}) {
        return new HtmlView('hello_world.html');
    }
}

export default Index;