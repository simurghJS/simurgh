const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const application=require('./corejs/application.ts');
  let _app=new application();
  _app.build();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(simurgh);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});