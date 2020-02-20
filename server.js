const io = require('socket.io')(3000);

io.on("connection", socket => {
    console.log('someone is out there');

    socket.on('yes', data => {
        console.log(data);
        
    })

    setInterval(() => {
        socket.emit("hello", "wow you are working");
    }, 1000);
});

