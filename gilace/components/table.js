import Request from "../core/request.js";
import Component from "../Component.js";

class table extends Component {
    name = '';
    onLoadRowData_eventHandler = async () => {
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


    constructor(args = {}) {
        super(args);
        this.url = empty(args.load) ? '' : args.load;
        this.empty_state = empty(args.empty_state) ? {} : args.empty_state;
        this.page = empty(args.page) ? 1 : args.page;
        this.count_per_page = empty(args.count_per_page) ? 5 : args.count_per_page;
        this.header = empty(args.header) ? null : args.header;
        this.data = empty(args.data) ? [] : args.data;
    }

    reload() {
        this.load(this.page, this.count_per_page);
    }

    async getData() {
        await self.onLoadRowData_eventHandler(row).then((res) => {
            return res;
        });
    }

    async load_data(page, count, resolve) {
        let self = this;
        let url = self.url;
        console.log(url);

        if (!empty(url)) {
            url = new URL(self.url);
            console.log(url);
            let param = new URLSearchParams(url.search);
            param.append('page', page);
            param.append('count', count);
            let _url = url.origin + '/' + url.pathname + '?' + param.toString();
            let html = ``;
            let data = await new Request(_url).get();
            console.log(data);
            if (data.rows != undefined && data.rows.length > 0) {
                self.data = data;
                self.page = page;
                self.count_per_page = count;
                for (let row of data.rows) {
                    let _h = await self.onLoadRowData_eventHandler(row);
                    console.log(_h);
                    html += _h;
                }
                html = this.setLayout(html);

            }

            return html;
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

    render(wrapper) {
        let res = this.load_data(this.page, this.count_per_page);
        console.log(res);
        return res;
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