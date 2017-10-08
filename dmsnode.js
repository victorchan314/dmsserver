var http = require('http');
var url = require('url');
http.createServer(function(req, res) {

    //console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var j = JSON.parse(body);
            for (p in j) {
                console.log(p + ": " + j[p]);
            }
        });
    //    res.writeHead(200, {'Content-Type': 'text/html'});
    //    res.end('post received');
    //} else {
    //    console.log("GET");
    //    var html = '<html><body><form method="post" action="http://localhost:8000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    //    res.writeHead(200, {'Content-Type': 'text/html'});
    //    res.end(html);
    }

}).listen(8000, '0.0.0.0', function() {
    var host = '192.168.0.14'
    var port = 8000;
    console.log('Listening at http://' + host + ':' + port);
});
