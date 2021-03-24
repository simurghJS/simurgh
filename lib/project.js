/**
 * @description create new simurgh appliaction
 * @param {String} name 
 */
exports.create = function (name) {
  const files = ['index.js', 'package.json', 'README.md', 'tsconfig.json', '.gitignore', '.babelrc.json']
  const { exec } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const res = require.resolve('../assets/template/controller.js');


  /**if name exists */
  if (fs.existsSync(name)) {
    console.log('ops!');
    console.log('name "' + name + '" exists, choose another name');
    return false;
  }
  fs.mkdirSync(name);
  const dest = path.resolve(name);
  new Promise((resolve, reject) => {
    files.forEach((f) => {
      console.log('generating file => ' + f);
      let fPath = require.resolve('../assets/blank/' + f);
      let content = fs.readFileSync(fPath, { encoding: 'utf8' });
      fs.writeFileSync(name + '/' + f, content.split('page_name').join(' ' + name + ' '));
    });
    resolve();
  }).then(() => {
    console.log('installing depandancies, it can take a few minutes');
    process.chdir(name);
    exec('npm install', (e, s1, s2) => {
      console.log('project created , execute "simurgh run-web" in project directory to build your project');
    });
  });
};

/**
 * @description build application for browsers 
 */
exports.buildWeb = function () {
  const fs = require('fs');
  const { exec } = require('child_process');
  const commands = [
    'npx babel ./*.* --out-dir dist/web --copy-files',
    'npx babel ./app --out-dir dist/web/app --copy-files',
    'npx babel ./config --out-dir dist/web/config --copy-files',
    'npx babel ./resources --out-dir dist/web/resources --copy-files'
  ]
  exec(commands.join(' && '), () => {
    process.chdir('dist/web');
    exec('npm install', (e, s1, s2) => {
      if (e) {
        console.log(e.message);
        return;
      }
      console.log(s1); console.log(s2);
      console.log('your application was built in dist directory');
    });
  });
}
/**
 * @description build application for browsers 
 */
exports.start = function () {
  const { exec, spawn } = require('child_process');
  let ls = spawn('node', ['index.js']);

  ls.stdout.on('data', (data) => {
    console.log(data.toString());
    if (data.toString().indexOf('server started succesfully') >= 0) {
      exec('start chrome http://localhost:3000')
    }
  });

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });
  /* const { execSync } = require('child_process');
   console.log('start...');
   execSync('node index.js', (e, s1, s2) => {
     if (e) {
       console.log('unable to run node server');
       console.log(e.message);
     } else {
       console.log('server started...');
       console.log(s1);
       console.log(s2);
       exec('start chrome localhost:3000', (e, s1, s2) => {
         if (e) {
           console.log(e.message);
         }
         console.log('running application');
       });
     }
   });*/
}

/**
 * @description create new simurgh appliaction
 * @param {String} name 
 */
exports.makePage = function (name) {
  const fs = require('fs');
  let filename = require.resolve('../assets/template/controller.js');
  console.log(filename);
  fs.readFile(filename, 'utf8', (err, data) => {
    console.log(data);
    if (err) {
      console.log('error equired ' + JSON.stringify(err));
    }
    if (!fs.existsSync('app/http/')) {
      fs.mkdirSync('app');
      fs.mkdirSync('app/http');
    }
    if (!fs.existsSync('app/http/' + name + ".js")) {
      fs.writeFile('app/http/' + name + '.js', data.split('page_name').join(' ' + name + ' '), (err) => {
        if (err) {
          console.log('error equired ' + JSON.stringify(err));
        } else {
          console.log('your page created successfully');
        }
      });
    } else {
      console.log('controller exsist, choose another name');
    }
  });

};
/**
 * @description build application for browsers 
 */
function download(url, dest, cb) {
  const https = require('https')
  const fs = require('fs');
  const file = fs.createWriteStream(dest);
  const request = https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

