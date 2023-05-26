const socket = io.connect("https://play.grupobright.com");
socket.on('connect', async function (msg) {
    console.log("Conectado ao Servidor")
    await socket.emit("getVms","");
});


socket.on("avaliable",async function(msg){
    console.log(`Google: ${msg.google} - Azure: ${msg.azure}`)
})