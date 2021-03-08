interface _navigationArgs {
    id: string,
    url: string,
    command: string
    route_data: {
        layout: string
    },
    component_ready: Array<Function>
}
interface route_data {
    id: string,
    url: string,
    command: string,
    namespace: string
}
interface _component {
    title?: string
    tagName: string
    props?: {
        style?: Object,
        className?: string
    }
    state?: {}
    on_rendered?: Function
    layout?: string
}

 interface simurgh{
    config: {
        constants: Map<string, string>,
        global: {
            dependencies?: Array<string>,
            jquery?: Boolean,
            bootstrap?: Boolean,
            rtl?: Boolean,
            layout?: string
        },
        navigation?: {
            default_route?: String,
            drawer_navigation?: Object,
            routes?:any,
        },
        readonly domain: String
    },
    routes?: Array<any>,
    system?: {
        paths: {
            controller: string,
            middleware: string
        }
    },
    routes_middleware?: any,
    current_stack_uuid?: string
}
