export class Submiter {
    constructor() {
    }
}

export default class Form_adaptor {

    url = '';
    model = {};
    submitter = ''

    constructor(args, on_submit = () => {
    }) {
        if (typeof args == "object") {
            args && Object.assign(this, args);
        }
        this.init(on_submit);
    }

    init(callback) {
        for (let [key, value] of Object.entries(this.model)) {
            console.log(key);
            console.log(value);
            if (!gilace.helper.empty(value)) {
                if (typeof value == "string") {
                    $('#' + key).val(value);
                }
                else {
                    if (!gilace.helper.empty(value.attr)) {
                        for (let [_key, _value] of Object.entries(value.attr)) {
                            $('#' + key).attr(_key, _value);
                        }
                    }
                    else if (!gilace.helper.empty(value.data)) {
                        for (let [_key, _value] of Object.entries(value.data)) {
                            console.log(_value);
                            $('#' + key).data(_key, _value);
                        }
                    }
                    else{
                        switch (value.type) {
                            case 'text':
                                $('#' + key).val(value.text);
                                break;
                            case 'location-selector':
                                $('#' + key).data('lat',value.lat);
                                $('#'+key).data('lng',value.lng);
                                $('#lat').val(value.lat);
                                $('#lng').val(value.lng);

                                gilace.Loader.load([
                                    gilace.helper.assets('js/mapbox-gl.js'),
                                    gilace.helper.assets('css/mapbox-gl.css')
                                ])
                                    .then(() => {
                                        let apikey = 'pk.eyJ1Ijoic2lhYmw4OSIsImEiOiJjazZlb3J4NnExc2VpM2xuOGIyZ2g2aTI0In0.lV2OfgjuKpVD9fcWZkkOaQ';
                                        let map = new gilace.modules.mapbox(apikey);
                                        map.set_rtl();
                                        let args = [];
                                        if (!gilace.helper.empty($('#'+key+'').data('lat')) && !gilace.helper.empty($('#'+key+'').data('lat'))) {
                                            args = [$('#'+key+'').data('lng'), $('#'+key+'').data('lat')];
                                        } else {
                                            args = map.current_location;
                                        }
                                        map.set_map(key, args);
                                        let business_locator = $($.parseHTML(`<div class='me' ></div>`))[0];
                                        let marker = map.add_item(business_locator, args[1], args[0]);
                                        map.get_location(marker, function (response) {
                                            $('#lat').val(response.lat);
                                            $('#lng').val(response.lng);
                                        });
                                    })
                                    .catch((err) => {
                                        gilace.helper.alert(err.message)
                                    })
                                    .then(() => {
                                    });
                                break;
                            case 'file-selector':
                                $(value.previewEl).attr('src',value.src);
                                break;
                        }
                    }
                }
            }
        }
        $(this.submitter).click((ev) => {
            console.log(this.retrieve_data());
            gilace.server.Post(this.url, this.retrieve_data(), (response) => {
                gilace.helper.alert(response.message,response.status);
                callback();
            });
        });
    }

    retrieve_data() {
        let data = [];
        for (let [key, value] of Object.entries(this.model)) {
            switch (value.type) {
                case 'text':
                    data[key] = $('#' + key).val();
                    break;
                case 'location-selector':

                    data['lat'] = $('#lat').val();
                    data['lng'] = $('#lng').val();
                case 'file-selector':
                    let f=document.getElementById(key);
                    if(!gilace.helper.empty(f.files)) {
                        data[key] = f.files[0];
                    }
                    break;
            }
        }
        return data;
    }
}
