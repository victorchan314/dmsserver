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
            var j = JSON.parse(body);
            alarm.handle(j, function(rv, err) {
                if (err) {
                    console.log(err);
                    res.end('Error handling data');
                } else {
                    res.end('Data received');
                }
            });
        });
        req.on('error', function(err) {
            console.log(err);
        });
    //    res.writeHead(200, {'Content-Type': 'text/html'});
    //    res.end('post received\n');
    //} else {
    //    console.log("GET");
    //    var html = '<html><body><form method="post" action="http://localhost:8000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    //    res.writeHead(200, {'Content-Type': 'text/html'});
    //    res.end(html);
    }

});

localServer = http.createServer(function(req, res) {

    //console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var j = JSON.parse(body);
            var d = {'to': 'ExponentPushToken[' + j.push_token + ']', 'title': 'Dead Man Switch Alarm', 'data': {'alarm_id': j.alarm_id}, 'body': 'Dismiss before your emergency contacts are notified'};
            http.request({
                hostname: 'https://exp.host/--/api/v2/push/send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(d);
                }
            }, function(response) {
                console.log('STATUS: ${response.statusCode}');
                console.log('HEADERS: ${JSON.stringify(response.headers)}');
                response.on('data', function(data) {
                    console.log('BODY: ${data}');
                });
                    response.on('end', function() {
                        console.log('Done sending data');
                    }
                }
            });
        });
        req.on('error', function(err) {
            console.log(err);
        });
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
