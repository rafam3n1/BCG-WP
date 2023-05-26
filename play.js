const socket = io.connect("https://play.grupobright.com");
socket.on('connect',  function (msg) {
    console.log("Conectado ao Servidor")
    socket.emit("getVms","");
});


socket.on("avaliable", function(msg){
    console.log(`Google: ${msg.google} - Azure: ${msg.azure}`)
})