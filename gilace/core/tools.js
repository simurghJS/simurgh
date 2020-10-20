class Tools {

    static alert(text = '', status = 'success', args, callback = null) {
        if (typeof callback != 'function') {
            let html = `<div class="alert alert-${status}">
        <button type="button" class="close" data-dismiss="alert">×</button>
        <p>${text}</p>
    </div>`;
            $(document.body).append(html);
            let delay = status == 'success' ? 3000 : 5000;
            $('.alert').delay(delay).slideUp(300);
        } else {
            if (typeof swal != 'undefined') {
                swal({
                        title: args.title != undefined ? args.title : text,
                        text: args.text != undefined ? args.text : "",
                        type: args.type != undefined ? args.type : "",
                        showCancelButton: args.showCancelButton != undefined ? args.showCancelButton : false,
                        animation: args.animation != undefined ? args.animation : 'slide-from-top',
                        cancelButtonText: args.cancelButtonText != undefined ? args.cancelButtonText : "لغو",
                        confirmButtonColor: args.confirmButtonColor != undefined ? args.confirmButtonColor : "",
                        confirmButtonText: args.confirmButtonText != undefined ? args.confirmButtonText : "",
                        closeOnConfirm: args.closeOnConfirm != undefined ? args.closeOnConfirm : true,
                        showLoaderOnConfirm: args.showLoaderOnConfirm != undefined ? args.showLoaderOnConfirm : true
                    },
                    function () {
                        callback();
                    });
            } else {
                gilace.Loader.load([
                    APPPATH + 'assets/js/sweetalert.min.js',
                    APPPATH + 'assets/css/sweetalert.css'
                ]).then(() => {
                    this.alert(text, status, args, callback);
                });
            }
        }
        return this;
    }

    static empty_state(data) {
        if (data === undefined) {
            data = {}
        }
        data.image = data.image !== undefined ? data.image : 'no_data.png';
        data.title = data.title !== undefined ? data.title : 'چیزی یافت نشد';
        data.text = data.text !== undefined ? data.text : '';

        let html = `<div class="text-center empty_state">
    <div class="w-50 m-auto">
        <div>
            <img src="${(APPPATH + "assets/img/illustration/" + data.image)}">
        </div>
        <br/>
        <h5>${data.title}</h5>
        <p class="text-muted">${data.text}</p>
    </div>
</div>`;
        return html;
    }

    static drawLineChart(id) {
        let data_string = $('#chartDate').val();
        if (data_string != undefined)
            if (data_string.length > 0) {
                let chart_data = JSON.parse(data_string);
                console.log(chart_data);
                let data = [];
                let labels = [];

                for (let key in chart_data) {
                    labels.push(key);
                    data.push(chart_data[key]);
                }

                let ctx = document.getElementById("myChart").getContext("2d");

                let gradient = ctx.createLinearGradient(0, 300, 0, 0);
                gradient.addColorStop(1, "rgba(29,140,248,1)");
                gradient.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

                let gradientStroke = ctx.createLinearGradient(0, 300, 0, 0);

                gradientStroke.addColorStop(1, 'rgba(233,32,16,1)');
                gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

                Chart.defaults.global.defaultFontFamily = 'IranSansWeb';
                Chart.defaults.global.defaultFontSize = 10;
                Chart.defaults.global.defaultFontColor = '#9e9e9e';

                let myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            backgroundColor: gradient,
                            label: 'فروش',
                            borderColor: "#1f8ef1",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#1f8ef1",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#1f8ef1",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: data,
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'آمار فروش سال جاری',
                            fontColor: '#000',
                            fontSize: 15,
                            position: 'top',
                            padding: 20
                        },
                        legend: {
                            position: 'bottom'
                        },
                        scales: {
                            yAxes: [{
                                gridLines: {
                                    drawBorder: false,
                                    drawOnChartArea: false,
                                }
                            }],
                            xAxes: [{

                                gridLines: {
                                    // drawOnChartArea:false,
                                    drawBorder: false,
                                    offsetGridLines: true,
                                    zeroLineWidth: 5,
                                    zeroLineColor: '#fff',
                                }
                            }]
                        }
                    }
                });
            }
    }

    static empty(object) {
        let result = false;
        if (object == undefined || object == null) {
            return true;
        }
        if (Array.isArray(object) && object.length == 0) {
            return true;
        }
        if (typeof object == "string") {
            if (object.length <= 0) {
                return true;
            }
        }
        if (typeof object == "object") {
            let arr = Object.entries(object);
            if (arr.length <= 0) {
                return true;
            }
        }

        return result;
    }

    empty2(val, nan = false) {
        if (val == undefined || val == null || !val || val == '0' || val == '' || val == 'undefined') {
            return true;
        }
        if (nan) {
            if (!isNaN(val)) {
                return true;
            }
        }
        return false;
    }

    static core_assets(assets) {
        return window.location.protocol + '//' + window.location.hostname + '/system/core/' + assets
    }

    static assets(assets) {
        return window.location.protocol + '//' + window.location.hostname + '/assets/' + assets
    }

    static defaultToolbar() {
        let picture = gilace.helper.assets('img/user1.png');
        return `<div class="card toolbar">
    <div class="card-body d-flex justify-content-between p-0">

    </div>
</div>`
    }

    static get_toolbar(_toolbar = ``) {
        let toolbar = ``;
        switch (gilace.helper.empty(_toolbar)) {
            case true:
                toolbar = ``;
                break;
            default:
                toolbar = this.defaultToolbar();
                break;
        }
        return toolbar;
    }

    static createAppLayout(_toolbar = ``) {
        let drw = ``;
        let core = `<div style="padding:50px 1.5rem 0;">
                    <div class="row">

                        <div class="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">

                                    <li class="breadcrumb-item">
                                    <button type="button" class="btn btn-link btn-sm" data-gcore-action="run:index"><span>داشبورد</span></button>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div id="gcore_app_title_wrapper">
                                <div class="col-sm-12">
                                    <div class="d-flex justify-content-between align-content-end pb-5">
                                        <div style="max-width: 50%;">
                                            <h3 id="gcore_app_title"></h3>
                                            <p></p>
                                        </div>
                                      
                                        <div id="gcore_app_actions">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div id="gcore_app_wrapper">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        let core_wrapper = `<div class="col-lg-12 col-lg-offset-0 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4"
                 style="padding: 0;position: absolute;overflow: hidden;z-index: 1;" id="app_wrapper">
                ${core}
            </div>`;
        if (!empty(gilace.drawer_navigation_args)) {
            drw = `<div class="col-lg-2 col-md-4 col-sm-4 sidebar" id="drawer_navigator"></div>`
            core_wrapper = `<div class="col-lg-10 col-lg-offset-2 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4"
                 style="padding: 0;position: absolute;overflow: hidden;z-index: 1;" id="app_wrapper">
                ${core}
            </div>`;
        }
        return `  <div class="container-fluid">
        <div class="row">
            ${this.get_toolbar(_toolbar)}
            ${drw}
            ${core_wrapper}
        </div>
    </div>`
    }

    static generateRandomString() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    static createBlankAppLayout(_toolbar = ``) {
        return `<div class="container-fluid">
    <div class="row">
        ${this.get_toolbar(_toolbar)}
        <div class="col-lg-12" id="gcore_app_wrapper"
             style="padding:50px 0rem 0;position: absolute;height: 100%;max-height: 100%;overflow: hidden;">
        </div>
    </div>
</div>`
    }

    static createBlankSidebarAppLayout(_toolbar = ``) {
        return `<div class="container-fluid">
    <div class="row">
        ${this.get_toolbar(_toolbar)}
         <div class="col-lg-2 col-md-4 col-sm-4 sidebar" style="display: none" id="drawer_navigator"></div>
            <div class="col-lg-10 col-lg-offset-2 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4" id="gcore_app_wrapper"
             style="padding:50px 0rem 0;position: absolute;height: 100%;max-height: 100%;overflow: hidden;">
        </div>
    </div>
</div>`
    }
}

/** class for api call **/
window.api = class {
    constructor(url='') {
        this.api_url=url;
    }
    call = (data = {}) => {

        let url=this.api_url;

        /** request args **/
        let req_args = new Object();
        req_args.encrypt = "multipart/form-data";
        req_args.mode = 'cors';

        /** attach data if exists **/
        if (!empty(data)) {
            req_args.method = 'POST';
            let formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            req_args.body = formData;
        }
        else {
            req_args.method = 'GET';
        }

        /** others param **/
        let headers = {
            headers: new Headers({
                'Authorization': btoa(Math.random(50).toString()),
            })
        };
        let auth = gilace.auth.get_authorization();
        let req_url = BASEURL + url + (!empty(auth) ? '?token=' + btoa(auth) : '');

        /** make request **/
        return fetch(req_url, req_args).then((response) => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw response;
            }
        }).catch((error) => {
            console.log(error);
            try {
                error.json().then((obj) => {
                    gilace.helper.alert(obj.error, 'danger');
                }).catch((e) => {
                    gilace.helper.alert(e.message, 'danger');
                })
            } catch (e) {
                gilace.helper.alert(error.message, 'danger');
            }

        });
    }
}

/** true if empty **/
window.empty = (object) => {
    let result = false;

    if (object == undefined || object == null) {
        return !result;
    }
    if (Array.isArray(object) && object.length == 0) {
        return !result;
    }
    if (typeof object == "string") {
        if (object.length <= 0) {
            return !result;
        }
    }
    if (typeof object == "object") {
        let arr = Object.entries(object);
        if (arr.length <= 0) {
            return !result;
        }
    }

    return result;
}

/** generate random id **/
window.uuid = () => {

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );

}

export default Tools