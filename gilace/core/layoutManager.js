class launcher {
    constructor(app_name, tip, icon) {
        this.app_name = app_name;
        this.tip = tip;
        this.icon = icon
    }
}

class LayoutManager {
    components = []
    launchers = []
    launcher = launcher
    launched_app = []

    constructor() {
    }

    render_layout(app = {}) {
        this.request = app;
        return new Promise((resolve, reject) => {
            console.log('render request=>');
            console.log(this.request);
            this.createAppLayout(app).then((response)=>{
                console.log(response);
                $('#application_wrapper').html(response);

                document.title = TITLE_PREFIX + app.title;

                /** navigation **/
                if (empty(this.request.drawer_navigation) || empty(gilace.drawer_navigation_args)) {
                    $('#drawer_navigator').hide();
                    $('#drawer_navigator').html(``);
                    $('#app_wrapper').removeClass('col-lg-10').addClass('col-lg-12');
                    $('#app_wrapper').removeClass(' col-lg-offset-2').addClass(' col-lg-offset-0');
                } else {
                    $('#drawer_navigator').show();
                    $('#drawer_navigator').html(gilace.navigation.createDrawerNavigation(gilace.drawer_navigation_args));
                    $('#app_wrapper').removeClass('col-lg-12').addClass('col-lg-10');
                    $('#app_wrapper').removeClass(' col-lg-offset-0').addClass(' col-lg-offset-2');
                }

                /** check for page title & breadcrump **/
                if (!empty(app.toolbar)) {
                    if ($('.breadcrumb #current_breadcrump').length == 1) {
                        $('.breadcrumb #current_breadcrump').text(app.title);
                    } else {
                        let li = document.createElement('li');
                        li.classList = 'breadcrumb-item active';
                        li.id = 'current_breadcrump';
                        $(li).html(`<button class="btn btn-link disabled btn-sm" disabled>${app.title}</button>`)

                        $('.breadcrumb').append(li);
                    }
                    if (!$('#gcore_app_title').length) {
                        gilace.layoutManager.render_html((app.navigation_header, '#gcore_app_title_wrapper'));
                    }
                    $('#gcore_app_title').text(app.title);
                    $('#gcore_app_actions').html(app.actions);
                }

                /** check if need template **/
                if (!empty(app.template)) {

                    fetch(APPPATH + 'application/views/' + app.template).then(response => response.text()).then((data) => {
                        this.render_html(app.template);
                        this.render_html(data);
                    }).catch((err) => {
                    }).finally(() => {
                        console.log('template rendered');
                        resolve();
                    });
                } else {
                    resolve();
                }

                /*for (let launcher of this.launchers) {
                    $('.editor_controls').append(this.generate_launcher_icon(launcher))
                }*/

            });
        });
    }

    createAppLayout(app) {
        return new Promise((resolve,reject)=>{
            let render_response=``;
            let tlbr = empty(app.toolbar) ? null : this.get_toolbar();
            let drw = ``;
            let core =``;
            if(!empty(app.layout)){
                console.log('load layout => ' + app.layout);
                let url=APPPATH + 'application/views/' + app.layout;
                fetch(url).then(response => response.text()).then((data) => {
                    core=data;
                    let core_wrapper = `<div class="col-lg-12 col-lg-offset-0 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4" id="app_wrapper">
                ${core}
            </div>`;
                    if (!empty(gilace.drawer_navigation_args)) {
                        drw = `<div class="col-lg-2 col-md-4 col-sm-4 sidebar" id="drawer_navigator"></div>`
                        core_wrapper = `<div class="col-lg-10 col-lg-offset-2 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4" id="app_wrapper">
                ${core}
            </div>`;
                    }
                    render_response = `<div class="container-fluid">
        <div class="row">
            ${tlbr}
            ${drw}
            ${core_wrapper}
        </div>
    </div>`;
                    resolve(render_response);
                }).catch((err) => {
                });
            }
            else {
                let core_wrapper = `<div class="col-lg-12 col-lg-offset-0 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4" id="app_wrapper">
                ${core}
            </div>`;
                if (!empty(gilace.drawer_navigation_args)) {
                    drw = `<div class="col-lg-2 col-md-4 col-sm-4 sidebar" id="drawer_navigator"></div>`
                    core_wrapper = `<div class="col-lg-10 col-lg-offset-2 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4" id="app_wrapper">
                ${core}
            </div>`;
                }
                render_response = `<div class="container-fluid">
        <div class="row">
            ${tlbr}
            ${drw}
            ${core_wrapper}
        </div>
    </div>`;
                resolve(render_response);
            }

        });
    }

