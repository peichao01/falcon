/**
 * Created by peic on 14-3-21.
 */

define(['EventEmitter-js'], function(EventEmitter){

	var o = {};
	EventEmitter.mixTo(o);

	o.on('event-a', function(arg1){
		console.log(arg1);
	});

	o.emit('event-a', 'arg-1');


	function A (){}
	EventEmitter.mixTo(A);
	var a = new A();

	a.on('change', function(value, oldValue){
		console.log(value, oldValue);
	});
	a.emit('change', 10, 4);
});