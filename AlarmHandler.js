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

		this.weekly_counter += 1;
		this.daily_counter += 1; 
		this.hourly_counter += 1; 	
	}

	this.defuse = function(hash) {
		var alarm = this.alarms[hash];
		alarm.deactivate(); 
	}

	this.delete = function(hash) {
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
