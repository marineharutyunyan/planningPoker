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
    getAdminUser,
    setVotingHistory,
    getVotingHistory,
    removeEstimationFromHistory
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
        console.log(name,"joined - ", user.name, room, type);
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        io.to(user.room).emit('setVotingHistory', { history: getVotingHistory(user.room) });
        if (type === DEFAULT_USER_TYPE) {
            const admin = getAdminUser();
            admin && io.to(admin.id).emit('userJoined', user);
        }
        callback();
    });

    socket.on('sendEstimate', (point, callback) => {
        const user = getUser(socket.id);
        const admin = getAdminUser();
        admin && io.to(admin.id).emit('setEstimate', { user: user.name, point });
        callback();
    });

    socket.on('sendStoryInfo', ({storyTitle, isGameStarted}, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('setStoryInfo', {storyTitle, isGameStarted});
        callback();
    });

    socket.on('sendVotingPermission', ({canVote}, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('setVotingPermission', { canVote });
        callback();
    });

    socket.on(
        'sendVotingHistoryUpdate',
        (
            {room, users, points, avaragePoint, avarageConvertedToFib, storyTitle, stageId},
            callback
        ) => {
            const history = setVotingHistory({room, users, points, avaragePoint, avarageConvertedToFib, storyTitle, stageId});
            io.to(room).emit('setVotingHistory', { history: history[room] });
            callback();
        }
    );

    socket.on(
        'deleteEstimationFromHistory',
        ({room, id}, callback) => {
            const history = removeEstimationFromHistory({room, id});
            io.to(room).emit('setVotingHistory', { history: history[room] });
            callback();
        }
    );

    socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
    });

    socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        console.log(`${user.name} has left.`);
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        if (user.type === DEFAULT_USER_TYPE) {
            const admin = getAdminUser();
            admin && io.to(admin.id).emit('removePoint', {user: user.name});
        }
    }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));