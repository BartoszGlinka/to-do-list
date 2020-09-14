const express = require('express');
const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const socket = require('socket.io');
const io = socket(server);
let tasks = [];

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);

    socket.on('addTask', nameTask => {
        tasks.push(nameTask);
        socket.broadcast.emit('addTask', nameTask);
    });

    socket.on('removeTask', id => {
        tasks = tasks.filter(task => task.id !== id);
        socket.broadcast.emit('removeTask', id);
    });
});


app.use((req, res) => {
    res.status(404).send('404 not found...');
})