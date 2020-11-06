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
                ]).then(()=>{
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
        if(typeof object == "object"){
           let arr= Object.entries(object);
           if(arr.length<=0){
               return true;
           }
        }

        return result;
    }
     empty2(val,nan=false) {
        if (val == undefined || val == null || !val || val == '0' || val == '' || val == 'undefined') {
            return true;
        }
        if (nan) {
            if(!isNaN(val)){
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
        let picture=gilace.helper.assets('img/user1.png');
        return `<div class="card toolbar">
                <div class="card-body d-flex justify-content-between p-0">
                    <div style="align-self: center;">
                           <button class="toolbar_item btn btn-link" data-gcore-action="run:index">
                        <img src="${this.assets('img/logo_min.png')}" style="height: 35px;margin: 0 .5rem;">
                    </button>
                        <a class="toolbar_item" href="http://www.gilace.com"><span>خدمات گیلاس</span></a>
                        <a class="toolbar_item" href="http://gshop.docs.gilace.com/"><span>راهنمای استفاده</span></a>
                    </div>

                    <div style="align-self: center;direction: ltr;">
                        <div class="toolbar_item">
                            <a class="toolbar_item_toggle" href="#">
                                <i class="fa fa-user-circle fa-lg"></i>

                                <span>${gilace.auth.get_auth().email}</span>

                            </a>
                            <div class="card toolbar_submenu">
                                <div style="    background-color: #fff;
    box-shadow: 3px 3px 3px 0 rgba(23,50,68,.1);
    content: '';
    height: 15px;
    width: 15px;
    left: calc(2rem + 8px);
    top: calc(0% - 8px);
    -webkit-transform: translateX(0) rotate(-135deg);
    transform: translateX(0) rotate(-135deg);
    z-index: 11;
    position: absolute;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;"></div>
                                <div class="card-body">
                                
                                    <img src="${picture}" class="rounded-circle w-50"
                                         style="min-width: 60px;">
                                    <div class="pt-3 pb-3">
                                        <label>${gilace.auth.get_auth().name+' '+gilace.auth.get_auth().family}</label>
                                    </div>
                                </div>
                                <div class="card-body border-top bg-light text-right rtl">
                                    <div class="pb-2">
                                        <button type="button" class="btn btn-link text-dark"
                                                data-gcore-action="run:dashboard/profile">
                                            <i class="fa fa-pencil"></i>
                                            ویرایش پروفایل
                                        </button>
                                    </div>
                                    <div class="pb-2">
                                        <button type="button" class="btn btn-link text-dark"
                                                data-gcore-action="run:dashboard/proile">

                                            <i class="fa fa-lock"></i>
                                            تغییر کلمه عبور
                                        </button>
                                    </div>
                                    <div class="pb-2">
                                        <button type="button" class="btn btn-link text-dark"
                                                data-gcore-action="run:login"
                                                class="text-dark">

                                            <i class="fa fa-sign-out"></i>
                                            خروج
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="toolbar_item">
                        <button class="toolbar_item_toggle btn btn-link m-2">
                            <i class="fa fa-bell fa-lg"></i>
                        </button>
                        </div>
                        <div class="toolbar_item">
                            <a class="toolbar_item_toggle" href="#" id="show_inbox_popup">
                                <i class="fa fa-envelope fa-lg"></i>
                                <span class="badge count-badge" id="message_count"></span>
                            </a>
                            <div class="card toolbar_submenu" style="direction: rtl;width: 500px;left: -2rem">
                                <div style="background-color: #fff;
    box-shadow: 3px 3px 3px 0 rgba(23,50,68,.1);
    content: '';
    height: 15px;
    width: 15px;
    left: calc(2rem + 8px);
    top: calc(0% - 8px);
    -webkit-transform: translateX(0) rotate(-135deg);
    transform: translateX(0) rotate(-135deg);
    z-index: 11;
    position: absolute;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;">

                                </div>
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h5>پیام ها</h5>
                                    <div class="d-flex justify-content-around align-items-center">
                                        <button type="button" class="btn btn-link m-2"
                                                data-gcore-action="get:dashboard/crm/message">
                                            <i class="fa fa-envelope"></i>
                                            صندوق دریافت پیام
                                        </button>

                                        <button type="button" class="btn btn-link m-2"
                                                data-gcore-action="get:crm/messages/seen_all">
                                            <i class="fa fa-envelope-open-o"></i>
                                            تایید همه
                                        </button>

                                    </div>
                                </div>
                                <div class="card-body" id="load_message">
                                </div>
                            </div>
                        </div>
                    </div>
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
        return `  <div class="container-fluid">
        <div class="row">
            ${this.get_toolbar(_toolbar)}
            <div class="col-lg-2 col-md-4 col-sm-4 sidebar" style="display: none" id="drawer_navigator"></div>
            <div class="col-lg-12 col-lg-offset-0 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4"
                 style="padding: 0;position: absolute;overflow: hidden;z-index: 1;" id="app_wrapper">
                <div style="padding:50px 1.5rem 0;">
                    <div class="row">

                        <div class="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">

                                    <li class="breadcrumb-item"><a href="/dashboard">داشبورد</a></li>
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
                </div>
            </div>
        </div>
    </div>`
    }
    static generateRandomString(){
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
export default Tools