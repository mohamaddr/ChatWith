var express = require('express');
require('dotenv').config()

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
// Create Express app
var app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// Variables
//var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cam';
var port = process.env.PORT || 8888;

// Connect to MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true }, function(err) {
//     if (err) {
//         console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
//         console.error(err.stack);
//         process.exit(1);
//     }
//     console.log(`Connected to MongoDB with URI: ${mongoURI}`);
// });


// Parse requests of content-type 'application/json'
app.use(bodyParser.json());
// HTTP request logger
app.use(morgan('dev'));
// Serve static assets (for frontend client)
var root = path.normalize(__dirname + '/..');
app.use(express.static(path.join(root, 'client')));
app.set('appPath', 'client');

// Import routes
app.use(require('./controllers/index'));

// Error handler (must be registered last)
var env = app.get('env');
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        "message": err.message,
        "error": {}
    };
    if (env === 'development') {
        err_res["error"] = err;
    }
    res.status(err.status || 500);
    res.json(err_res);
});






http.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend: http://localhost:${port}/`);
});



// http.listen(3000, () => {
//     console.log('Listening on port *: 3000');
// });



io.on('connection', (socket) => {

    socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});

module.exports = app;
