#!/usr/bin/env node
const { exec } = require('child_process');

// get arguments after first two elements in process.argv
let arguments = process.argv.splice(2);
switch (arguments[0]) {
  case "new":
    const prj=require('lib/cli/project.js');
    prj.create(arguments[1]);
    break;
  default:
  console.log("command not found!");
    break;
}
