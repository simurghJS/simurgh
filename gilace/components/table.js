class table {
    name = '';
    onLoadRowData_eventHandler = () => {
    };
    onLoadData_eventHandler = () => {
    };
    _setLayout = (data) => {
        let html = `<div class="${this.name}">
                                <div class="${this.name}pagination_wrapper"></div>
                                <ul class="gshop_table_rows m-0 p-0">${data}</ul>
                                <div class="${this.name}pagination_wrapper"></div>
                            </div>`;
        return html;
    }
    url = '';
    empty_state = {};
    page = 1;
    count_per_page = 5;
    header = null;
    data = [];


    constructor(args) {
        if (args.name != undefined) {
            this.name = args.name;
        }
        if (args.count_per_page != undefined) {
            this.count_per_page = args.count_per_page;
        }
        if (args.loop != undefined && typeof args.loop == 'function') {
            this.loop_items = args.loop;
        }
        if (args.after_load != undefined && typeof args.on_load == 'function') {
            this.after_load = args.on_load;
        }
        if (args.empty_state != undefined && typeof args.empty_state == "object") {
            this.empty_state = args.empty_state;
        }
        if (args.url != undefined) {
            this.url = args.url;
        }
        if (args.header != undefined) {
            this.header = args.header;
        }
        if (args._setLayout != undefined) {
            this._setLayout = args._setLayout;
        }
    }

    reload() {
        this.load(this.page, this.count_per_page);
    }

    load(page, count,resolve) {
        let self = this;
        let url = self.url;
        console.log(url);

        if (!empty(url)) {
            url = new URL(BASEURL + self.url);
            console.log(url);
            let param = new URLSearchParams(url.search);
            param.append('page', page);
            param.append('count', count);
            let _url = url.pathname + '?' + param.toString();
            console.log(_url);
            new request(_url).get().then((responseJson) => {
                let html = ``;
                if (responseJson.rows != undefined && responseJson.rows.length > 0) {
                    self.data = responseJson;
                    self.page = page;
                    self.count_per_page = count;
                    for (let row of responseJson.rows) {
                        html += self.onLoadRowData_eventHandler(row);
                    }
                    html = this.setLayout(html);
                } else {
                    html = gilace.helper.empty_state({
                        image: self.empty_state.image,
                        title: self.empty_state.title,
                        text: self.empty_state.text
                    });
                }
                gilace.layoutManager.render_html(html, self.wrapper);
                $('.' + self.name + ' .gshop_table_rows').css('minHeight', (screen.height * (.5)) + 'px');
                this.pagination(responseJson.pagination, function (page) {
                    self.load(page, count);
                });
            }).catch((err) => {
                console.log(err.message);
            }).finally(() => {
                this.onLoadData_eventHandler();
                if(typeof resolve=="function"){
                    resolve();
                }
            })
        }
    }

    setLayout(data) {
        let html = data;
        if (this.header == null) {
            html = this._setLayout(html);
        } else {
            html = `
<div class="card">
<div class="card-body">
<div class="table-responsive gshop_table_rows">
    
                                <div class="${this.name}pagination_wrapper"></div>
                        <table class="table table-striped table-hover table-baseline" style="width:100%">
                            <thead>
                         ${this.header}
                            </thead>
                            <tbody class="text-center">
                        ${data}
                            </tbody>
                        </table>
                        
                                <div class="${this.name}pagination_wrapper"></div>
                    </div>
</div>
</div>`
        }
        return html;
    }

    loopData(callback) {
        if (typeof callback == "function") {
            this.onLoadRowData_eventHandler = callback;
        }
        return this;
    }

    then(callback) {
        if (typeof callback == "function") {
            this.onLoadData_eventHandler = callback;
        }
        return this;
    }

    render(wrapper,resolve) {
        this.wrapper = wrapper;
        this.load(this.page, this.count_per_page,resolve);
    }

    print() {
        let html = '<html><head></head><body>ohai</body></html>';
        let uri = encodeURIComponent(html);
        let newWindow = window.open();
        newWindow.print();
        newWindow.close();
        newWindow.document.body.innerHTML = "<div>hello word</div>";
    }

    pagination(data, callback) {
        if (data != undefined) {
            let page = data.page;
            let count = data.count;
            let per_page = data.per_page;

            let page_count = (count % per_page) > 0 ? Math.floor(count / per_page) + 1 : count / per_page;

            let paginationHtml = `<nav aria-label="..."><ul class="pagination">`;

            if (page == 1) {
                paginationHtml += ` <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1">قبلی</a>
    </li>`
            } else {
                paginationHtml += ` <li class="page-item">
      <a class="page-link" href="#" data-page="${parseInt(page) - 1}">قبلی</a>
    </li>`
            }
            for (let i = 1; i <= page_count; i++) {
                let active = '';
                if (page == i) {
                    active = ' active ';
                }
                paginationHtml += `<li class="page-item${active}"><button class="page-link" type="button" data-page="${i}">${i}</button></li>`;
            }


            if (page == page_count) {
                paginationHtml += ` <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1">بعدی</a>
    </li>`
            } else {
                paginationHtml += ` <li class="page-item">
      <a class="page-link" href="#" data-page="${(parseInt(page) + 1)}"> بعدی </a>
    </li>`
            }

            paginationHtml += `</ul></nav>`;


            if (page_count > 1) {
                $('.' + this.name + 'pagination_wrapper').html(paginationHtml);
            }

            $('.page-link').click(function () {

                let page = $(this).data('page');
                callback(page);

            });
        } else {
        }
    }
}

export default table;