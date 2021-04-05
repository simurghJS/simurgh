#!/usr/bin/env node

let arguments = process.argv.splice(2);
const prj = require('../lib/cli.js');
switch (arguments[0]) {
  case "start":
    prj.start();
    break;
  case "new":
    if (arguments[1] != undefined) {
      prj.create(arguments[1]);
    }
    else {
      console.log('wrong command! use it like => "simunrgh new myproject"');
    }
    break;
  case "build:web":
    prj.buildWeb();
    break;
  case "make:page":
    if (arguments[1] != undefined) {
      prj.makePage(arguments[1]);
    }
    else {
      console.log('please provide a valid page name. ( use command like this:  $ simurgh make:page page_name )');
    }
    break;
  case "--version":
    const fs = require('fs');
    fs.readFile(require.resolve('../package.json'), 'UTF-8', (err, content) => {
      if (err){
        console.log(err);
        return false;
      } 
      let detail = JSON.parse(content);
      console.log('SIMURGH v' + detail.version);
    });

    break;
  default:
    console.log("command not found!");
    break;
}
