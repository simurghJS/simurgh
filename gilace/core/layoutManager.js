import Navigation from "./Navigation.js";

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
            console.log('analysing request=>');
            console.log(this.request);
            this.createAppLayout(app).then((response) => {
                console.log('generated response =>');
                console.log(response);
                $('#application_wrapper').html(response);

                document.title = global().prefix + global().prefix_separator + app.title;

                /** navigation **/
                let drawer_wrapper=$("div[gilace-rel=drawer_navigation]");
                if(!empty(drawer_wrapper.toArray())) {
                    console.log(drawer_wrapper[0]);
                    if (empty(gApp.drawer_navigation)) {
                        drawer_wrapper.hide();
                        drawer_wrapper.html(``);
                    } else {
                        drawer_wrapper.show();
                        drawer_wrapper.html(new Navigation().createDrawerNavigation());
                    }
                }else{
                    console.log('no drawer...')
                }

                /** check if need template **/
                if (!empty(app.template)) {
                    new HTMLReader().readFromFile(app.template).then((data) => {
                        this.render_html(app.template);
                        this.render_html(data);
                    }).catch((err) => {
                        console.log('cannot load template , see logs=>');
                        console.log(err);
                    }).finally(() => {
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

    /** response **/
    createAppLayout(app) {
        return new Promise((resolve, reject) => {
            console.log('generating response ...')
            let toolbar = empty(app.toolbar) ? null : this.get_toolbar();
            let layout = (empty(app.layout) ? (empty(global().layout) ? '' : global().layout ): app.layout);

            if (!empty(layout)) {
                console.log('load layout => ' + layout);
                new HTMLReader().readFromFile(layout).then((html) => {
                    resolve(this.getResponse(html, toolbar));
                }).catch((err) => {
                    console.log('cannot load layout , see logs');
                    console.log(err.message);
                });
            } else {
                resolve(this.getResponse(null, toolbar));
            }

        });
    }

    /** generating response template **/
    getResponse(layout = ``, toolbar = ``) {
        return `<div class="container-fluid">
                    <div class="row">
                        ${layout}
                    </div>
                </div>`;
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
        $('[gilace-navigate]').unbind('click');
        $('[gilace-navigate]').click((ev) => {
            let navigate_to = $(ev.currentTarget).attr('gilace-navigate');
            if (!empty(navigate_to)) {
                new Navigation().navigate(navigate_to);
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