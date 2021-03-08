# Simurgh

simurgh is a js framework for server side web page rendering based on typescript & nodejs

## Installation
its recomended to install simurgh globaly

```sh
npm i -g simurgh
```

## quick start

after installing simurgh you can use cli commands to create , build and start your project.use blow cli code to create new "test" project 

```sh
simurgh new test
```
create home page
```sh
simurgh make:page index
```
open `app/http/index.js` and override render function
```sh
   async render() {

        return <h1>index</h1>

    }
```
create test page
```sh
simurgh make:page test
```
you can create navigation for each server request.paste this code in index.js file in project root folder.

```sh
import * as simurgh from 'simurgh/app/application';
import { CreateStackNavigation } from 'simurgh/app/navigation';
let myApp = new simurgh.Application();

/** configure your application */
let stack = new CreateStackNavigation();
stack.add('/', 'index');
stack.add('/test', 'test');

myApp.navigation = stack;



myApp.build();
```
now you can build your app using blow command
```sh
simurgh build:web
```

#### running application

open terminal in `dist/web` folder and type

```sh
simurgh start
```