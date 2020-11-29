import HtmlView from "/arnahit/components/htmlView.js";

class Index extends Component {
    render(navigation_data = {}) {
        return <HtmlView src={'hello_world.html'}/>
    }
}

export default Index;