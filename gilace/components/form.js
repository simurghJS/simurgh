export default class Form {
    base_url = ''
    model = {};
    submitter = ''
    auto_crud = true
    open_el = ''

    constructor(args, on_submit = () => {
    }) {
        this.name = uuid();
        if (typeof args == "object") {
            args && Object.assign(this, args);
        }
        //this.init(on_submit);
    }

    init(callback) {
        if (this.auto_crud) {
            let form_controls = ``;
            for (let [key, value] of Object.entries(this.model)) {
                form_controls += `
<div class="form-group">
    <label>${typeof value.title == "string" ? value.title : key}</label>
    <div>${this.generate_formControl(value, key)}
    </div>
</div>`;
            }
            form_controls += `
<div class="form-group">
<button type="button" id="submitter_${this.name}" class="btn btn-primary">ثبت اطلاعات</button>
</div>`;
            import('../components/modal.js').then((module) => {

                let modal = new module.default({name: 'modal_' + this.name}).set_content(form_controls);
                gilace.LayoutManager.render_component(modal);
                $(this.open_el).click(() => {
                    this.clear();
                    this.post_path = this.base_url + '/store'
                    modal.openDialog();
                });
                $('#submitter_' + this.name).click(() => {
                    this.register_form(callback);
                });

                if (!gilace.helper.empty(this.list)) {

                    import('../components/table.js').then((tbl_module) => {
                        gilace.LayoutManager.render_component(new tbl_module.default({
                            name: 'crud_tbl_' + this.name,
                            url: this.base_url + '/lists',
                            empty_state: this.list.empty_state
                        }).loopData((social) => {
                            return this.list.loop(social);
                        }).then(() => {
                            this.list.on_rendered(gilace.LayoutManager.get_component('crud_tbl_' + this.name));
                        }), this.list.wrapper);
                    });

                }

            });
        } else {
            for (let [key, value] of Object.entries(this.model)) {
                this.set_form_data(key, value);
            }
            $(this.submitter).click((ev) => {
                this.register_form(callback);
            });
        }
    }


    clear() {
        for (let [key, value] of Object.entries(this.model)) {
            this.set_form_data(key, value);
        }
    }

    open_update_form(data) {
        let mymodal = gilace.LayoutManager.get_component('modal_' + this.name);
        console.log(data);
        for (let [key, value] of Object.entries(data)) {
            this.set_form_data(key, value);
        }
        this.post_path = this.base_url + '/update/' + data.id;
        mymodal.setTitle("ویرایش تگ").openDialog();
    }

    set_form_data(key, value) {
        if (typeof value == "string") {
            value = {
                type: 'text',
                value: value
            }
        }
        if (!gilace.helper.empty(value.attr)) {
            for (let [_key, _value] of Object.entries(value.attr)) {
                $('#' + this.name + '_' + key).attr(_key, _value);
            }
        } else if (!gilace.helper.empty(value.data)) {
            for (let [_key, _value] of Object.entries(value.data)) {
                $('#' + this.name + '_' + key).data(_key, _value);
            }
        } else {
            $('#' + this.name + '_' + key).val(value.value);
        }

    }

    retrieve_data() {
        let data = [];
        for (let [key, value] of Object.entries(this.model)) {
            if (typeof value == "string") {
                data[key] = $('#' + this.name + '_' + key).val();
            } else {
                data[key] = $('#' + this.name + '_' + key).val();
            }
        }
        return data;
    }

    generate_formControl(element, key) {
        let control = ``;
        if (typeof element == "string") {
            element = {
                type: 'text',
                value: element
            }
        }
        element.key = this.name + '_' + key;
        switch (element.type) {
            case "text":
                control = `<input id="${element.key}" type="text" placeholder="${element.placeholder}" class="form-control" value="${element.value}" data-key="${element.key}">`;
                break;
            case "richText":
                control = `<textarea id="${element.key}" class="form-control" data-key="${element.key}">${element.value}</textarea>`;
                break;
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
            default:
                break;
        }
        return control;
    }

    register_form(callback) {
        gilace.server.Post(this.post_path, this.retrieve_data(), (response) => {
            gilace.helper.alert(response.message, response.status);
            gilace.LayoutManager.get_component('crud_tbl_' + this.name).reload();
            gilace.LayoutManager.get_component('modal_' + this.name).closeDialog();
            callback();
        });
    }

    init_crud(data_model = [], callback = () => {
    }) {
        let form_controls = ``;
        data_model.forEach((element) => {

        });

        $('#' + this.name + '_body').html(form_controls);

        callback();
        return this;
    }
}