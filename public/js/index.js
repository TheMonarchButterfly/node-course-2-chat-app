var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'Eddrick',
    text: 'Yup, that works for me.'
  });

  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey. This is Eddrick.'
  // });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

// socket.on('newEmail', function (email) {
//   console.log('New email', email);
// });