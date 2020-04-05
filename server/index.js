const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//const cors = require('cors');
const {DEFAULT_USER_TYPE} = require('./utils');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getAdminUser
} = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//app.use(cors());
app.use(router);

io.on('connect', (socket) => {

    socket.on('join', ({ name, type ,room }, callback) => {
        const { error, user } = addUser({ id: socket.id, type, name, room });

        if(error) return callback(error);

        socket.join(user.room);
        console.log(name,"joined - ", type ,room, DEFAULT_USER_TYPE);
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        if (type === DEFAULT_USER_TYPE) {
            const admin = getAdminUser();
            io.to(admin.id).emit('userJoined', user);
        }
        callback();
    });

    socket.on('sendEstimate', (point, callback) => {
        const user = getUser(socket.id);
        const admin = getAdminUser();
        io.to(admin.id).emit('setEstimate', { user: user.name, point });
        callback();
    });

    socket.on('sendStoryInfo', ({storyNumber, storyTitle, isGameStarted}, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('setStoryInfo', { storyNumber, storyTitle, isGameStarted });
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
    });

    socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));