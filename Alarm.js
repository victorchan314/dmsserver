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
    this.alarm_type = alarm_type;
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
        this.active = true;
      }
    }
  }

  function deactivate() {
    this.active = false;
  }

}
