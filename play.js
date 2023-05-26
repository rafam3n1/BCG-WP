const socket = io.connect("https://play.grupobright.com");
socket.on('connect', function (msg) {
    console.log("Conectado ao Servidor")
});