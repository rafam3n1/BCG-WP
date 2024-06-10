let socket = io.connect("https://play.grupobright.com:8080");
let tokenSalvo;
let tokenCustom;

socket.on("criado", async function (mesg) {
  $("#jogos")[0].style.display = "none";
  $("#vm-criada")[0].style.display = "flex";
  $("#form-field-ip")[0].value = mesg.ip;
  $("#form-field-senha")[0].value = mesg.password;

  let ipURI;
  let gameURI;

  if (mesg.node) {
    ipURI = mesg.internalip;
    gameURI = "1";
  } else {
    ipURI = mesg.ip;
    gameURI = "2";
  }

  if (mesg.internalip) {
    $("#form-field-ipmoonlight")[0].value = mesg.internalip;
  } else {
    $("#form-field-ipmoonlight")[0].value = mesg.ip;
  }

  $("#stream-botao")[0].onclick = function () {
    window.location.href =
      mesg.streamUrl + `&vm_password=${btoa(btoa(mesg.password))}`;
  };

  $("#entrarURI")[0].onclick = function () {
    open(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`);
    console.log(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`);
  };
});

socket.on("RecCreated", async function (mesg) {
  $("#jogos")[0].style.display = "none";
  $("#vm-criada")[0].style.display = "flex";
  $("#form-field-ip")[0].value = mesg.ip;
  $("#form-field-senha")[0].value = mesg.password;

  let ipURI;
  let gameURI;

  if (mesg.node) {
    ipURI = mesg.internalip;
    gameURI = "1";
  } else {
    ipURI = mesg.ip;
    gameURI = "2";
  }

  if (mesg.internalip) {
    $("#form-field-ipmoonlight")[0].value = mesg.internalip;
  } else {
    $("#form-field-ipmoonlight")[0].value = mesg.ip;
  }

  $("#stream-botao")[0].onclick = function () {
    window.location.href =
      mesg.streamUrl + `&vm_password=${btoa(btoa(mesg.password))}`;
  };

  $("#entrarURI")[0].onclick = function () {
    open(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`);
    console.log(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`);
  };
});

socket.on("reconnect", async function (msg) {
  var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");

  if (msg != "NADA") {
    $("#loading")[0].style.display = "flex";
    $("#jogos")[0].style.display = "none";
    firstItem.innerHTML = msg;
  }
});

socket.on("interrompido", async function (msg) {
  var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = "Carregando";
  $("#loading")[0].style.display = "none";
  $("#jogos")[0].style.display = "flex";
});

socket.on("error", async function (msg) {
  var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = "Carregando";
  $("#loading")[0].style.display = "none";
  $("#jogos")[0].style.display = "flex";
  if (msg.code != "") {
    elementorProFrontend.modules.popup.showPopup({ id: 49478 });
    $("#label-erro")[0].innerHTML = msg.code;
  }
});

socket.on("authed", async function (msg) {
  elementorProFrontend.modules.popup.showPopup({ id: 12648 });
});

socket.on("connect", async function (msg) {
  socket.emit("getVms", "");

  let tokenSelecionado;
  while (true) {
    await fetch("https://grupobright.com/check.php").then(async function (
      response
    ) {
      tokenSelecionado = await response.text();
      console.log("Conectado ao Servidor");
      console.log("Servidor: " + tokenSelecionado);
      socket.emit("authenticate", tokenSelecionado);
      tokenSalvo = tokenSelecionado;
    });

    await new Promise((res) => setTimeout(res, 4 * 60 * 60 * 1000));

    socket.disconnect();
    await new Promise((res) => setTimeout(res, 3000));
    socket = io.connect("https://play.grupobright.com:8080");
  }

  /*
    await fetch('https://grupobright.com/customcheck.php')
    .then(async function(response) {
        tokenCustom=await response.text();
        console.log("Conectado ao Servidor")
        socket.emit("authenticateCustom", tokenCustom)
       
    })*/
});

