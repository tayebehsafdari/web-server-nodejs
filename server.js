const http = require('http');
const fs = require('fs');
const path = require('path');
const process = require('process');
const mime = require('mime');
const url = require('url');


const server = http.createServer((req, res) => {
    // let file = process.cwd() + req.url;
    let file = path.join(process.cwd(), `test\\${url.parse(req.url).pathname}`);
    console.log("file: ", file);
    let stat;
    try {
        stat = fs.lstatSync(file);
    } catch (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('not found');
        return res.end();
    }
    if (stat.isFile()) {
        fs.readFile(file, (err, data) => {
            res.writeHead(200, {'Content-Type': mime.getType(file)});
            res.write(data);
            res.end();
        });
        return;
    } else if (stat.isDirectory()) {
        let requrl = req.url;
        if (requrl.length > 1 && requrl.substr(-1) !== "/") {
            requrl += "/";
        }
        res.writeHead(302, {'location': requrl + 'index.html'});
        res.end();
    } else {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.write("Internal error");
        res.end();
    }
});

server.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000");
});