const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

io.on("connection",(socket)=>{

    const {enteredName} = socket.handshake.query;
    socket.join(enteredName);
    

    socket.on("update",(data)=>{
        
        socket.in(enteredName).emit("update",data);
    });

    socket.on("toggleuser",(data)=>{
        socket.in(enteredName).emit("toggleuser",data);
    })

    
});


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });