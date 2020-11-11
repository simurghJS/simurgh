import Auth from "./auth.js";

export default class Request {
    constructor(url = '') {
        this.api_url = url;
    }

    get() {
        return this.call();
    }

    delete() {
        return new Promise((resolve, reject) => {
            this.guard('آیا میخواهید اطلاعات مورد نظر را حذف نمایید؟', () => {
                this.call({method: 'DELETE'}).then((response) => {
                    resolve(response);
                })
            })
        });
    }

    post(data = {}) {
        return this.call({
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

    call(args = {}) {

        let url = this.api_url;

        /** request args **/
        let req_args = new Object();
        req_args.mode = 'cors';
        /** attach data if exists **/
        if (!empty(args.data)) {
            req_args.method = 'POST'
            req_args.encrypt = "multipart/form-data";

            let formData = new FormData();
            for (const [key, value] of Object.entries(args.data)) {
                formData.append(key, value);
            }
            req_args.body = formData;
        } else {
            req_args.method = !empty(args.method) ? args.method : 'GET';
        }

        /** others param **/

        let auth = new Auth().get_authorization();
        let req_url = BASEURL + url;

        req_args.headers = new Headers({
            'Authorization': (!empty(auth) ? btoa(auth) : '')
        });

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
                    alert(obj.error, 'danger');
                }).catch((e) => {
                    alert(e.message, 'danger');
                })
            } catch (e) {
                alert(error.message, 'danger');
            }
            return Promise.reject();
        });
    }
}