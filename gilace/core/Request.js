export default class Request {
    constructor(url = '') {
        this.api_url = url;
    }

    async get() {
        return await this.send();
    }

    async delete() {
        return await this.send({method: 'DELETE'});
    }

    async put(data = {}) {
        data._method = 'PUT';
        return await this.send({
            data: data,
            method: 'POST'
        });
    }

    async patch(data = {}) {
        return await this.send({
            data: data,
            method: 'PATCH'
        });
    }

    async post(data = {}) {
        return await this.send({
            data: data
        });
    }

    guard(title = '', onAccess_handler = () => {
    }) {
        alert(title, 'warning', {
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

    send(args = {}) {

        let url = this.api_url;
        let _method = 'GET';
        let req_args = new Object();

        if (!empty(args.data)) {

            _method = 'POST';
            let formData = new FormData();
            for (const [key, value] of Object.entries(args.data)) {
                formData.append(key, value);
            }
            req_args.body = formData;
        }

        req_args.method = !empty(args.method) ? args.method : _method;

        switch (req_args.method) {
            case "POST":
                req_args.encrypt = "multipart/form-data";
                break;
            case "PUT":
                req_args.encrypt = 'application/x-www-form-urlencoded'
                break;
            default:
                break;
        }

        // req_args.mode = 'cors';

        // let auth = new Auth().get_authorization();
        let req_url = url;

        /*  req_args.headers = new Headers({
              'Authorization': (!empty(auth) ? btoa(auth) : '')
          });*/

        console.log(req_args);

        /** make request **/
        return fetch(req_url, req_args).then((response) => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw response;
            }
        }).catch((error) => {
            console.log(error);
            return Promise.reject();
        });
    }
}