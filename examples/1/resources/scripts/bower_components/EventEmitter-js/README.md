EventEmitter subscribe/publish events
===

###API Reference => [http://nodejs.org/api/events.html]

####Some difference with the NodeJS `require('events').EventEmitter` module:   
- One more Class method：`EventEmitter.mixTo()`  give the event power to a Constructor or an Object instance.  
- Two more events：`removeAllListeners`, `maxListeners`  
- The default count of `maxListeners` is NO-LIMIT instead of 10.

#####ONLINE examples => http://www.peichao01.com/static_content/module/EventEmitter/

Usage
---

(1). require EventEmitter：
```javascript
var EventEmitter = require('EventEmitter');//replace with the real id or path
```
			
(2). Three ways to generate a EventEmitter：
```javascript
//(1) 
var e = new EventEmitter();
//(2) 
var o = {…}; 
EventEmitter.mixTo(o);
//(3) 
function Klass(){…}; 
EventEmitter.mixTo(Klass); 
var k = new Klass();
```
			
(3). usage. the `GV` is global variable, you can replace it with the `e` or `o` or `k` generated in step2.
```javascript
//(1) subscribe/listen a event
GV.on('event-name', handler);
GV.addListener('event-name', handler);//this will emit/publis a "newListener" event
//GV.on('newListener', function(eventName, handler){…});

// subscribe a once event will publish the "newListener" event too.
// the handler will be removed after excute one time, and then publish a "removeListener" event
//GV.once('event-name', function(eventName, handler){…}); 

//(2) remove handler
GV.removeListener('a', handler);
// publish a "removeListener" event：
// GV.on('removeListener', function(eventName, handler){…});

//(3) remove all handlers that listening event "A"
GV.removeAllListeners('A');
// remove all handlers that listening any event.
GV.removeAllListeners();
// this will publish a "removeAllListeners"：
GV.on('removeAllListeners', function(eventName_or_undefined){…});

//(4) publis a event
GV.emit('event-name', eventArgs);

//(5) set the max count of listeners that one event can be listened.
GV.setMaxListeners(5);
// The "maxListeners" will be published when the handler more than 5.
//GV.on('maxListeners', handler);

//(6) list all the handlers on this event
GV.listeners('event-name')//return [function(){}, function(){}…]
```
	
【Example One】 - publish events between the modules: 
```javascript
	//module 1
$('#button').on('click', function(){
	// the arguments can be any count & any type
	GV.emit('mod1-button-click', 'arg1', 'arg2');
	// GV is a global variable, can publish events throw all modules
	// you can listen the GV event or the module event in the module
	e.emit('mod1-button-click', {dom:$(this)});
});

GV.on('mod1-button-click', function(arg1, arg2){
	console.log(arg1, arg2);
	//do something
	$('#sidebar').hide();
});

//module 2
GV.on('mod1-button-click', function(arg1, arg2){
	//do something
});
```
#####Typical usage scenario


多人协作，每人负责一个文件、一个模块，在模块间通信，就像【示例一】。

作为底层的基础设置，用在组件化模块内，见【示例二】。

【示例二】-- 组件系统的构建
```javascript
//组件Base，抽象的底层组件，script/module/Base.js：
define(function(require, exports, module){
	var EventEmitter = require('script/module/EventEmitter');
	//function Base(){…}
	//Base.prototype.xx = function(){…}
	// module.exports = Base;
	// 某个库
	module.exports = Klass({
		constructor: function(){…},
		instanceMethod: function(){}
	}, {
		staticMethod: function(){…}
	});
});

//组件日历，script/module/Calendar.js
define(function(require, exports, module){
	var Base = require('script/module/Base');
	//加载组件匹配的模板
	var tplCalendar = require('tpl/module/Calendar.tpl');

	Base.subClass({
		constructor: function(options){
			this.dom = tplCalendar(options);//…
			this.dayDom = this.dom.xxx
			this.dayDom.on('click', this.onDayClick.bind(this));
			//…
		},
		onDayClick: function(e){
			var day = xxx//获取点击的当前的日期
			this.emit('day', day);
		},
		…
	});
});

//某业务模块，detail_order.js
define(function(require, exports, module){
	//组件模块
	var Calendar = require('script/module/Calendar');
	//业务模块
	var Hotel = require('script/module/Hotel');

	$.ready(function(){
		var calendar = new Calendar({…});
		var hotel = new Hotel({dom:$domHotel, …});

		$domSomeWhere.append(calendar.dom);

		calendar.on('day', function(day){
			//日历的某一天被点击了
			//do sth,如：根据日期重新查询当天的酒店
			hotel.search({
				day: day,…
			});
		});

		//酒店查询返回
		hotel.on('search-success', function(data){
			$domHotel.html(handlebarsTplHotel(data));
		});
	});
});
```
缺点：

如果滥用会造成逻辑分离，甚至支离破碎，导致代码阅读非常困难。 
如果发现已经有这种情况了，请配合其他开发模式来调整，比如使用Promise来尽量的以同步的方式书写代码。

转载请注明来自[超2真人]
本文链接：http://www.peichao01.com/static_content/doc/html/introduce-EventEmitter.html
