const socket = io.connect("https://play.grupobright.com:8080");
let tokenSalvo
let tokenCustom
    
    
socket.on("criado", async function (mesg) {
    $("#jogos")[0].style.display="none"  
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = mesg.ip
    $("#form-field-senha")[0].value = mesg.password

    let ipURI
    let gameURI

    if(mesg.node){
        ipURI=mesg.internalip
        gameURI="1"
    }else{
        ipURI=mesg.ip
        gameURI="2"
    }


    $("#stream-botao")[0].onclick=(function(){
        window.location.href = (mesg.streamUrl+`&vm_password=${btoa(mesg.password)}`)
    })

    $("#entrarURI")[0].onclick=(function(){
        open(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`)
        console.log(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`)
    })


    
})

socket.on("RecCreated", async function (mesg) {
    $("#jogos")[0].style.display="none"  
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = mesg.ip
    $("#form-field-senha")[0].value = mesg.password

    let ipURI
    let gameURI

    if(mesg.node){
        ipURI=mesg.internalip
        gameURI="1"
    }else{
        ipURI=mesg.ip
        gameURI="2"
    }

    $("#entrarURI")[0].onclick=(function(){
        open(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`)
        console.log(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`)
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
        $(".elementor-heading-title")[3].innerHTML=msg.code
    }
    
})

socket.on("authed",async function(msg){
    elementorProFrontend.modules.popup.showPopup( { id: 12648 } );
})

socket.on('connect', async function (msg) {

    socket.emit("getVms","")


    let tokenSelecionado
    await fetch('https://grupobright.com/check.php')
    .then(async function(response) {
        tokenSelecionado=await response.text();
        console.log("Conectado ao Servidor")
        console.log("Servidor: "+tokenSelecionado)
        socket.emit('authenticate', tokenSelecionado);
        tokenSalvo=tokenSelecionado
    })
    


    /*
    await fetch('https://grupobright.com/customcheck.php')
    .then(async function(response) {
        tokenCustom=await response.text();
        console.log("Conectado ao Servidor")
        socket.emit("authenticateCustom", tokenCustom)
       
    })*/

    
});


socket.on("created", async function (msg) {
    $("#loading")[0].style.display="none"
    $("#vm-criada")[0].style.display="flex"  
    $("#form-field-ip")[0].value = msg.ip
    $("#form-field-senha")[0].value = msg.password

    let ipURI
    let gameURI

    if(msg.node){
        ipURI=msg.internalip
        gameURI="1"
    }else{
        ipURI=msg.ip
        gameURI="2"
    }

    $("#stream-botao")[0].onclick=(function(){
        window.location.href = (msg.streamUrl+`&vm_password=${btoa(msg.password)}`)
    })

    $("#entrarURI")[0].onclick=(function(){
        open(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`)
        console.log(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`)
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
        gameSelecionado='hoglegacy'
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

//HORIZON ZERO DAWN
    $("#horizonzerodawn-botao")[0].onclick=(function(){
        gameSelecionado='horizonzerodawn'
    })
//OVERWATCH
    $("#overwatch-botao")[0].onclick=(function(){
        gameSelecionado='overwatch'
    })

//BALDURS
    $("#baldurs-botao")[0].onclick=(function(){
        gameSelecionado='baldurs-gate3'
    })

//STARFIELD
    $("#starfield-botao")[0].onclick=(function(){
        gameSelecionado='starfield'
    })

//STARFIELD-XBOX
    $("#starfield-xbox-botao")[0].onclick=(function(){
        gameSelecionado='starfield-xbox'
    })

    //forzahorizon5-botao
    $("#forzahorizon5-botao")[0].onclick=(function(){
        gameSelecionado='forza-horizon'
    })





    //SEA OF THIEVES
    $("#seaofthieves-botao")[0].onclick = (function () {
        gameSelecionado = 'seaofthieves'
    })


      //WOW
      $("#wow-botao")[0].onclick = (function () {
        gameSelecionado = 'wow'
    })
    
      //CYBERPUNK
      $("#cyberpunk-botao")[0].onclick = (function () {
        gameSelecionado = 'cyberpunk'
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


    //SETANDO FUNÇÃO DE STREAM VM

    


    
    //SETANDO FUNÇÃO DE RESETAR VM

    $("#resetar-botao")[0].onclick=(function(){
        socket.emit('reset','')
        $("#vm-criada")[0].style.display="none" 
        $("#jogos")[0].style.display="flex"
    })






    ///////////////////////////////////////////////////
//                    CUSTOM                     //
///////////////////////////////////////////////////

// LAUNCHERS CUSTOM
$("#launcher-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'bcg'
})
// FIFA23 CUSTOM
$("#fifa23-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'fifa23'
})
// CS-GO CUSTOM
$("#csgo-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'cs-go'
})
// BLACK DESERT CUSTOM
$("#bdo-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'blackdesert'
})
// COD WARZONE CUSTOM
$("#warzone-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'cod'
})

$("#warzonesteam-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'cod-steam'
})

// ELDERRING CUSTOM
$("#eldenring-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'eldenring'
})
// GTA STEAM CUSTOM
$("#gtav-steam-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'gtav-steam'
})
// GTA EPIC CUSTOM
$("#gtav-epic-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'gtav-epic'
})
// GTA ROCKSTAR CUSTOM
$("#gtav-rockstar-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'gtav-rockstar'
})
// HOGWARTS LEGACY CUSTOM
$("#hlegacy-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'hlegacy'
})
// GOW 1 CUSTOM
$("#god-of-war-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'god-of-war'
})
// FIFA22 CUSTOM
$("#fifa22-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'fifa22'
})
// LOSTARK CUSTOM
$("#lostark-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'lostark'
})
// RED DEAD CUSTOM
$("#reddead-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'reddead'
})
// ROCKET LEAGUE EPIC CUSTOM
$("#rleague-epic-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'rleague-epic'
})
// ROCKET LEAGUE STEAM CUSTOM
$("#rleague-steam-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'rleague-steam'
})
// RDR2 EPIC CUSTOM
$("#reddead-epic-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'reddead-epic'
})

// RDR2 STEAM CUSTOM
$("#reddead-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'reddead'
})

// HORIZON ZERO DAWN CUSTOM
$("#horizonzerodawn-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'horizonzerodawn'
})
// OVERWATCH CUSTOM
$("#overwatch-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'overwatch'
})

// BALDURS CUSTOM
$("#baldurs-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'baldurs-gate3'
})

// STARFIELD CUSTOM
$("#starfield-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'starfield'
})

// STARFIELD-XBOX CUSTOM
$("#starfield-xbox-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'starfield-xbox'
})


//SEA OF THIEVES CUSTOM
$("#seaofthieves-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'seaofthieves'
})


//forzahorizon5-botao
$("#forzahorizon5-botao-custom")[0].onclick=(function(){
    gameSelecionado='forza-horizon'
})

//WOW CUSTOM
$("#wow-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'wow'
})

  //CYBERPUNK CUSTOM
  $("#cyberpunk-botao-custom")[0].onclick = (function () {
    gameSelecionado = 'cyberpunk'
})

});
