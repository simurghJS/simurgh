interface __CONFIG {
    constants: Map<string, string>,
    global?: {
        dependencies?: Array<string>,
        jquery?: Boolean,
        bootstrap?: Boolean,
        rtl?: Boolean,
        layout?: string
    },
     navigation: {
        default_route?: String,
        drawer_navigation?: Object,
        routes: Array<string>,
    },
    readonly domain: String
}

declare function empty(obj: Object): Boolean;
declare function env(path: string): string;
declare function token(): string;
declare function resources(path: string): string;
declare function core_assets(path: string): string;
