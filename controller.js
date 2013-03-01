
function log(m) {
	console.log(m);
}

var acceptTask,
	taskList,
	view;


/* Returns Date.now()
* @private
* @return {Number} time in seconds
*/
var now = function() {
	return Date.now();
};


var exec = function() {
	acceptTask.addEventListener('keyup', function(e) {
		if(e.keyCode === 13 && this.value != '') {			

			var tEvent = document.createEvent('Event');
			tEvent.initEvent('newTask', true, true);
			tEvent.data = {
				'title': this.value
			}
			window.dispatchEvent(tEvent);

			this.value = '';

			log('C: user entered a new task');
		} else {
			return;
		}
	}, false);


	taskList.addEventListener('click', function(e) {
		var target = e.target;
		var taskID = target.parentNode.parentNode.id;

		switch(target.className){
			case 'start':
				// check if there is a current timer running
				if(view.timer) {
					//get the task by accessing view
					var parent = view.hhmmss.parentNode;
					
					// let model know that he needs to save the new duration
					var tEvent = document.createEvent('Event');
					tEvent.initEvent('updateTask', true, true);
					tEvent.data = {
						'id': parent.id,
						'status': 'pause',
						'time': now()
					}
					window.dispatchEvent(tEvent);
				}

				var tEvent = document.createEvent('Event');
				tEvent.initEvent('updateTask', true, true);
				tEvent.data = {
					'id': taskID,
					'status': 'active',
					'time': now()
				}
				window.dispatchEvent(tEvent);
				break;

			case 'discard':
				var tEvent = document.createEvent('Event');
				tEvent.initEvent('discardTask', true, true);
				tEvent.data = {
					'id': taskID
				}
				window.dispatchEvent(tEvent);
				break;

			case 'complete':
				var tEvent = document.createEvent('Event');
				tEvent.initEvent('updateTask', true, true);
				tEvent.data = {
					'id': taskID,
					'status': 'complete',
					'time': now()
				}
				window.dispatchEvent(tEvent);
				break;

			case 'pause':
				var tEvent = document.createEvent('Event');
				tEvent.initEvent('updateTask', true, true);
				tEvent.data = {
					'id': taskID,
					'status': 'pause',
					'time': now()
				}
				window.dispatchEvent(tEvent);
				break;
		}
	}, false);
};


document.addEventListener('DOMContentLoaded', function () {
	acceptTask = document.getElementById('accept_task');
	taskList   = document.getElementById('task_list');
	view       = new View(taskList);

	exec();


}, false);
