class app_tools {
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
            <img src="${(APPPATH + "dashboard/assets/img/illustration/" + data.image)}">
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

        return result;
    }

    static core_assets(assets) {
        return window.location.protocol + '//' + window.location.hostname + '/system/core/' + assets
    }

    static assets(assets) {
        return window.location.protocol + '//' + window.location.hostname + '/assets/' + assets
    }

    static defaultToolbar() {
        return `<div class="card toolbar">
                <div class="card-body d-flex justify-content-between p-0">
                </div>
            </div>`
    }

    static get_toolbar(_toolbar = ``) {
        console.log('toolbar=>');
        console.log(_toolbar);
        let toolbar = ``;
        switch (_toolbar) {
            case null:
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
                <div class="_page_loader bg-light" style="
    position: absolute;
    z-index: 1000;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    display: none;">
                    <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);text-align: center">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>
                </div>
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
}
export default app_tools

