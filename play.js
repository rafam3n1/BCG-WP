

const socket = io.connect("https://play.grupobright.com");


socket.on('connect', async function (msg) {

    let tokenSelecionado
    await fetch('https://grupobright.com/checkuser.php')
    .then(async function(response) {
        tokenSelecionado=await response.text();
        console.log("Conectado ao Servidor")
        console.log("Servidor: "+tokenSelecionado)
        socket.emit('authenticate', tokenSelecionado);
    })

    
});



socket.on("created", async function (msg) {
    $("#form-field-ip")[0].value = msg.ip
    $("#form-field-senha")[0].value = msg.password
    $("#loading")[0].style.display="none"
    $("#vm-criada")[0].style.display="flex"  
})

socket.on("vms",async function (msg){
    console.log(msg)
    socket.emit("vmCommand", { "evento": "CreateVM", "game": gameSelecionado })
    //socket.emit("vmCommand", { "evento": "List"})
})

socket.on("status",async function(msg){
    console.log(msg)
})

socket.on("avaliable", function(msg){
    console.log(`Google: ${msg.google} - Azure: ${msg.azure}`)
})



///REDIFININDO ONCLICK BOTÕES


$(document).ready(function(){
    console.log("Pagina carregada")
    $("#launcher-botao")[0].onclick=(function(){
        gameSelecionado='launcher'
    })

    $("#fifa23-botao")[0].onclick=(function(){
        gameSelecionado='fifa23'
    })

    $("#csgo-botao")[0].onclick=(function(){
        gameSelecionado='cs-go'
    })

});