socket.on("created", async function (msg) {
  $("#loading")[0].style.display = "none";
  $("#vm-criada")[0].style.display = "flex";
  $("#form-field-ip")[0].value = msg.ip;
  $("#form-field-senha")[0].value = msg.password;

  let ipURI;
  let gameURI;

  if (msg.node) {
    ipURI = msg.internalip;
    gameURI = "1";
  } else {
    ipURI = msg.ip;
    gameURI = "2";
  }

  if (msg.internalip) {
    $("#form-field-ipmoonlight")[0].value = msg.internalip;
  } else {
    $("#form-field-ipmoonlight")[0].value = msg.ip;
  }

  $("#stream-botao")[0].onclick = function () {
    window.location.href =
      msg.streamUrl + `&vm_password=${btoa(btoa(msg.password))}`;
  };

  $("#entrarURI")[0].onclick = function () {
    open(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`);
    console.log(`bright-app://${ipURI}*${tokenSalvo}*${gameURI}`);
  };
});

socket.on("vms", async function (msg) {
  console.log(msg);
  socket.emit("vmCommand", { evento: "CreateVM", game: gameSelecionado });
  //socket.emit("vmCommand", { "evento": "List"})
});

socket.on("status", async function (msg) {
  var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = msg;
});

socket.on("avaliable", function (msg) {

  const gtxY = parseInt(msg.gtx.split(': ')[1], 10);
  const rtxY = parseInt(msg.rtx.split(': ')[1], 10);
  const total = gtxY + rtxY;  
  $("#label_total")[0].querySelector("span").innerHTML=`RTX: ${rtxY} e Total: ${total}`

  /*
  var disponiveis = document.getElementById("disponiveis");

  // Seleciona todos os elementos <li> dentro de "disponiveis"
  var listItems = disponiveis.querySelectorAll("li");
  listItems[0].querySelector(".elementor-icon-list-text").textContent =
    msg.google; //GOOGLE
  listItems[1].querySelector(".elementor-icon-list-text").textContent =
    msg.azure; // AZURE
  listItems[2].querySelector(".elementor-icon-list-text").textContent =
    msg.priority; // priority
  listItems[3].querySelector(".elementor-icon-list-text").textContent = msg.rtx; // RTX
  listItems[4].querySelector(".elementor-icon-list-text").textContent = msg.gtx; // GTX
  console.log(`Google: ${msg.google} - Azure: ${msg.azure}`);*/
});

socket.on("assinatura", async function (msg) {
  console.log(`Status assinatura - ${msg}`);
  if (msg == false) {
    elementorProFrontend.modules.popup.showPopup({ id: 49498 });
  } else {
    socket.emit("choose", "fisica");
    socket.emit("vmCommand", { evento: "List" });

    $("#jogos")[0].style.display = "none";
    $("#loading")[0].style.display = "flex";

    var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
    firstItem.innerHTML = "Espere 20 segundos que sua VM está carregando";
  }
});

socket.on("changeRegion", async function (msg) {
  //abrir poupp
  elementorProFrontend.modules.popup.showPopup({ id: 37412 });

  //botão sim
  $('div[data-id="57b3113"]')[0].onclick = function () {
    socket.emit("region", "yes");
    socket.emit("choose", "google");
    socket.emit("vmCommand", { evento: "List" });
  };

  $("#southamerica-east1-c")[0].onclick = function () {
    socket.emit("region", "yes1");
    socket.emit("choose", "google");
    socket.emit("vmCommand", { evento: "List" });
  };

  $('div[data-id="ef7fe9a"]')[0].onclick = function () {
    socket.emit("region", "no");
    socket.emit("choose", "google");
    socket.emit("vmCommand", { evento: "List" });
  };
});

socket.on("fisica2", async function (msg) {
  var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = "Carregando sua VM Física";

  socket.emit("vmCommand", { evento: "CreateVM" });
});

socket.on("fila", async function (msg) {
  var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = `Posição na fila: ${msg.position + 1}`;
  await new Promise((res) => setTimeout(res, 5000));
  socket.emit("vmCommand", { evento: "List" });
});

socket.on("vmCheckStatus", function (msg) {
  const statuses = {
    RUNNING: `<font color="#ffffff"><text>Status da máquina:</text></font> <font color="#33cc33"><text>Ligada</text></font>`,
    TERMINATED: `<font color="#ffffff"><text>Status da máquina:</text></font> <font color="#ffcc00"><text>Desligada</text></font>`,
    DELETED: `<font color="#ffffff"><text>Status da máquina:</text></font> <font color="#ff3300"><text>Deletada</text></font>`,
  };

  $("#statusmaquina")[0].children[0].innerHTML = statuses[msg];
});

///REDEFININDO ONCLICK BOTÕES

$(document).ready(function () {
  console.log("Pagina carregada");

  $("#priority-botao")[0].onclick = async function () {
    let tokenPriority;
    await fetch("https://grupobright.com/checkpriority.php").then(
      async function (response) {
        tokenPriority = await response.text();
        console.log("Response checagem priority: " + tokenPriority);
        socket.emit("checarAssinatura", tokenPriority);
      }
    );
  };

  //DELETAR PRIORITY VM
  //$("#resetar-botao")[0].onclick=(function(){
  //  socket.emit("deletarFisica","")
  //})

  //SETANDO JOGOS QUANDO CLICA NO BOTAO

  //LAUNCHERS
  $("#launcher-botao")[0].onclick = function () {
    gameSelecionado = "bcg";
  };
  //FIFA23
  $("#fifa23-botao")[0].onclick = function () {
    gameSelecionado = "fifa23";
  };
  //CS-GO
  $("#csgo-botao")[0].onclick = function () {
    gameSelecionado = "cs-go";
  };
  //BLACK DESERT
  $("#bdo-botao")[0].onclick = function () {
    gameSelecionado = "blackdesert";
  };
  //COD WARZONE
  $("#warzone-botao")[0].onclick = function () {
    gameSelecionado = "cod";
  };

  $("#warzonesteam-botao")[0].onclick = function () {
    gameSelecionado = "cod-steam";
  };

  //ELDERRING
  $("#eldenring-botao")[0].onclick = function () {
    gameSelecionado = "eldenring";
  };
  //GTA STEAM
  $("#gtav-steam-botao")[0].onclick = function () {
    gameSelecionado = "gtav-steam";
  };
  //GTA EPIC
  $("#gtav-epic-botao")[0].onclick = function () {
    gameSelecionado = "gtav-epic";
  };
  //GTA ROCKSTAR
  $("#gtav-rockstar-botao")[0].onclick = function () {
    gameSelecionado = "gtav-rockstar";
  };
  //HOGWARTS LEGACY
  $("#hlegacy-botao")[0].onclick = function () {
    gameSelecionado = "hoglegacy";
  };
  //GOW 1
  $("#god-of-war-botao")[0].onclick = function () {
    gameSelecionado = "god-of-war";
  };
  //FIFA22
  $("#fifa22-botao")[0].onclick = function () {
    gameSelecionado = "fifa22";
  };
  //LOSTARK
  $("#lostark-botao")[0].onclick = function () {
    gameSelecionado = "lostark";
  };
  //RED DEAD
  $("#reddead-botao")[0].onclick = function () {
    gameSelecionado = "reddead";
  };
  //ROCKET LEAGUE EPIC
  $("#rleague-epic-botao")[0].onclick = function () {
    gameSelecionado = "rleague-epic";
  };
  //ROCKET LEAGUE STEAM
  $("#rleague-steam-botao")[0].onclick = function () {
    gameSelecionado = "rleague-steam";
  };
  //RDR2 EPIC
  $("#reddead-epic-botao")[0].onclick = function () {
    gameSelecionado = "reddead-epic";
  };
  //RDR2 EPIC
  $("#reddead-botao")[0].onclick = function () {
    gameSelecionado = "reddead";
  };

  //HORIZON ZERO DAWN
  $("#horizonzerodawn-botao")[0].onclick = function () {
    gameSelecionado = "horizonzerodawn";
  };
  //OVERWATCH
  $("#overwatch-botao")[0].onclick = function () {
    gameSelecionado = "overwatch";
  };

  //BALDURS
  $("#baldurs-botao")[0].onclick = function () {
    gameSelecionado = "baldurs-gate3";
  };

  //STARFIELD
  $("#starfield-botao")[0].onclick = function () {
    gameSelecionado = "starfield";
  };

  //STARFIELD-XBOX
  $("#starfield-xbox-botao")[0].onclick = function () {
    gameSelecionado = "starfield-xbox";
  };

  //forzahorizon5-botao
  $("#forzahorizon5-botao")[0].onclick = function () {
    gameSelecionado = "forza-horizon";
  };

  //SEA OF THIEVES
  $("#seaofthieves-botao")[0].onclick = function () {
    gameSelecionado = "seaofthieves";
  };

  //SEA OF THIEVES STEAM
  $("#seaofthieves-steam-botao")[0].onclick = function () {
    gameSelecionado = "sea-steam";
  };

  //WOW
  $("#wow-botao")[0].onclick = function () {
    gameSelecionado = "wow";
  };

  //CYBERPUNK
  $("#cyberpunk-botao")[0].onclick = function () {
    gameSelecionado = "cyberpunk";
  };

  //MORTALKOMBAT-
  $("#mortalkombat1-botao")[0].onclick = function () {
    gameSelecionado = "morta-kombat1";
  };

  //SETANDO PIN MOON

  $("#pair-button")[0].onclick = function () {
    socket.emit("auth", $("#form-field-pin")[0].value);
  };

  //SETANDO FUNÇÃO DE DESLIGAR VM

  $("#desligarvm-botao")[0].onclick = function () {
    socket.emit("interromper", {
      feedback: "Feedback setado automaticamente (site novo)",
      stars: "star-5",
    });
    $("#vm-criada")[0].style.display = "none";
    $("#jogos")[0].style.display = "flex";
  };

  //SETANDO FUNÇÃO DE STREAM VM

  //SETANDO FUNÇÃO DE RESETAR VM

  $("#popupreset-botao")[0].onclick = function () {
    elementorProFrontend.modules.popup.showPopup({ id: 49488 });

    $("#resetar-botao")[0].onclick = function () {
      socket.emit("reset", "");
      $("#loading")[0].style.display = "flex";
      $("#vm-criada")[0].style.display = "none";
    };
  };

  $("#resetarstream-botao")[0].onclick = function () {
    $("#loading")[0].style.display = "flex";
    $("#vm-criada")[0].style.display = "none";
    var parentElement = document.getElementById("status_text"); // Substitua 'id-do-elemento-pai' pelo ID do elemento pai
    var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
    firstItem.innerHTML = "Resetando stream";
    socket.emit("resetStreamURL", "");
  };

  $("#interromper-botao")[0].onclick = function () {
    socket.emit("sair", "sairFila");
  };

  socket.on("newStreamURL", async function (msg) {
    $("#loading")[0].style.display = "none";
    $("#vm-criada")[0].style.display = "flex";
    $("#stream-botao")[0].onclick = function () {
      window.location.href =
        msg.streamUrl + `&vm_password=${btoa(btoa(msg.password))}`;
    };
  });

  socket.on("restado", async function (msg) {
    $("#loading")[0].style.display = "none";
    $("#jogos")[0].style.display = "flex";
  });

  ///////////////////////////////////////////////////
  //                    CUSTOM                     //
  ///////////////////////////////////////////////////

  // LAUNCHERS CUSTOM
  $("#launcher-botao-custom")[0].onclick = function () {
    gameSelecionado = "bcg";
  };
  // FIFA23 CUSTOM
  $("#fifa23-botao-custom")[0].onclick = function () {
    gameSelecionado = "fifa23";
  };
  // CS-GO CUSTOM
  $("#csgo-botao-custom")[0].onclick = function () {
    gameSelecionado = "cs-go";
  };
  // BLACK DESERT CUSTOM
  $("#bdo-botao-custom")[0].onclick = function () {
    gameSelecionado = "blackdesert";
  };
  // COD WARZONE CUSTOM
  $("#warzone-botao-custom")[0].onclick = function () {
    gameSelecionado = "cod";
  };

  $("#warzonesteam-botao-custom")[0].onclick = function () {
    gameSelecionado = "cod-steam";
  };

  // ELDERRING CUSTOM
  $("#eldenring-botao-custom")[0].onclick = function () {
    gameSelecionado = "eldenring";
  };
  // GTA STEAM CUSTOM
  $("#gtav-steam-botao-custom")[0].onclick = function () {
    gameSelecionado = "gtav-steam";
  };
  // GTA EPIC CUSTOM
  $("#gtav-epic-botao-custom")[0].onclick = function () {
    gameSelecionado = "gtav-epic";
  };
  // GTA ROCKSTAR CUSTOM
  $("#gtav-rockstar-botao-custom")[0].onclick = function () {
    gameSelecionado = "gtav-rockstar";
  };
  // HOGWARTS LEGACY CUSTOM
  $("#hlegacy-botao-custom")[0].onclick = function () {
    gameSelecionado = "hlegacy";
  };
  // GOW 1 CUSTOM
  $("#god-of-war-botao-custom")[0].onclick = function () {
    gameSelecionado = "god-of-war";
  };
  // FIFA22 CUSTOM
  $("#fifa22-botao-custom")[0].onclick = function () {
    gameSelecionado = "fifa22";
  };
  // LOSTARK CUSTOM
  $("#lostark-botao-custom")[0].onclick = function () {
    gameSelecionado = "lostark";
  };
  // RED DEAD CUSTOM
  $("#reddead-botao-custom")[0].onclick = function () {
    gameSelecionado = "reddead";
  };
  // ROCKET LEAGUE EPIC CUSTOM
  $("#rleague-epic-botao-custom")[0].onclick = function () {
    gameSelecionado = "rleague-epic";
  };
  // ROCKET LEAGUE STEAM CUSTOM
  $("#rleague-steam-botao-custom")[0].onclick = function () {
    gameSelecionado = "rleague-steam";
  };
  // RDR2 EPIC CUSTOM
  $("#reddead-epic-botao-custom")[0].onclick = function () {
    gameSelecionado = "reddead-epic";
  };

  // RDR2 STEAM CUSTOM
  $("#reddead-botao-custom")[0].onclick = function () {
    gameSelecionado = "reddead";
  };

  // HORIZON ZERO DAWN CUSTOM
  $("#horizonzerodawn-botao-custom")[0].onclick = function () {
    gameSelecionado = "horizonzerodawn";
  };
  // OVERWATCH CUSTOM
  $("#overwatch-botao-custom")[0].onclick = function () {
    gameSelecionado = "overwatch";
  };

  // BALDURS CUSTOM
  $("#baldurs-botao-custom")[0].onclick = function () {
    gameSelecionado = "baldurs-gate3";
  };

  // STARFIELD CUSTOM
  $("#starfield-botao-custom")[0].onclick = function () {
    gameSelecionado = "starfield";
  };

  // STARFIELD-XBOX CUSTOM
  $("#starfield-xbox-botao-custom")[0].onclick = function () {
    gameSelecionado = "starfield-xbox";
  };

  //SEA OF THIEVES CUSTOM
  $("#seaofthieves-botao-custom")[0].onclick = function () {
    gameSelecionado = "seaofthieves";
  };

  //SEA OF THIEVES STEAM custom
  $("#seaofthieves-steam-botao-custom")[0].onclick = function () {
    gameSelecionado = "sea-steam";
  };

  //forzahorizon5-botao
  $("#forzahorizon5-botao-custom")[0].onclick = function () {
    gameSelecionado = "forza-horizon";
  };

  //WOW CUSTOM
  $("#wow-botao-custom")[0].onclick = function () {
    gameSelecionado = "wow";
  };

  //CYBERPUNK CUSTOM
  $("#cyberpunk-botao-custom")[0].onclick = function () {
    gameSelecionado = "cyberpunk";
  };

  //MORTALKOMBAT CUSTOM
  $("#mortalkombat1-botao-custom")[0].onclick = function () {
    gameSelecionado = "morta-kombat1";
  };
});
