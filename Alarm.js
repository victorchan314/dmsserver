class Alarm {
  const HOURLY = 1;
  const DAILY = 2;
  const WEEKLY = 3;
  constructor(push_token, alarm_id, start_time, interval, message, contact, warning_time) {
    this.push_token = push_token;
    this.alarm_id = alarm_id;
    this.start_time = start_time
    this.interval = interval;
    this.message = message;
    this.contact = contact;
    this.active = false;
    this.secondary = false;
  }

  function visit() {
    if (this.active) {
      this.active = false;

      const SparkPost = require('sparkpost');
      const sparky = new SparkPost('4a843e27ca62861e8346c5b52400e892351e82dd');

      sparky.transmissions.send({
          options: {
            sandbox: true
          },
          content: {
            from: 'testing@sparkpostbox.com',
            subject: '___ has missed an alarm!',
            html:'<html><body><p>' + this.message + '</p></body></html>'
          },
          recipients: [
            {address: this.contact}
          ]
        })
        .then(data => {
          console.log('transmission successful');
          console.log(data);
        })
        .catch(err => {
          console.log('Whoops! Something went wrong');
          console.log(err);
        });

    } else {
      if (this.secondary) {
        this.secondary = false;
      } else {
        this.secondary = true;
        var time = (new Date()).getTime(); 
        if(time >= start_time) {
          this.active = true;
          //Send POST request
          var string = "ExponentPushToken[" + this.push_token + "]"; 
          var message = {to: string, alarm_id: this.alarm_id};
          var jm = JSON.stringify(message);
          var req = require('request');

          req.post({url: 'https://exp.host/--/api/v2/push/send', 
            body: jm,
            headers: {"Content-Type: application/json"},
            method: 'POST'
        },
        function (e, r, body) {
          console.log(body);
        });

      }
    }
  }

  function deactivate() {
    this.active = false;
  }

}
