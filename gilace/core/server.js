class Server {
    Router(path = '') {
        return BASEURL + path;
    }
    permission(title = '', onAccess_handler = () => {
    }) {
        gilace.helper.alert(title, 'warning', {
            showCancelButton: true,
            type: 'warning',
            confirmButtonClass: "btn-danger",
            cancelButtonText: 'خیر',
            confirmButtonText: 'بلی',
        }, () => {
            if (typeof onAccess_handler == "function") {
                onAccess_handler();
            }
        });
    }
    /** get methods **/
    Get(url = '', onLoad_eventHandler = null) {
        $('.gcore-loading').show();
        fetch(this.Router(url), {
            method: 'GET',
            enctype: "multipart/form-data",
            headers:new Headers({
                'Authorization':gilace.auth.get_authorization(),
            }),
        }).then((response) => response.json()).then(responseJson => {
            if (responseJson.status == "success") {
                if (typeof onLoad_eventHandler == 'function') {
                    onLoad_eventHandler(responseJson);
                } else {
                    gilace.helper.alert(responseJson.message);

                }
                if (responseJson.callback_url != undefined) {
                    gilace.CLI.execute({
                        command: responseJson.callback_url
                    });
                }
            } else {
                gilace.helper.alert(responseJson.message, 'danger');
                $('.gcore-loading').hide();
            }

            $('.gcore-loading').hide();
        }).catch((error) => {
            gilace.helper.alert(error.message, 'danger');
            console.log('error=>'+error.message);
            $('.gcore-loading').hide();
        });
    }

    /** post data **/
    Post(url = '', data = {}, onLoad_eventHandler = null) {
        $('.gcore-loading').show();
        let formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
        fetch(this.Router(url), {
            method: 'POST',
            enctype: "multipart/form-data",
            mode: 'cors',
            headers:new Headers({
                'Authorization': gilace.auth.get_authorization(),
            }),
            body: formData
        }).then((response) => response.json()).then(responseJson => {
            if (responseJson.status == "success") {
                if (typeof onLoad_eventHandler == 'function') {
                    onLoad_eventHandler(responseJson);
                } else {
                    gilace.helper.alert(responseJson.message);
                }
                if (responseJson.callback_url != undefined) {
                    gilace.CLI.execute({
                        command: responseJson.callback_url
                    });
                }
                $('.gcore-loading').hide();
            } else {
                gilace.helper.alert(responseJson.message, 'danger');
                $('.gcore-loading').hide();
            }
        }).catch((error) => {
            gilace.helper.alert(error.message, 'danger');
            console.log(error)
            $('.gcore-loading').hide();
        });

    }

}

export default Server;