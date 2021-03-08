
import Component from "./component"
import { empty } from './dom'

export function createElement(type: any, props, ...children) {
    return {
        type: (typeof type == "string") ? (class htmlComponent extends Component {
            constructor() {
                super();
                this.tagName = type;
            }
        }) : type,
        props: {
            ...props,
            children: children.map((child) => {

                return typeof child === "object" ? child : {
                    type: class htmlComponent extends Component {
                        tagName: 'span'
                    },
                    props: {
                        nodeValue: child,
                        children: []
                    }
                }

            })
        }
    };
}
export async function render(obj, args) {
    let _do = true;
    let res = obj;
    do {
        res = await _do_render(res, args);
        if (typeof res == "string" || res instanceof HTMLElement) {
            _do = false;
            break;
        }
    } while (_do == true)
    return res;
}
export async function _do_render(obj, args) {
    let html = '';

    if (obj instanceof HTMLElement) {
        return obj;
    }
    if (typeof obj == "object") {
        if (typeof obj.type == "function") {
            let _obj = obj;
            if (!empty(obj.type.constructor) && !(obj.type.constructor.prototype instanceof Component)) {
                _obj = new obj.type().parse(args);
            }
            await _obj.component_did_mount(args);
            _obj.props = obj.props;
            html = await _obj.render(args);
        } else {
            return html;
        }
    }
    return html;
}