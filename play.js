const socket = io.connect("https://play.grupobright.com:8080");
let tokenSalvo
    
    
socket.on("criado", async function (mesg) {
    $("#jogos")[0].style.display="none"  
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = mesg.ip
    $("#form-field-senha")[0].value = mesg.password

    let ipURI

    if(mesg.node){
        ipURI=mesg.internalip
    }else{
        ipURI=mesg.ip
    }

    $("#entrarURI")[0].onclick=(function(){
        open(`bright-app://${ipURI}*${tokenSalvo}`)
    })

})

socket.on("RecCreated", async function (mesg) {
    $("#jogos")[0].style.display="none"  
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = mesg.ip
    $("#form-field-senha")[0].value = mesg.password

    if(mesg.node){
        ipURI=mesg.internalip
    }else{
        ipURI=mesg.ip
    }


    $("#entrarURI")[0].onclick=(function(){
        open(`bright-app://${ipURI}*${tokenSalvo}`)
    })
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
    if (msg.code != ""){

        elementorProFrontend.modules.popup.showPopup( { id: 11155 } );
        $(".elementor-heading-title")[4].innerHTML=msg.code
    }
    
})

socket.on("authed",async function(msg){
    elementorProFrontend.modules.popup.showPopup( { id: 12648 } );
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
        tokenSalvo=tokenSelecionado
    })

    
});


socket.on("created", async function (msg) {
    $("#loading")[0].style.display="none"
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = msg.ip
    $("#form-field-senha")[0].value = msg.password

    if(msg.node){
        ipURI=msg.internalip
    }else{
        ipURI=msg.ip
    }


    $("#entrarURI")[0].onclick=(function(){
        open(`bright-app://${ipURI}*${tokenSalvo}`)
    })
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

        
        var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
        var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
        firstItem.innerHTML="Espere 20 segundos que sua VM está carregando"
    }
})

socket.on("fisica2", async function(msg){
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    firstItem.innerHTML="Carregando sua VM Física"

    socket.emit("vmCommand", { "evento": "CreateVM"})
})

socket.on("fila", async function (msg) {
    var parentElement = document.getElementById('status_text'); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector('.ekit-fancy-prefix-text');
    firstItem.innerHTML= `Posição na fila: ${msg.position+1}`
    await new Promise(res => setTimeout(res, 5000));
    socket.emit("vmCommand", { "evento": "List" })
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



//DELETAR PRIORITY VM
    $("#resetar-botao")[0].onclick=(function(){
        socket.emit("deletarFisica","")
    })
    
//SETANDO JOGOS QUANDO CLICA NO BOTAO

//LAUNCHERS
    $("#launcher-botao")[0].onclick=(function(){
        gameSelecionado='bcg'
    })
//FIFA23
    $("#fifa23-botao")[0].onclick=(function(){
        gameSelecionado='fifa23'
    })
//CS-GO
    $("#csgo-botao")[0].onclick=(function(){
        gameSelecionado='cs-go'
    })
//BLACK DESERT
    $("#bdo-botao")[0].onclick=(function(){
        gameSelecionado='blackdesert'
    })
//COD WARZONE
    $("#warzone-botao")[0].onclick=(function(){
        gameSelecionado='cod'
    })

    $("#warzonesteam-botao")[0].onclick=(function(){
        gameSelecionado='cod-steam'
    })

//ELDERRING
    $("#eldenring-botao")[0].onclick=(function(){
        gameSelecionado='eldenring'
    })
//GTA STEAM
    $("#gtav-steam-botao")[0].onclick=(function(){
        gameSelecionado='gtav-steam'
    })
//GTA EPIC
    $("#gtav-epic-botao")[0].onclick=(function(){
        gameSelecionado='gtav-epic'
    })
//GTA ROCKSTAR
    $("#gtav-rockstar-botao")[0].onclick=(function(){
        gameSelecionado='gtav-rockstar'
    })
//HOGWARTS LEGACY
    $("#hlegacy-botao")[0].onclick=(function(){
        gameSelecionado='hlegacy'
    })
//GOW 1
    $("#god-of-war-botao")[0].onclick=(function(){
        gameSelecionado='god-of-war'
    })
//FIFA22
    $("#fifa22-botao")[0].onclick=(function(){
        gameSelecionado='fifa22'
    })
//LOSTARK
    $("#lostark-botao")[0].onclick=(function(){
        gameSelecionado='lostark'
    })
//RED DEAD
    $("#reddead-botao")[0].onclick=(function(){
        gameSelecionado='reddead'
    })
//ROCKET LEAGUE EPIC
    $("#rleague-epic-botao")[0].onclick=(function(){
        gameSelecionado='rleague-epic'
    })
//ROCKET LEAGUE STEAM
    $("#rleague-steam-botao")[0].onclick=(function(){
        gameSelecionado='rleague-steam'
    })
    //RDR2 EPIC
    $("#reddead-epic-botao")[0].onclick=(function(){
        gameSelecionado='reddead-epic'
    })
    //RDR2 EPIC
    $("#reddead-botao")[0].onclick=(function(){
        gameSelecionado='reddead'
    })

    //RLEAGUE EPIC
    $("#rleague-epic-botao")[0].onclick=(function(){
        gameSelecionado='reddead-epic'
    })
    //RLEAGUE EPIC
    $("#rleague-steam-botao")[0].onclick=(function(){
        gameSelecionado='reddead'
    })
//HORIZON ZERO DAWN
    $("#horizonzerodawn-botao")[0].onclick=(function(){
        gameSelecionado='horizonzerodawn'
    })
//OVERWATCH
    $("#overwatch-botao")[0].onclick=(function(){
        gameSelecionado='overwatch'
    })

    //SETANDO PIN MOON

    $("#pair-button")[0].onclick=(function(){
        socket.emit("auth", $("#form-field-pin")[0].value)
    })

    


    
    //SETANDO FUNÇÃO DE DESLIGAR VM

    $("#desligarvm-botao")[0].onclick=(function(){
        socket.emit('interromper',{'feedback':'Feedback setado automaticamente (site novo)','stars':'star-5'})
        $("#vm-criada")[0].style.display="none" 
        $("#jogos")[0].style.display="flex"

    })
    
});
