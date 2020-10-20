import toolbar from "../components/toolbar.js";

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

    render_layout(app = {}) {
        return new Promise((resolve, reject) => {
            if (!gilace.helper.empty(app.title)) {
                document.title = TITLE_PREFIX + app.title;
            } else {
                document.title = TITLE_PREFIX + app.title;
            }
            let layout = gilace.helper.createAppLayout(app.toolbar);
            $('#gilace_app').html(layout);

            /** navigation **/
            if (empty(gilace.drawer_navigation_args)) {
                console.log('1');
                $('#drawer_navigator').hide();
                $('#drawer_navigator').html(``);
                $('#app_wrapper').removeClass('col-lg-10').addClass('col-lg-12');
                $('#app_wrapper').removeClass(' col-lg-offset-2').addClass(' col-lg-offset-0');
            }
            else {
                console.log('2');
                $('#drawer_navigator').show();
                $('#drawer_navigator').html(gilace.navigation.createDrawerNavigation(gilace.drawer_navigation_args));
                $('#app_wrapper').removeClass('col-lg-12').addClass('col-lg-10');
                $('#app_wrapper').removeClass(' col-lg-offset-0').addClass(' col-lg-offset-2');
            }
            /** check for page title & breadcrump **/
            if (!gilace.helper.empty(app.toolbar)) {
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
                    gilace.LayoutManager.render_html((app.navigation_header, '#gcore_app_title_wrapper'));
                }
                $('#gcore_app_title').text(app.title);
                $('#gcore_app_actions').html(app.actions);
                new toolbar();
            }

            console.log('1');
            if (!gilace.helper.empty(app.template)) {

                fetch(APPPATH + 'application/views/' + app.template).then(response => response.text()).then((data) => {
                    this.render_html(app.template);
                    this.render_html(data);
                    console.log('2');
                    resolve();
                }).catch((err) => {
                });
            } else {
                resolve();
            }
            for (let launcher of this.launchers) {
                $('.editor_controls').append(this.generate_launcher_icon(launcher))
            }
        });
    }

    generate_launcher_icon(launcher = {}) {
        return ` <div class="form-group">
        <button type="button" class="btn btn-light rounded-circle launcher" id="${launcher.app_name}_launcher" data-app="${launcher.app_name}" data-tooltip="${launcher.tip}">
            <img style="max-width: 80%" src="${launcher.icon}">
        </button>
    </div>`;
    }

    render_html(html = ``, wrapper = '#gcore_app_wrapper') {
        $(wrapper).html(html);
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
    render_component(component, wrapper = '#gcore_app_wrapper') {
        try {
            wrapper = gilace.helper.empty(wrapper) ? '#gcore_app_wrapper' : wrapper;
            let cmp = this.get_component(component);
            if (cmp != null && typeof cmp == "object") {
                cmp.render(wrapper);
            }
        } catch (e) {
            gilace.helper.alert(e.message, 'danger');
        }
    }

    init_cli_exec() {
        console.log('3');
        $('[data-navigate]').unbind('click');
        $('[data-navigate]').click((ev) => {
            let navigate_to = $(ev.currentTarget).data('navigate');
            if (!gilace.helper.empty(navigate_to)) {
               gilace.navigation.navigate(navigate_to);
            }
        });
    }

    setAppTitle(title = '') {
        $('#gcore_app_title').html(title);
    }

    setAppActions(action = ``) {
        $('#gcore_app_actions').html(action);
        this.init_cli_exec();
    }
}

export default LayoutManager;