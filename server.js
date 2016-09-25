var express = require('express');
var app = express();
var http = require('http').Server(app);
var request = require('request');
var jar = request.jar();
var fs = require('fs');
var path = require('path');
var io = require('socket.io')(http, {path: '/public/socket.io'});
var PythonShell = require('python-shell');
var secrets = require('./config/secrets.js');

var state = {
  flash: false,
  light: false,
  led: [0, 0, 0],
  currentLed: [0, 0, 0],
  refreshTimeout: 1500
}

function req(){
  request({
    uri: 'http://nodepi.fabianhoffmann.io/API/data?auth-key=' + secrets.token,
    method: 'GET',
    jar: jar
  }, function(error, response, body) {
      handleResponse(body);
  });

  setTimeout(function(){req()}, state.refreshTimeout);
};

function runScripts() {
  led();
  //setTimeout(function(){runScripts()}, 2000);
}

function led() {
  var options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: '/home/pi/projects/nodepi/scripts',
    args: [state.led[0], state.led[1], state.led[2]]
  };

  if( state.led != state.currentLed ) {
    state.currentLed = state.led;
    PythonShell.run('led.py', options,  function(err) {
//      if(err) throw err;
    });
  }
}

function light() {
  var options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: 'scripts',
    args: ['value1', 'value2', 'value3']
  };
  if (state.light === true && (state.prevLight === false || state.prevLight === undefined)){
    state.prevLight = true;
    PythonShell.run('light.py', options, function(err) {
      //if(err) throw err;
    });
  } else if (state.light === false && (state.prevLight === true || state.prevLight === false)){
    state.prevLight = false;
    PythonShell.run('scripts/light.py', function(err) {
     // if(err) throw err;
    });
  }
}

function handleResponse(body) {
  try {
    var properties = JSON.parse(body.toString());
    for (var key in state){
      if (key === 'led'){
        var led;
        try {
          console.log(state);
          if (properties['light']) {
            led = properties['led'].split(",");
            state['led'] = led;
          } else {
            state['led'] = [0, 0, 0];
          }
        }
        catch (err) {
          state['led'] = [0, 0, 0];
        }
      } else {
        if (properties[key]){
          state[key] = properties[key];
        } else {
          //state[key] = false;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  console.log(state.refreshTimeout);
  runScripts();
}

runScripts();
req();

http.listen(3000, function(){
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:3000');
});
