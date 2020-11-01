import Form from "./components/form.js";
import Table from "./components/table.js";
class Button {

    constructor(content) {
        this.content=content
    }
    render(){
        return `<button type="button" class="btn btn-primary">${this.content}</button>`
    }

}


export {
    Button,
    Table,
    Form
}