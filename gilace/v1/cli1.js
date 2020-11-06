import routes from "../config/routes.js";

class Cli1 {
    constructor() {

    }

    execute(app_data) {
        let command = app_data.command.split(':');
        switch (command[0]) {
            case 'get':
                gilace.server.Get(command[1]);
                break;
            case 'run':
                $('._page_loader').show();
                let route = new routes(app_data.navigation_data).get(command[1]);
                let path = route.command == 'auto-crud' ? APPPATH + 'application/models/' + route.model_name + '.js' : APPPATH + 'application/controllers/' + route.command + '.js';

                console.log(path);

                import(path).then(module => {
                    let new_title = module.default.title;
                    history.pushState({
                        id: Math.random(),
                        command: app_data
                    }, new_title, APPPATH + route.url);
                    switch (route.command) {
                        case 'auto-crud':
                            let model = module.default;
                            import('./crud.js').then(crd => {
                                let crud=new crd.default();
                                crud.set_model(model);
                                gilace.LayoutManager.render_layout(crud).then(() => {
                                    sessionStorage.setItem('current_stack', JSON.stringify({
                                        current_stack: route.name
                                    }));
                                    crud.run(app_data.navigation_data);
                                });

                            })
                            break;
                        default:
                            gilace.LayoutManager.render_layout(module.default).then(() => {
                                sessionStorage.setItem('current_stack', JSON.stringify({
                                    current_stack: route.name
                                }));
                                module.default.run(app_data.navigation_data);
                            });
                            break;
                    }
                })
                    .catch(err => {
                        console.log(err.message, 'failed');
                        $('.gcore-loading').hide();
                    });

                break;
            case 'navigate':
                window.location = APPPATH + command[1];
                break;
        }
    }

    exe(command = '') {

    }

    parse_command(command) {
        let cmd = {
            command: ''
        }
    }

    render_html(template = '', data = {}) {
        return new Promise((resolve, reject) => {
            fetch(APPPATH + 'application/views/' + template).then(response => response.text()).then((html) => {
                for (let [key, value] of Object.entries(data)) {
                    let search = '{{' + key + '}}';
                    html = html.replace(search, value);
                }
                resolve(html);
            }).catch((err) => {
            });
        });
    }
}

export default Cli1;