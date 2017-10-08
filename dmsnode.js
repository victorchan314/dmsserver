var alarm = require('./Alarm');

var http = require('http');
var url = require('url');

var port = 8000;
var port2 = 8001;

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
            alarm.handle(j, function(err) {
                console.log(err);
            });
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

localServer = http.createServer(function(req, res) {

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            j = JSON.parse(body);
            //sendPushNotifications();
        });
        req.on('error', function(err) {
            console.log(err);
        });
        res.end('post received\n');
    }

});

server.listen(port, function() {
    var host = server.address().address;
    console.log('Listening at http://' + host + ':' + port);
    alarm.begin(host, port);
});

localServer.listen(port2, '127.0.0.1', function() {
    var host2 = server.address().address;
    console.log('Listening at http://' + host2 + ':' + port);
});
