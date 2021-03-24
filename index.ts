export function CreateApplicationInstance() {
    const { Application } = require('./app/application');

    return new Application();
}
export function createElement(type: any, props, ...children) {
    const { createElement } = require('./app/render');
    return createElement(type, props, ...children);
}

export {Component} from './app/component'