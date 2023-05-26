const socket = io.connect("https://play.grupobright.com");
socket.on('connect',  function (msg) {
    console.log("Conectado ao Servidor")
});


socket.on("created", async function (msg) {
    $("#ip")[0].value = msg.ip
    $("#senha")[0].value = msg.password
    $("#loading")[0].style.display="none"
    $("#vm-criada")[0].style.display="flex"  
})

socket.on("avaliable", function(msg){
    console.log(`Google: ${msg.google} - Azure: ${msg.azure}`)
})