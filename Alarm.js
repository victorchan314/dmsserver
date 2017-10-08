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
    this.active = true;
    this.secondary = true;
  }

  function visit() {
    if (this.active) {
      this.active = false;
      //
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