    get_toolbar() {
        let toolbar = ``;
        if (!empty(this.request.toolbar)) {
            // should load custom toolbar
            toolbar = this.defaultToolbar();
        } else {
            if (this.request.toolbar == null) {
                toolbar = ``;
            } else {
                toolbar = this.defaultToolbar();
            }
        }
        return toolbar;
    }

    defaultToolbar() {
        return `<div class="card toolbar">
    <div class="card-body d-flex justify-content-between align-items-center">
        <h5 id="gjs-app-title">${this.request.title}</h5>
    </div>
</div>`
    }


    launch(launcher, callback) {
        let row = this.launched_app.filter(row => {
            return row.app_name == launcher.app_name
        });
        console.log(launcher);
        if (true) {
            console.log('launched!!!!');

            $('._loader').show();
            $('._loader p').text(APPPATH + 'modules/' + launcher.app_name + '.js');
            import(APPPATH + 'modules/' + launcher.app_name + '.js')
                .then(module => {
                    module.default.set_launcher(launcher);
                    module.default.onchange(() => {
                        callback();
                    });
                    this.launched_app.push(launcher);
                    $('._loader').hide();
                })
                .catch(err => {
                    console.log(err.message, 'failed');
                    $('._loader').hide();
                });
        } else {

        }
    }


    generate_launcher_icon(launcher = {}) {
        return ` <div class="form-group">
        <button type="button" class="btn btn-light rounded-circle launcher" id="${launcher.app_name}_launcher" data-app="${launcher.app_name}" data-tooltip="${launcher.tip}">
            <img style="max-width: 80%" src="${launcher.icon}">
        </button>
    </div>`;
    }

    render_html(html = ``, wrapper = '') {
        if (!empty(wrapper)) {
            $(wrapper).html(html);
        } else {
            if ($("div[gilace-rel=response]").length == 1) {
                $("div[gilace-rel=response]").html(html);
            } else {
                $('body').html(html);
            }
        }
    }

    /** add or get components **/
    get_component(component) {
        if (typeof component == "string") {
            for (let cmp of this.components) {
                if (cmp.name == component) {
                    return cmp;
                }
            }
            return null;
        } else {
            this.components.push(component);
            return component;
        }
        return null;
    }

    /** render component data **/
    render_component(component, wrapper = '#gcore_app_wrapper', resolve = null) {
        try {
            wrapper = empty(wrapper) ? '#gcore_app_wrapper' : wrapper;
            let cmp = this.get_component(component);
            if (cmp != null && typeof cmp == "object") {
                cmp.render(wrapper, resolve);
            }
        } catch (e) {
            alert(e.message, 'danger');
        }
    }

    init_cli_exec() {
        console.log('3');
        $('[data-navigate]').unbind('click');
        $('[data-navigate]').click((ev) => {
            let navigate_to = $(ev.currentTarget).data('navigate');
            if (!empty(navigate_to)) {
                gilace.navigation.navigate(navigate_to);
            }
        });
    }

    setAppTitle(title = '') {
        $('#gjs-app-title').html(title);
    }

    setAppActions(action = ``) {
        $('#gcore_app_actions').html(action);
        this.init_cli_exec();
    }
}

export default LayoutManager;