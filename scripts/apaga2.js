var io = require('../node_modules/socket.io-client');
var socket = io.connect('http://localhost:8080', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.on('disconnect', function (socket) {
    console.log('Desconectando!');
});
socket.emit('zona2', 0);






