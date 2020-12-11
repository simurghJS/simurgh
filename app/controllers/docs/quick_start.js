import {HtmlView} from "/core/components.js";

class Quick_start extends Component {

    render(navigation_data = {}) {
        return <HtmlView src={'quick_start.html'}></HtmlView>
    }

    on_rendered() {

        $('code').each((i,e)=>{
            let html= Prism.highlight($(e).text(),Prism.languages.javascript,'javascript');
            $(e).html(html);
        })

    }

}

export default Quick_start;