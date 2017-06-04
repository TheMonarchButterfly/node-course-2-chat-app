const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// console.log(__dirname + '../public');
// console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected')

  // socket.emit('newMessage', {
  //   from: 'John',
  //   text: 'See you then',
  //   createdAt: 123123
  // });

  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: "Hey. What's goin' on.",
  //   createAt: 123
  // });

  // socket.emit from Admin text Welcome to the chat app
  
  // {
  //   from: 'Admin',
  //   text: 'Welcome to the chat app'
  // }
  

  // socket.broadcast.emit from Admin text New user joined
  
  // {
  //   from: 'Admin',
  //   text: 'New user joined',
  //   createdAt: new Date().getTime()
  // }
 
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    // socket.leave('blah');

    // io.emit (spam to everyone)
    // socket.broadcast.emit (sent to everyone except for the user)
    // socket.emit (sent specifically to one user)
    // io.to('blah').emit (sent to everyone in the room)
    // socket.broadcast.to('blah').emit (everyone in the room except for the user)
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
    }
    // console.log('createMessage', message);
     
    // {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // }

    callback();
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    }
  });

  socket.on('disconnect', () => {
    // console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

  socket.on('updateUserList', function (users) {
    console.log('Users list', users);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});