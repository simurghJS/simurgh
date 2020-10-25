class form1 {
    name = "";
    content = ``;
    url = "";
    data = {};

    constructor(obj) {
        if (typeof obj == "object") {
            obj && Object.assign(this, obj);
        } else {
            this.name = obj.name;
            this.title = obj.title;
        }
    }

    onSubmit(CallBack = () => {
    }) {
        $("#submit_" + this.name + "_form").unbind("click");
        $("#submit_" + this.name + "_form").click(() => {
            if (typeof CallBack == "function") {
                let postData = {};
                for (let [key, value] of Object.entries(this.data)) {
                    if ($('#' + this.name + ' #' + key).length == 1) {
                        let el = $('#' + this.name + ' #' + key);

                        if (el.attr('type') != 'checkbox') {
                            postData[key] = $('#' + this.name + ' #' + key).val();
                        } else {
                            postData[key] = el.is(':checked');
                        }
                    }
                }
                console.log(postData);
                if (this.url.length > 0) {
                    gilace.server.Post(this.url, postData, (response) => {
                        CallBack();
                        gilace.helper.alert(response.message, response.status);
                    });
                } else {
                    CallBack(postData);
                }
            }
        });
        return this;
    }

    /** clear form **/
    clear() {
        for (let [key, value] of Object.entries(this.data)) {
            if ($('#' + this.name + ' #' + key).length == 1) {
                $('#' + this.name + ' #' + key).val("");
            }
        }
        return this;
    }

    /** init form by new data **/
    init(object = {}, url = this.url) {
        this.clear();
        this.data = object;
        for (let [key, value] of Object.entries(object)) {
            if ($('#' + this.name + ' #' + key).length == 1) {
                let el = ('#' + this.name + ' #' + key);
                if ($(el).attr('type') == 'checkbox') {

                    if (value > 0 || value == 'true' || value == true) {
                        $(el).attr('checked',true);
                    }else{
                        $(el).removeAttr('checked');
                    }

                } else {
                    $('#' + this.name + ' #' + key).val(value);
                }
            }
        }
        this.setUrl(url);
        return this;
    }

    generate_formControl(element) {
        let control = ``;
        switch (element.type) {
            case "text":
            case "icon":
                control = `<input id="${element.key}" type="text" class="form-control _darr" value="${element.value}" data-key="${element.key}">`;
                if (element.type == 'icon') {
                    control += `<div><small><a target="_blank" href="https://fontawesome.bootstrapcheatsheets.com/">انتخاب آیکون</a> (متن زیر آیکون را بدون علامت . کپی کنید)</small></div>`
                }
                break;
            case "color":
                control = `<input id="${element.key}" type="color" class="form-control _darr" value="${element.value}" data-key="${element.key}">`;
                break;
            case "select":
                control = `<select class="form-control" data-key="${element.key}">`;
                element.options.forEach((item) => {
                    control += `<option value="${item.value}">${item.key}</option>`
                });
                control += `</select>`;
            case "image":
                control = `
<input type="hidden" class="form-control _darr" id="${element.key}" value="${element.value}" data-key="${element.key}">
<div class="poster bg-light" style="padding-top: 100%;background-image: url('/${element.value}');background-position: center;background-size:contain;background-repeat: no-repeat;" data-key="${element.key}"></div>`;
                break;
            case "data_array":
                let rows = ``;
                let theader = `<tr>`;
                let index = 0;
                for (let p of element.value) {
                    rows += `<tr>`
                    for (let [key, value] of Object.entries(p)) {
                        if (index == 0) {
                            theader += `<th>${key}</th>`;
                        }
                        rows += `<td>${value}</td>`
                    }
                    if (index == 0) {
                        theader += `<th>عملیات</th>`
                    }
                    rows += `<td><button data-index="${index}" data-key="${element.key}" type="button" class="btn btn-link text-danger remove_data_array"><i class="fa fa-trash"></i></button></td>`;
                    rows += `</tr>`;
                    index++;
                }
                theader += `</tr>`;
                control = `       <div>
        <table class="table table-striped table-hover table-baseline" style="width:100%">
 <thead>${theader}</thead>
 <tbody>${rows}</tbody>
</table>
                <button type="button" class="btn btn-link save_component_data_array" data-key="${element.key}">
                <i class="fa fa-plus"></i>
                افزودن مقدار جدید
</button>
</div>`
                break;
            default:
                break;
        }
        return control;
    }

    init_crud(data_model = [], callback = () => {
    }) {
        let form_controls = ``;
        data_model.forEach((element) => {
            form_controls += `<div class="form-group">
<label>${element.title}</label>
<div>${this.generate_formControl(element)}
</div>
</div>`;
        });

        $('#' + this.name + '_body').html(form_controls);

        callback();
        return this;
    }


    /** set form url **/
    setUrl(url) {
        this.url = url;
        return this;
    }

    /** render component as html **/
    render() {
        let html = `<div class="card" id="${this.name}">
    <div class="card-body">
        <div class="col-sm-12">
        <div class="form-group" id="${this.name}_body">
        ${this.content}  
</div>    
            <div class="form-group">
                <button type="button" class="btn btn-primary" id="submit_${this.name}_form">
                    ذخیره<span class="fa fa-check" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </div>
</div>`;
        return html;
    }
}

export default form1;