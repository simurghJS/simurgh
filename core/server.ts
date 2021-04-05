#!/usr/bin/env node

/// <reference path="../global.d.ts" />
import http from 'http'
import { empty, parseError } from './dom'
import { Request } from './request'
import { Response } from './response'

export class Server {
    run(app: any): void {

        let conf = {
            server: "127.0.0.1",
            port: 3000
        };

        let server = http.createServer(async (req: any, res) => {
            try {

                let request = new Request(app, req);

                if (request.isRenderable()) {

                    let html = await request.render({});
                    if (!empty(html)) {
                        new Response(res).write(html);
                    }
                    res.end();

                }
                else {

                    var fs = require('fs');
                    var path = require('path');
                    var filePath = req.url;

                    if (filePath == './') {

                        filePath = './index.html';

                    }

                    var extname = path.extname(filePath);
                    var contentType = 'text/html';

                    switch (extname) {
                        case '.js':
                            contentType = 'text/javascript';
                            break;
                        case '.css':
                            contentType = 'text/css';
                            break;
                        case '.json':
                            contentType = 'application/' + extname.replace('.', '');
                            break;
                        case '.png':
                        case '.jpg':
                            contentType = 'image/' + extname.replace('.', '');
                            break;
                        case '.mp4':
                            contentType = 'video/' + extname.replace('.', '');
                            break;
                    }

                    fs.stat('.' + filePath, function (err, stats) {
                        try {
                            if (err) {
                                throw err;
                            }
                            var stream = fs.createReadStream('.' + filePath)
                                .on("open", function () {
                                    res.writeHead(206, {
                                        "Accept-Ranges": "bytes",
                                        "Content-Range": "bytes 0-" + (parseInt(stats.size) - 1) + "/" + stats.size,
                                        "Content-Length": stats.size,
                                        "Content-Type": contentType
                                    });
                                    stream.pipe(res);
                                }).on("error", function (err) {
                                    res.end(err);
                                });
                        } catch (err) {
                            /** should return 404 error */
                            res.write(parseError(err));
                            console.log(err);
                        }
                    });
                }

            }
            catch (err) {
                res.write(parseError(err));
                console.log(err);
            }
        });

        server.listen(conf.port, conf.server, () => {
            console.log(`server started succesfully`);
            console.log(`open http://${conf.server}:${conf.port}/ in your browser`);
        });
        
    }

}