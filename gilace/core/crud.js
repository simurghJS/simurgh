class Crud extends Gilace {

    crud_model = {}

    start(app_data) {
        this.LayoutManager.setAppTitle(this.title);
        gilace.LayoutManager.setAppActions(`<button class="btn btn-primary" id="new_tag">
<i class="fa fa-plus ml-2"></i>
افزودن محتوا جدید</button>`)
        this.form_manager = new this.modules.form({
            base_url:this.api_url,
            url: this.api_url + '/store',
            model: this.data_model,
            open_el: '#new_tag',
            list: {
                empty_state: this.empty_state,
                loop: (data, index) => {
                    return this.onRowRender(data, index);
                },
                on_rendered: (table) => {
                    this.onRendered(table);
                }
            }
        });
    }

    onRowRender(data, index) {
        let rndData = ``;
        if (!gilace.helper.empty(this.visible_columns) && !gilace.helper.empty(this.visible_columns)) {
            for (let key of this.visible_columns) {
                rndData += `<div>${data[key]}</div>`
            }
        } else {
            for (let [key, value] of Object.entries(this.data_model)) {
                rndData += `<div>${data[key]}</div>`
            }
        }
        return (`
<div class="card gcore_row mb-2" data-index="${index}">
    <div class="card-body d-flex justify-content-between align-items-center">
        ${rndData}
        <div>
            <button type="button" class="btn btn-link gcore_row_edit${this.name}" data-id="${data.id}">
                <span class="fa fa-pencil"></span><span class="mr ml">ویرایش</span>
            </button>
            <button type="button" class="btn btn-link text-danger gcore_row_delete${this.name}" data-id="${data.id}">
                <span class="fa fa-trash"></span><span class="mr ml">حذف</span>
            </button>
        </div>
    </div>
</div>`);
    }

    onRendered(tbl) {
        let table = tbl;
        $('.gcore_row_edit' + this.name).click((ev) => {
            let id = $(ev.currentTarget).data('id');
            for (let row of table.data.rows) {
                if (row.id == id) {
                    this.form_manager.open_update_form(row);
                }
            }
        });
        $('.gcore_row_delete' + this.name).click((ev) => {
            this.server.permission('آیا میخواهید ' + this.title + ' مورد نظر را حذف نمایید', () => {
                this.server.Get(this.api_url + '/delete/' + $(ev.currentTarget).data('id'), () => {
                    table.reload();
                });
            });
        });
    }

    set_model(model) {
        this.title = model.title;
        this.api_url = model.base_url;
        this.data_model = model.data_model;
        this.empty_state = model.empty_state;
        this.visible_columns=model.visible_columns;
    }
}

export default Crud;