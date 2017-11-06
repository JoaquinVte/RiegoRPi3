var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var RELAY1 = new Gpio(23, 'out'); //use GPIO pin 23 as output
var RELAY2 = new Gpio(24, 'out'); //use GPIO pin 24 as output
var relayStatus1 = 0; //global variable for current RELAY1 status
var relayStatus2 = 0; //global variable for current RELAY2 status 
var logFile = 'registro.log';


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs =require('fs');

app.use(express.static(__dirname + '/public')); // The server serves static files from public directori like js and css
app.get('/',function(req,res, next){
  res.senFile(__dirname + '/public/index.html');// The file index.html is served when someone tries to connect.
})

server.listen(8080); // 8080 is the server port to listen messages
registrar(logFile,'Servidor lanzado escuchando por el puerto 8080');



// WebSocket Connection
io.sockets.on('connection', function (socket) {

  registrar(logFile,'Nueva conexion!!!  id: ' + socket.id + ' from: ' + socket.conn.remoteAddress);// Register a new connection
  socket.emit('connected', { led1Status: relayStatus1, led2Status: relayStatus2 }); // Send to client the status of RELAY1 and RELAY2
  
  // Messages from scripts in crontab
  socket.on('zona1', function(data) { // get the message for zone1 from scripts
    if (data==1){
      registrar(logFile,'Recibido mensaje de ENCENDIDO mediante SCRIPT para la zona 1');
    }else{
      registrar(logFile,'Recibido mensaje de APAGADO mediante SCRIPT para la zona 1');
    }
    registrar(logFile,'Estado del relé 1: ' + relayStatus1);

    relayStatus1 = data;
    if (relayStatus1 != RELAY1.readSync()) { //only change RELAY of status has changed
      RELAY1.writeSync(relayStatus1); //turn RELAY on or off
      registrar(logFile,'Estado del rele de la zona 1 MODIFICADO. ');
    }
    registrar(logFile,'Relé 1: ' + relayStatus1 + '  ---  Relé 2: ' + relayStatus2);
    socket.disconnect(true); // disconnect properly the client who send the message
    io.sockets.emit('relay1',data); // send to all clients the status for zone1
  });

  socket.on('zona2', function(data) { // get the message for zone1 from scripts
    if (data==1){
      registrar(logFile,'Recibido mensaje de ENCENDIDO mediante SCRIPT para la zona 2');
    }else{
      registrar(logFile,'Recibido mensaje de APAGADO mediante SCRIPT para la zona 2');
    }
    registrar(logFile,'Estado del relé 2: ' + relayStatus2);

    relayStatus2 = data;
    if (relayStatus2 != RELAY2.readSync()) { //only change RELAY of status has changed
      RELAY2.writeSync(relayStatus2); //turn RELAY on or off
      registrar(logFile,'Estado del rele de la zona 2 MODIFICADO via WEB.' );
    }

    registrar(logFile,'Relé 1: ' + relayStatus1 + '  ---  Relé 2: ' + relayStatus2);
    socket.disconnect(true);  // disconnect properly the client who send the message
    io.sockets.emit('relay2',data); // send to all clients the status for zone1
  });

  // Messages from web clients
  socket.on('relay1', function(data) { //get relay switch status from web client
    relayStatus1 = data;
    if (relayStatus1 != RELAY1.readSync()) { //only change RELAY of status has changed
      RELAY1.writeSync(relayStatus1); //turn RELAY on or off
      registrar(logFile,'Estado del rele de la zona 1 MODIFICADO via WEB.' );
      registrar(logFile,'Relé 1: ' + relayStatus1 + '  ---  Relé 2: ' + relayStatus2);
      io.sockets.emit('relay1',data); // send to all clients the status for zone1
    }


  });
  socket.on('relay2', function(data) { //get relay switch status from web client
    relayStatus2 = data;
    if (relayStatus2 != RELAY2.readSync()) { //only change RELAY of status has changed
      RELAY2.writeSync(relayStatus2); //turn RELAY on or off
      registrar(logFile,'Estado del rele de la zona 2 MODIFICADO via WEB.' );
      registrar(logFile,'Relé 1: ' + relayStatus1 + '  ---  Relé 2: ' + relayStatus2);
      io.sockets.emit('relay2',data); // send to all clients the status for zone2
    }
  });
});

// Function to save all events on the server.
function registrar(file,text){
  fs.appendFile(file, Date() + ' ---> ' + text + '\n', function (err) {
    if (err) throw err;
  });
  console.log(Date() + ' ---> ' +text);
}
// For securety, turn off all relays
process.on('SIGINT', function () { //on ctrl+c
  RELAY1.writeSync(0); // Turn RELAY off
  RELAY2.writeSync(0); // Turn RELAY off
  RELAY1.unexport(); // Unexport RELAY GPIO to free resources
  RELAY2.unexport();
  console.log('Saliendo....')
  process.exit(); //exit completely
});
