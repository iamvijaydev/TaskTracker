
/* Task Tracker: A Google Chrome plugin to track your task, with timer
* By Vijay Dev http://vijaydev.com/
* MIT Licensed.
*/


	/* Create a new task
	* @constructor
	* @param {String} title - title of the task.
	* @param {String} status - current status of the task.
	* @param {Number} sleepTime - when plugin is closed, record the time for the active task.
	*/
	var Task = function (id, title, status, sleepTime) {
		this.id        = id;
		this.title     = title;
		this.status    = 'create';	// create, active, pause, complete
		this.startTime = 0;
		this.duration  = 0;
	};

	/* Model for the task data
	* @constructor
	*/
	var Model = function () {
		// a constant localStorage key name.
		var STORAGE = 'TASK_TRACKER';

		/* Get the data from localStorage
	    * @private
	    * @return {Array} associative array
	    */
		var getLocalStorage = function() {
			return JSON.parse( localStorage.getItem(STORAGE) );
		};

		/* Set the data to localStorage
	    * @private
	    * @param {Array} taskArray - to stringify & saved
	    */
		var setLocalStorage = function(taskArray) {
			localStorage.setItem( STORAGE, JSON.stringify(taskArray) );
		};

		/* Returns Date.now()
	    * @private
	    * @return {Number} time in seconds
	    */
		var now = function() {
			return Date.now ? Date.now() : +(new Date);
		};

		/* Returns the (i)th position having the requested id
	    * @private
	    * @return {Number} (i)th position
	    */
		var getTaskPos = function(id) {
			var taskArray = getLocalStorage();
			var i = 0;

			for(i in taskArray) {
			    if(taskArray[i].id === id){
			    	break;
			    }
			}

			return i;
		};

		/* Add a new task
	    * @param {String} title - title of the new task
	    * @dispatch {tEvent} taskAdded - data { id, title, status }
	    */
		var add = function(title) {
			var id = 'task' + now();
			var task = new Task(id, title);
			var taskArray = getLocalStorage();

			taskArray[taskArray.length] = task;
			setLocalStorage( taskArray );

			var tEvent = document.createEvent('Event');
			tEvent.initEvent('tasksAdded', true, true);
			tEvent.data = {
				'id': id,
				'title': title,
				'status': task.status,
				'startTime': task.startTime
			}
			window.dispatchEvent(tEvent);

			log('M: ' + id + ' added');
		};

		/* Discard a task
	    * @param {String} id - ID of the task
	    * @dispatch {tEvent} taskDiscarded - data { id }
	    */
		var discard = function(id) {
			var taskArray = getLocalStorage();
			taskArray.remove( getTaskPos(id) );

			setLocalStorage( taskArray );

			var tEvent = document.createEvent('Event');
			tEvent.initEvent('taskDiscarded', true, true);
			tEvent.data = {
				'id': id
			}
			window.dispatchEvent(tEvent);

			log('M: ' + id + ' discarded');
		};

		/* Update a task
	    * @param {String} id - ID of the task
	    * @param {String} status - current status of the task.
	    * @dispatch {tEvent} taskUpdated - data { id, status, duration }
	    */
		var update = function(options) {
			var taskArray = getLocalStorage();
			var i = getTaskPos(options.id);

			taskArray[i].status = options.status;

			switch(options.status) {
				case 'active':
					taskArray[i].startTime = options.time;
					break;

				case 'pause':
					taskArray[i].duration += options.time - taskArray[i].startTime;
					log(taskArray[i].duration);
					break;

				case 'complete':
					taskArray[i].duration += options.time - taskArray[i].startTime;
					break;
			}

			var tEvent = document.createEvent('Event');
			tEvent.initEvent('taskUpdated', true, true);
			tEvent.data = {
				'id': options.id,
				'status': options.status,
				'startTime': options.time,
				'duration': taskArray[i].duration
			}
			window.dispatchEvent(tEvent);

			setLocalStorage( taskArray );
		};

		/* Created localStorage entry for the first time
		* @private
	    * @dispatch {tEvent} storageCreated
	    */
		var createStorage = function() {
			var taskJSON = [];

			setLocalStorage(taskJSON)

			var tEvent = document.createEvent('Event');
			tEvent.initEvent('storageCreated', true, true);
			window.dispatchEvent(tEvent);

			log('M: localStorage created');
		};

		/* Inform view that there are tasks in localStorage
		* @private
	    * @dispatch {tEvent} hasTasks - data { taskArray }
	    */
		var informHasTask = function() {
			var tEvent = document.createEvent('Event');
			tEvent.initEvent('hasTasks', true, true);
			tEvent.data = {
				'taskArray': getLocalStorage()
			}
			window.dispatchEvent(tEvent);

			log('M: has previous task');
		};

		// Fire when initialized
		this.init = function() {

			// Initialize localStorage
			if( localStorage.getItem(STORAGE) ) {
				informHasTask();
			} else {
				createStorage();
			}

			// When user adds a new task
		    window.addEventListener('newTask', function(e) {
				add( e.data.title );
			}, false);

		    // When user discards an existing task
			window.addEventListener('discardTask', function(e) {
				discard( e.data.id );
			}, false);

			// When task status/time needs to be updated
			window.addEventListener('updateTask', function(e) {
				update({
					'id': e.data.id, 
					'status': e.data.status, 
					'time': e.data.time
				});
			}, false);
		};

		this.init();
	};
