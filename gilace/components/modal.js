class modal {
    title = '';
    content={
        render(){
            return ``;
        }
    };
    size='';
    content_type='component'

    constructor(obj) {
        if (typeof obj == "object") {
            obj && Object.assign(this, obj);
        } else {
            this.name = obj.name;
            this.title = obj.title;
        }
        console.log(obj);
        switch (this.modal_size) {
            case 'large':
                this.modal_class=' modal-lg ';
                break;
            default:
                this.modal_class=' ';
        }
    }

    set_content(content) {
        this.content = content;
        $(this.getBody()).html(content);
        this.content_type='rawhtml'
        return this;
    }
    onshow(handler=(event)=>{}){
        $("#" + this.name + "_modal").on('show.bs.modal', (event) => {
            try {
                handler(event);
            } catch (e) {
                gilace.helper.alert(e.message,'failed');
            }
        });
    }
    onhide(handler=(event)=>{}){
        $("#" + this.name + "_modal").on('hidden.bs.modal', (event) => {
            try {
                handler(event);
            } catch (e) {
                gilace.helper.alert(e.message,'failed');
            }
        });
    }
    openDialog() {
        $("#" + this.name + "_modal").modal('show');
    }
    closeDialog() {
        $("#" + this.name + "_modal").modal('hide');
    }
    setTitle(title){
        $('#'+this.name+'_modal_title').text(title);
        return this;
    }

    hide() {
        $("#" + this.name + "_modal").modal('hide');
    }

    getBody(){
        return '#'+this.name+"_modalBody";
    }

    render() {
        let html = `<div class="modal fade" id="${this.name}_modal" tabindex="-1" role="dialog" aria-labelledby="${this.name}ModalScrollableTitle" aria-hidden="true">
                    <div class="modal-dialog ${this.modal_class} modal-dialog-scrollable ${this.size}  modal-dialog-centered" role="document" style="width: 80%;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 id="${this.name}_modal_title">${this.title}</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body" id="${this.name}_modalBody">${this.content_type=='rawhtml'?this.content:this.content.render()}</div>
                        </div>
                    </div>
                </div>`;
        $('#'+this.name+'_modal').remove();
        $(document.body).append(html);
    }
}

export default modal;