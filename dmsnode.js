var alarm = require('./Alarm');

var http = require('http');
var url = require('url');

var port = 8000;

server = http.createServer(function(req, res) {

    //console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            j = JSON.parse(body);
            for (p in j) {
                console.log(p + ": " + j[p]);
            }
        });
        req.on('error', function(err) {
            console.log(err);
        });
    //    res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received\n');
    //} else {
    //    console.log("GET");
    //    var html = '<html><body><form method="post" action="http://localhost:8000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    //    res.writeHead(200, {'Content-Type': 'text/html'});
    //    res.end(html);
    }

});

server.listen(port, function() {
    var host = server.address().address;
    console.log('Listening at http://' + host + ':' + port);
    alarm.begin(host, port);
});
