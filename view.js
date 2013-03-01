var View = function(taskList) {

	// cache the taskList UL dom element
	// TODO: move to script, pass here by value
	var taskList   = document.getElementById('task_list');
	var self = this;

	self.timer = null;
	self.startTime = 0;
	self.duration = 0;
	self.hhmmss = null;


	// if the time entity is single digit, prefix 0
	var preFix = function(val) {
		return ('' + val).length === 2 ? '' + val : '0' + val;
	}


	// Convert ms into HH:MM:SS format
	var toHHMMSS = function(ms) {
	    var time = '';
	    var decs = Math.floor(ms % 1000 / 100);
	    var secs = Math.floor(ms % 60000 / 1000);
	    var mins = Math.floor(ms % 3600000 / 60000);
	    var hour = Math.floor(ms % (24 * 3600000) / 3600000);

	    if(hour > 0) {
	    	time += preFix(hour) + ':';
	    }
	    if(mins > 0) {
	    	time += preFix(mins) + ':';
	    }
	    time += preFix(secs) + '.' + decs;
		return time;
	}


	/* Get Date.now()
    * @return {Number} time in miliseconds
    */
	var now = function() {
		return Date.now ? Date.now() : +(new Date);
	};


	function runTimer() {
		var totalDuration = (now() - self.startTime) + self.duration;
		self.hhmmss.innerHTML = toHHMMSS(totalDuration);
	}
	function stopTimer() {
		if(self.timer) {
			clearInterval(self.timer);
			self.timer = null;
		}
	}
	// start the counter for active task
	var initTimer = function(options) {
		// if there is a timer currently running, stop that
		// also checked in the controler, & informs the model 
		if(self._timer) {
			stopTimer();
			var parent = self.hhmmss.parentNode;
			parent.setAttribute( 'data-status', 'pause' );
		}

		var task = document.getElementById(options.id);
		
		self.startTime = options.startTime;
		self.duration = options.duration;				
		self.hhmmss = task.lastChild;

		self.timer = setInterval(runTimer, 100);
	};


	// append a single task entry into the taskList
	var appendTask = function(options) {
		var task = document.createElement('li');
		task.id = options.id;
		task.setAttribute( 'data-status', options.status );
		task.setAttribute( 'data-start-time', options.startTime );

		var ctrls = document.createElement('div');
		ctrls.className = 'ctrls';

		var start = document.createElement('button');
		start.className = 'start';

		var pause = document.createElement('button');
		pause.className = 'pause';

		var complete = document.createElement('button');
		complete.className = 'complete';

		var discard = document.createElement('button');
		discard.className = 'discard';

		var title = document.createElement('h3');
		title.className = 'title';
		title.innerHTML = options.title;

		var duration = document.createElement('span');
		duration.className = 'duration';
		duration.innerHTML = options.duration ? toHHMMSS(options.duration) : '';

		// append controls into ctrl
		ctrls.appendChild(start);
		ctrls.appendChild(pause);
		ctrls.appendChild(complete);
		ctrls.appendChild(discard);

		// append ctrl, title, duration into task
		task.appendChild(ctrls);
		task.appendChild(title);
		task.appendChild(duration);

		// append task into taskList (DOM)
		taskList.appendChild(task);

		if(options.status === 'active') {
			initTimer({
				id:        options.id,
				startTime: options.startTime,
				duration:  options.duration
			});
		}
	};


	// build the whole task list by iterating the taskArray
	var buildTaskList = function(taskArray) {
		var i = 0;
		var j = taskArray.length;

		for(; i < j; i++) {
			appendTask({
				'id':        taskArray[i].id,
				'title':     taskArray[i].title,
				'status':    taskArray[i].status,
				'startTime': taskArray[i].startTime,
				'duration':  taskArray[i].duration
			});
		}
	};


	// remove a task from the task list
	var removeTask = function(id) {
		var task = document.getElementById(id);
		task.className = 'discarding';
		// when the discarding animation is completed
		task.parentNode.removeChild( task );
	};


	// update a task
	var updateTask = function(options) {
		var task = document.getElementById(options.id);
		
		task.setAttribute( 'data-status', options.status );
		task.setAttribute( 'data-start-time', options.startTime );

		if( options.status === 'active' ) {
			initTimer({
				id:        options.id,
				startTime: options.startTime,
				duration:  options.duration
			});
		} else {
			stopTimer();
		}
	};





	// Initilizing for the first time, localStorage key added
	// When there are task that were saved in localStorage
	window.addEventListener('hasTasks', function(e) {
		buildTaskList( e.data.taskArray );
	}, false);


	// When a new task, added by the user is saved in localStorage
	window.addEventListener('tasksAdded', function(e) {
		appendTask({
			'id':        e.data.id,
			'title':     e.data.title,
			'status':    e.data.status,
			'startTime': e.data.startTime,
			'duration':  e.data.duration
		});
	}, false);


	// When a task, added by the user is discarded from localStorage
	window.addEventListener('taskDiscarded', function(e) {
		removeTask(e.data.id);
	}, false);


	// When a task, added by the user is updated in localStorage
	window.addEventListener('taskUpdated', function(e) {
		updateTask({
			'id':        e.data.id,
			'status':    e.data.status,
			'startTime': e.data.startTime,
			'duration':  e.data.duration
		});
	}, false);
	


	// create the model instance
	var model = new Model();
};

