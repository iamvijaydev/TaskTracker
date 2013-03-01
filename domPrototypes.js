// dom prototypes

// remove an entry from element
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var preFix = function(val) {
	return ('' + val).length == 2 ? '' + val : '0' + val;
}

// Convert seconds into HH:MM:SS format
Number.prototype.toHHMMSS = function () {

    var ms = this;
    var decs = Math.floor(ms % 1000 / 100);
    var secs = Math.floor(ms % 60000 / 1000);
    var mins = Math.floor(ms % 3600000 / 60000);
    var hours = Math.floor(ms % (24 * 3600000) / 3600000);

    var time = '';

    if(hours > 0) {
    	time += preFix(hours) + ':';
    }
    if(mins > 0) {
    	time += preFix(mins) + ':';
    }

    time += preFix(secs) + ':' + preFix(decs);

	return time;
}
