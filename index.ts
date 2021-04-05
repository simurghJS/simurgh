export function CreateApplicationInstance() {
    const { Application } = require('./core/application');

    return new Application();
}
export function createElement(type: any, props, ...children) {
    const { createElement } = require('./core/render');
    return createElement(type, props, ...children);
}

export {Component} from './core/component'