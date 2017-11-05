// var http = require('http').createServer(handler); //require http server, and create server with function handler()
// var fs = require('fs'); //require filesystem module
// var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED1 = new Gpio(23, 'out'); //use GPIO pin 23 as output
var LED2 = new Gpio(24, 'out'); //use GPIO pin 24 as output
var lightvalueLED1 = 0; //global variable for current LED1 status
var lightvalueLED2 = 0; //global variable for current LED2 status 

// http.listen(8080); //listen to port 8080

// function handler (req, res) { //create server
//   fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
//     if (err) {
//       res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
//       return res.end("404 Not Found");
//     } 
//     res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
//     res.write(data); //write data from index.html
//     return res.end();
//   });
// }


var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
  
  app.use(express.static(__dirname + '/public'));

  res.sendfile(__dirname + 'public/index.html');
});


// WebSocket Connection
io.sockets.on('connection', function (socket) {
  console.log('Conected id:' + socket.id + ' at ' + Date());
  socket.emit('connected', { led1Status: lightvalueLED1, led2Status: lightvalueLED2 }); // Send to client the status of LED1 and LED2
  
  // Messages from scripts in crontab
  socket.on('zona1', function(data) { // get the message for zone1 from scripts
    if (data==1){
      console.log('Recibido mensaje de ENCENDIDO para la zona 1');
    }else{
      console.log('Recibido mensaje de APAGADO para la zona 1');
    }
    console.log('Estado del relé 1: ' + lightvalueLED1);

    lightvalueLED1 = data;
    if (lightvalueLED1 != LED1.readSync()) { //only change LED of status has changed
      LED1.writeSync(lightvalueLED1); //turn LED on or off
      console.log('Estado del rele de la zona 1 MODIFICADO.');
    }

    console.log('Relé 1: ' + lightvalueLED1 + '  ---  Relé 2: ' + lightvalueLED2);
    socket.disconnect(true); // disconnect properly the client who send the message
    io.sockets.emit('light1',data); // send to all clients the status for zone1
  });

  socket.on('zona2', function(data) { // get the message for zone1 from scripts
    if (data==1){
      console.log('Recibido mensaje de ENCENDIDO para la zona 2');
    }else{
      console.log('Recibido mensaje de APAGADO para la zona 2');
    }
    console.log('Estado del relé 2: ' + lightvalueLED2);

    lightvalueLED2 = data;
    if (lightvalueLED2 != LED2.readSync()) { //only change LED of status has changed
      LED2.writeSync(lightvalueLED2); //turn LED on or off
      console.log('Estado del rele de la zona 2 MODIFICADO.');
    }

    console.log('Relé 1: ' + lightvalueLED1 + '  ---  Relé 2: ' + lightvalueLED2);
    socket.disconnect(true);  // disconnect properly the client who send the message
    io.sockets.emit('light2',data); // send to all clients the status for zone1
  });

  // Messages from web clients
  socket.on('light1', function(data) { //get light switch status from web client
    lightvalueLED1 = data;
    if (lightvalueLED1 != LED1.readSync()) { //only change LED of status has changed
      LED1.writeSync(lightvalueLED1); //turn LED on or off
    }
  });
  socket.on('light2', function(data) { //get light switch status from web client
    lightvalueLED2 = data;
    if (lightvalueLED2 != LED2.readSync()) { //only change LED of status has changed
      LED2.writeSync(lightvalueLED2); //turn LED on or off
    }
  });
});

// For securety, turn off all relays
process.on('SIGINT', function () { //on ctrl+c
  LED1.writeSync(0); // Turn LED off
  LED2.writeSync(0); // Turn LED off
  LED1.unexport(); // Unexport LED GPIO to free resources
  LED2.unexport();
  process.exit(); //exit completely
});
