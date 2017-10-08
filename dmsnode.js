http = require('http');
http.createServer(function(req, res) {

    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function(data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function() {
            console.log("Body: " + body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    } else {
        console.log("GET");
        var html = '<html><body><form method="post" action="http://localhost:8000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }

}).listen(8000);

host = '71.202.180.48';
port = 8000;
console.log('Listening at http://' + host + ':' + port);
