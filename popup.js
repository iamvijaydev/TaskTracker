

// task constructor
(function() {

  var pointer = 0,
      acceptTask = null,
      taskTray = null;

  var Task = function (id, name, hasEnd, start, approxEnd, progress, extraTime) {
    this.id = id || false;
    this.name = name || false;
    this.status = status || false;
    this.hasEnd = hasEnd || false;
    this.start = start || false;
    this.approxEnd = approxEnd || false;
    this.progress = progress || false;
    this.extraTime = extraTime || false;
  };


  var injectTask = function(begin) {
    var addedTask = JSON.parse( localStorage.getItem('task_tracker_storage') );
    var _array = addedTask.array;

    if(_array.length === 0) {
      return;
    }

    var i = begin || 0;
    var len = _array.length;

    for(; i < len; i++) {
      var entry = document.createElement('li');
      entry.setAttribute('data-id', _array[i].id);
      entry.innerHTML = _array[i].name;

      if(_array[i].status === 'started') {
        entry.className = 'active';
      }

      taskTray.appendChild(entry);
    }

    pointer = i;
  };


  var removeTask = function(taskId, target) {
    var addedTask = JSON.parse( localStorage.getItem('task_tracker_storage') );
    var id = taskId.split('-')[1];

    addedTask.array.remove(id);
    taskTray.removeChild(target);

    localStorage.setItem( 'task_tracker_storage', JSON.stringify(addedTask) );
  };

  var init = function() {
    acceptTask = document.getElementById('accept_task');
    taskTray = document.getElementById('task_tray');

    if(!localStorage.getItem('task_tracker_storage')) {
      var taskJSON = {
        "array": []
      };
      localStorage.setItem( 'task_tracker_storage', JSON.stringify(taskJSON) );
    } else {
      injectTask();
    };

    acceptTask.addEventListener('keyup', function(e) {
      if(e.keyCode === 13 && this.value != '') {

        var newTask = new Task(id = 'task-' + pointer, name = this.value);

        var addedTask = JSON.parse( localStorage.getItem('task_tracker_storage') );
        addedTask.array.push( newTask );

        localStorage.setItem( 'task_tracker_storage', JSON.stringify(addedTask) );

        this.value = '';

        var tEvent = document.createEvent('Event');
        tEvent.initEvent('newTaskAdded', true, true);
        window.dispatchEvent(tEvent);
      } else {
        return;
      }
    }, false);


    taskTray.addEventListener('click', function(e) {
      var target = e.target;
      var taskId = target.getAttribute('data-id');

      removeTask(taskId, target);
    }, false);
  };


  document.addEventListener('DOMContentLoaded', function () {
    init();
  }, false);


  window.addEventListener('newTaskAdded', function() {
    injectTask(pointer);
  }, false);

})();