import table from "./table.js";

class filemanager {

    title = 'فایل منیجر';
    content = {};
    name = '';
    multiply = false;

    onSelected_eventHandler = (file = {}) => {
    }

    constructor(obj) {
        if (typeof obj == "object") {
            obj && Object.assign(this, obj);
        } else {
            this.name = obj.name;
            this.title = obj.title;
        }

        if (!$('#' + this.name + '_modal').length) {
            this.render();
        }

    }

    onSelect(callback = () => {
    }) {
        if (typeof callback == "function") {
            this.onSelected_eventHandler = callback;
            console.log('callback set');
        }
    }

    set_content(content) {
        this.content = content;
        return this;
    }

    openDialog(args = {}) {

        if (!gilace.helper.empty(args.multiply)) {
            this.multiply = args.multiply;
        }
        gilace.LayoutManager.render_component(new table({
                name: 'files_table',
                count_per_page: 50,
                url: 'filemanager/lists',
                _setLayout: (data) => {
                    return (`
<div class="d-flex flex-wrap align-items-center w-100">
${data}
</div>
<div class="files_tablepagination_wrapper text-center"></div>
`)
                }
            })
                .loopData((file, index) => {
                    return `<div class="filebox m-3 d-block" data-id="${file.id}">
                        <div class="img-thumbnail" style="background-image: url('${gilace.helper.assets('img/file/image-file.png')}')" data-src="${ASSETSPATH + file.url}"></div>
                  </div>`;
                })
                .then(() => {
                    $('.filebox').on('dblclick', (ev) => {
                        let rows = gilace.LayoutManager.get_component('files_table').data.rows;
                        let result;
                        let key = "id";
                        let value = $(ev.currentTarget).data('id');
                        for (let row of rows) {
                            if (row[key] === value) {
                                result = row;
                                break;
                            }
                        }

                        let html = this.image_preview(result);

                        let fp = '#' + this.name + 'file_preview_wrapper';
                        $(fp).html(html).show();
                        $('#' + this.name + '_modal_body').css('padding-right', '300px');

                        let selected = new Array();

                        selected.push(result);

                        this.onSelected_eventHandler(selected);
                    });
                    $('.filebox').on('click', (ev) => {

                        if (!this.multiply) {
                            $('.filebox').removeClass('selected');
                        }

                        $(ev.currentTarget).toggleClass('selected');


                        if (this.multiply && $('.filebox.selected').length > 0) {
                            if ($("#" + this.name + "_modal #" + this.name + "_select_button").length == 0) {
                                let selectButton = `<button type="button" class="btn btn-primary" id="${this.name}_select_button">انتخاب</button>`;
                                $("#" + this.name + "_modal .modal-footer").append(selectButton);

                                $("#" + this.name + "_modal #" + this.name + "_select_button").click(() => {

                                    let selected = [];
                                    $('.filebox.selected').each(function () {
                                        selected.push($(this).data('id'));
                                    });

                                    this.onSelected_eventHandler(selected);

                                });
                            }
                        }

                    });
                    this.load_files();
                }),
            '#' + this.name + '_modal_body');
        console.log("#" + this.name + "_modal");
        $("#" + this.name + "_modal").modal('show');
        return this;
    }

    load_files() {

        let load_list = $('.filebox').not('.loaded');
        if (load_list.length > 0) {

            let url = $(load_list[0]).find('.img-thumbnail');
            let src=$(url).data('src');
            let image=new Image();
            image.onload=(response)=>{
                console.log(response);
                $(url).css('background-image',"url('"+src+"')")
                $(load_list[0]).addClass('loaded');
                this.load_files();
            }
            image.onerror=(error)=>{
                console.log(error)
                $(url).css('background-image',"url('"+gilace.helper.assets('img/file/file-error.png')+"')")
                $(load_list[0]).addClass('loaded');
                this.load_files();
            }
            image.src=$(url).data('src');
        }
    }

    image_preview(file) {
        return (`<div>
<div style="width:100%;
padding-top:100%;
background-image: url('${(file.url)}');
background-position: center;
background-size:contain;
background-repeat: no-repeat"></div>
<h6>${file.name}</h6>
<a class="text-break text-left w-100" href="${(file.url)}">${(APPPATH + file.url)}</a>
</div>`);
    }

    closeDialog() {
        $("#" + this.name + "_modal").modal('hide');
        return this;
    }

    setTitle(title) {
        $('#' + this.name + '_modal_title').text(title);
        return this;
    }

    hide() {
        $("#" + this.name + "_modal").modal('hide');
    }

    render() {
        let html = `<div class="modal fade" id="${this.name}_modal" tabindex="-1" role="dialog" aria-labelledby="${this.name}ModalScrollableTitle" aria-hidden="true" style="z-index: 2000">
                    <div class="modal-dialog modal-dialog-scrollable modal-xl  modal-dialog-centered" role="document" style="width: 90%;max-width: 1400px">
                        <div class="modal-content">
                            <div class="modal-header">
                           
                           <div class="d-flex align-items-center">
                                <div class="ml-3">
                                    <h6 id="${this.name}_modal_title" class="m-0">${this.title}</h6>
                                </div>
                                 <div>
                                    <button id="upload" type="button" class="btn btn-link">
                                    <i class="fa fa-upload"></i>
                                    آپلود فایل جدید
                                  
                                    </button>
                                    <input type="file" id="file_upload" class="d-none">
                                </div>
                           </div>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body bg-light position-relative" style="max-height: 700px;height: 90vh;">
                                <div class="container-fluid">                        
                                    <div class="row" id="${this.name}_modal_body"></div>
                                </div>
                                <div class="file_preview_wrapper" id="${this.name}file_preview_wrapper"></div>
                            </div>
                            <div class="modal-footer"></div>
                        </div>
                    </div>
                </div>`;
        $(document.body).append(html)

        $('#upload').click(() => {
            $('#file_upload').click();
        });

        $('#file_upload').change((ev) => {

            let input = document.querySelector('#file_upload');


            if (input.files != undefined && input.files.length > 0) {
                this.upload(input.files[0]);
            } else {
                gilace.helper.alert('مشکلی پیش آمده', 'danger');
            }
        });
    }

    upload(file, path = '') {
        gilace.server.Post('filemanager/upload', {
            file: file,
            path: path
        }, (data) => {
            gilace.helper.alert(data.message);
            gilace.LayoutManager.get_component('files_table').reload();
        })
    }
}

export default filemanager;