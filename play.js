const socket = io.connect("https://play.grupobright.com:8080");

    
    
socket.on("criado", async function (mesg) {
    $("#jogos")[0].style.display="none"  
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = mesg.ip
    $("#form-field-senha")[0].value = mesg.password
})

socket.on("reconnect",async function(msg){
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    

    if(msg!="NADA"){
        $("#loading")[0].style.display="flex"
        $("#jogos")[0].style.display="none"
        firstItem.innerHTML=msg
    }
})

socket.on("interrompido",async function(msg){
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    firstItem.innerHTML="Carregando"
    $("#loading")[0].style.display="none"
    $("#jogos")[0].style.display="flex"  
})


socket.on("error",async function(msg){
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    firstItem.innerHTML="Carregando"
    $("#loading")[0].style.display="none"
    $("#jogos")[0].style.display="flex"  
})

socket.on('connect', async function (msg) {

    socket.emit("getVms","")


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
    $("#loading")[0].style.display="none"
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = msg.ip
    $("#form-field-senha")[0].value = msg.password
})



socket.on("vms",async function (msg){
    console.log(msg)
    socket.emit("vmCommand", { "evento": "CreateVM", "game": gameSelecionado })
    //socket.emit("vmCommand", { "evento": "List"})
})

socket.on("status",async function(msg){
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    firstItem.innerHTML=msg
})

socket.on("avaliable", function(msg){
    var disponiveis = document.getElementById("disponiveis");

    // Seleciona todos os elementos <li> dentro de "disponiveis"
    var listItems = disponiveis.querySelectorAll("li");
    listItems[0].querySelector(".elementor-icon-list-text").textContent=msg.google //GOOGLE
    listItems[1].querySelector(".elementor-icon-list-text").textContent=msg.azure // AZURE
    listItems[2].querySelector(".elementor-icon-list-text").textContent=msg.priority // AZURE
    console.log(`Google: ${msg.google} - Azure: ${msg.azure}`)
})

socket.on("assinatura",async function(msg){
    console.log(`Status assinatura - ${msg}`)
    if (msg==false){
        elementorProFrontend.modules.popup.showPopup({id:7665})
    }else{
        socket.emit("choose","fisica")
        socket.emit("vmCommand", { "evento": "List"})

        $("#jogos")[0].style.display="none"
        $("#loading")[0].style.display="flex"

        

    }
})

socket.on("fisica2", async function(msg){
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    firstItem.innerHTML="Carregando sua VM Física"

    socket.emit("vmCommand", { "evento": "CreateVM"})
})


///REDEFININDO ONCLICK BOTÕES


$(document).ready(function(){
    console.log("Pagina carregada")
    

    $("#priority-botao")[0].onclick=(async function(){
        let tokenPriority
        await fetch('https://grupobright.com/checkpriority.php')
        .then(async function(response) {
            tokenPriority=await response.text();
            console.log("Response checagem priority: "+tokenPriority)
            socket.emit('checarAssinatura', tokenPriority);
        })
        
    })

    $("#launcher-botao")[0].onclick=(function(){
        gameSelecionado='bcg'
    })

    $("#fifa23-botao")[0].onclick=(function(){
        gameSelecionado='fifa23'
    })

    $("#csgo-botao")[0].onclick=(function(){
        gameSelecionado='cs-go'
    })

    $("#pair-button")[0].onclick=(function(){
        socket.emit("auth", $("#form-field-pin")[0].value)
    })

    $("#desligarvm-botao")[0].onclick=(function(){
        socket.emit('interromper',{'feedback':'Feedback setado automaticamente (site novo)','stars':'star-5'})
        $("#vm-criada")[0].style.display="none" 
        $("#jogos")[0].style.display="flex"

    })
    
});
