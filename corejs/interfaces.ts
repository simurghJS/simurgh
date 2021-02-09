import "../dom/tools"
export interface _simurgh {
    dependencies: Array<string>,
    drawer_navigation: Object,
    routes: Array<string>,
    constants: Array<string>,
    jquery: Boolean,
    bootstrap: Boolean,
    rtl: Boolean,
    layout: string
}

declare global {
    interface Window {
        App:__CONFIG
    }
}