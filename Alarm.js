var a;
var host;
var port;

j = JSON.parse(body);
for (p in j) {
    console.log(p + ": " + j[p]);
}

module.exports = {
    begin: function(h, p) {
               host = h;
               port = p;
               var a = new AlarmHandler();
               setInterval(a.iterate, 1000);
           },

    add: function(push_token, alarm_ID, start_time, interval, message, contact, warning_time) {
             a.add(push_token, alarm_ID, start_time, interval, message, contact, warning_time);
         },
    
    defuse: function(hash) {
                a.defuse(hash);
            },

    del: function(hash) {
                a.del(hash);
            }
};

function AlarmHandler() {
	this.alarms = {}; 
	this.weekly = [];
	this.daily = []; 
	this.hourly = [];

	this.weekly_counter = 0;
	this.daily_counter = 0;
	this.hourly_counter = 0;

	this.add = function(push_token, alarm_ID, start_time, interval, message, contact, warning_time) {
		var alarm = new Alarm(push_token, alarm_ID, start_time, interval, message, contact);
		this.alarms[alarm_ID] = alarm; 
		var slot = this.getSlot(alarm); 
		if(alarm.period == 1) {
			this.insert(this.hourly, slot, alarm);
			this.insert(this.hourly, slot+alarm.warning_time, alarm); 

			if( ( (slot+alarm.warning_time - hourly_counter)+60)%60 < ((slot - hourly_counter)+60)%60) {
				alarm.secondary = true; 
			}

		} else if(alarm.period == 2) {
			this.insert(this.daily, slot, alarm);
			this.insert(this.daily, slot+alarm.warning_time, alarm); 

			if( ( (slot+alarm.warning_time - daily_counter)+60*24)%(60*24) < ((slot - daily_counter)+60*24)%(60*24)) {
				alarm.secondary = true; 
			}
		} else {
			this.insert(this.weekly, slot, alarm);
			this.insert(this.weekly, slot+alarm.warning_time, alarm); 

			if( ( (slot+alarm.warning_time - weekly_counter)+60*24*7)%(60*24*7) < ((slot - weekly_counter)+60*24*7)%(60*24*7)) {
				alarm.secondary = true; 
			}
		}
	}

	this.iterate = function() {
		for(alarm in this.hourly[this.hourly_counter]) {
			alarm.visit(); 
		}
		for(alarm in this.daily[this.daily_counter]) {
			alarm.visit(); 
		}
		for(alarm in this.weekly[this.weekly_counter]) {
			alarm.visit(); 
		}

		this.weekly_counter = (this.weekly_counter+1)%(60*24*7);
		this.daily_counter = (this.daily_counter+1)%(60*24); 
		this.hourly_counter = (this.hourly_counter+1)%60; 	
	}

	this.defuse = function(hash) {
		var alarm = this.alarms[hash];
		alarm.deactivate(); 
	}

	this.del = function(hash) {
		var alarm = this.alarms[hash];
		var slot = this.getSlot(alarm); 
		if(alarm.interval == 1) {
			delete this.hourly[slot][hash];
			delete this.hourly[ (slot+alarm.warning_time) % 60][hash]; 
		} else if(alarm.interval == 2) {
			delete this.daily[slot][hash];
			delete this.daily[ (slot+alarm.warning_time) % (60*24)][hash]; 
		} else {
			delete this.weekly[slot][hash];
			delete this.weekly[ (slot+alarm.warning_time) % (60*24*7)][hash]; 
		}
	}

	this.defined = function(arr, ind) {
		if(typeof arr[ind] === 'undefined') {
		    return false;
		}
		return true;
	}

	//inserts a reference to an alarm into an index. 
	this.insert = function(arr, ind, alarm) {
		if(!this.defined(arr, ind)) {
				arr[ind] = {};
			}
		arr[ind%arr.length][alarm.alarm_id] = alarm;
	}

	//Finds the slot in which the alarm will be inserted from its start time and period. 
	this.getSlot = function(alarm) {
		var d = new Date(alarm.start_time-3600*7);
		if(alarm.period == 1) {
			var slot = d.getMinutes();
		} else if(alarm.period == 2) {
			var slot = d.getMinutes()+60*d.getHours();
		} else {
			var slot = d.getMinutes()+60*d.getHours()+60*24*d.getDay();
		}
		return slot; 
	}
}

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

          req.post({url: 'https://' + host + ':' + port, 
            body: jm,
            headers: {"Content-Type" : "application/json"},
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
