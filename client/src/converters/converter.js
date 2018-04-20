var fs = require('fs');
var logStream = fs.createWriteStream('../assets/catalog1.json');
var _ = require('lodash');

var content = fs.readFileSync('../assets/NGC.json');
var objects = JSON.parse(content);

var o = {};
_.each(objects, function(object, index){
	var field = index;
  if (object.common_name) {
  	field += '|'+object.common_name+' ('+index+')';
  }
	o[field] = index;
});
logStream.write(JSON.stringify(o, null, 2));